import express from 'express';
import ActivityLog from '../models/ActivityLog';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Start a new activity session
router.post('/session/start', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const { activityType, metadata } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Start a new session
    const newSession = {
      startTime: new Date(),
      duration: 0,
      activities: [{
        type: activityType || 'general_browsing',
        startTime: new Date(),
        duration: 0,
        metadata: metadata || {}
      }]
    };
    
    // Try to find existing log first
    let activityLog = await ActivityLog.findOne({ userId, date: today });
    
    if (!activityLog) {
      // Create new log if it doesn't exist
      try {
        activityLog = await ActivityLog.create({
          userId,
          date: today,
          sessions: [newSession],
          totalTimeSpent: 0,
          lastActivity: new Date()
        });
      } catch (createError: any) {
        // Handle duplicate key error - try to find existing log again
        if (createError.code === 11000) {
          activityLog = await ActivityLog.findOne({ userId, date: today });
          if (activityLog) {
            activityLog.sessions.push(newSession);
            activityLog.lastActivity = new Date();
            await activityLog.save();
          } else {
            throw createError;
          }
        } else {
          throw createError;
        }
      }
    } else {
      // Update existing log with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          // Refresh the document to get latest version
          const freshLog = await ActivityLog.findOne({ userId, date: today });
          if (freshLog) {
            freshLog.sessions.push(newSession);
            freshLog.lastActivity = new Date();
            await freshLog.save();
            activityLog = freshLog;
            break;
          } else {
            throw new Error('Activity log not found');
          }
        } catch (saveError: any) {
          if (saveError.name === 'VersionError' && retries > 1) {
            retries--;
            console.log(`Version conflict starting session, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
            continue;
          } else {
            throw saveError;
          }
        }
      }
    }
    
    res.json({ 
      sessionId: activityLog.sessions[activityLog.sessions.length - 1]._id,
      message: 'Session started successfully' 
    });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// Update current activity
router.post('/update', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const { sessionId, activityType, metadata, timeSpent } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Retry logic for version conflicts
    let retries = 3;
    while (retries > 0) {
      try {
        const activityLog = await ActivityLog.findOne({ userId, date: today });
        
        if (!activityLog) {
          return res.status(404).json({ error: 'No active session found' });
        }
        
        // Find the current session
        const currentSession = activityLog.sessions.find(s => s._id?.toString() === sessionId);
        
        if (!currentSession) {
          return res.status(404).json({ error: 'Session not found' });
        }
        
        // Update the last activity in the session
        const lastActivity = currentSession.activities[currentSession.activities.length - 1];
        if (lastActivity && !lastActivity.endTime) {
          lastActivity.endTime = new Date();
          lastActivity.duration = timeSpent || Math.floor((new Date().getTime() - lastActivity.startTime.getTime()) / 1000);
        }
        
        // Add new activity if type changed
        if (activityType && activityType !== lastActivity?.type) {
          currentSession.activities.push({
            type: activityType,
            startTime: new Date(),
            duration: 0,
            metadata: metadata || {}
          });
        }
        
        // Update session duration
        currentSession.duration = currentSession.activities.reduce((sum, activity) => sum + activity.duration, 0);
        
        // Update total time spent
        activityLog.totalTimeSpent = activityLog.sessions.reduce((sum, session) => sum + session.duration, 0);
        activityLog.lastActivity = new Date();
        
        await activityLog.save();
        
        res.json({ message: 'Activity updated successfully' });
        return; // Success, exit retry loop
        
      } catch (saveError: any) {
        if (saveError.name === 'VersionError' && retries > 1) {
          retries--;
          console.log(`Version conflict updating activity, retrying... (${retries} attempts left)`);
          // Wait a bit before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
          continue;
        } else {
          throw saveError;
        }
      }
    }
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// End current session
router.post('/session/end', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const { sessionId, timeSpent } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Use atomic update to avoid version conflicts
    const result = await ActivityLog.findOneAndUpdate(
      { 
        userId, 
        date: today,
        'sessions._id': sessionId,
        'sessions.endTime': { $exists: false } // Only update if session is still active
      },
      {
        $set: {
          'sessions.$.endTime': new Date(),
          lastActivity: new Date()
        }
      },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Active session not found' });
    }
    
    // Update the last activity duration and recalculate totals in a separate operation
    const session = result.sessions.find(s => s._id?.toString() === sessionId);
    if (session && session.activities.length > 0) {
      const lastActivityIndex = session.activities.length - 1;
      const calculatedDuration = timeSpent || Math.floor((new Date().getTime() - session.activities[lastActivityIndex].startTime.getTime()) / 1000);
      
      await ActivityLog.findOneAndUpdate(
        { 
          userId, 
          date: today,
          'sessions._id': sessionId
        },
        {
          $set: {
            [`sessions.$.activities.${lastActivityIndex}.endTime`]: new Date(),
            [`sessions.$.activities.${lastActivityIndex}.duration`]: calculatedDuration
          }
        }
      );
      
      // Recalculate totals
      const updatedLog = await ActivityLog.findOne({ userId, date: today });
      if (updatedLog) {
        const totalTimeSpent = updatedLog.sessions.reduce((sum, s) => {
          const sessionDuration = s.activities.reduce((actSum, act) => actSum + act.duration, 0);
          return sum + sessionDuration;
        }, 0);
        
        await ActivityLog.findOneAndUpdate(
          { userId, date: today },
          { $set: { totalTimeSpent } }
        );
      }
    }
    
    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Get daily activity data
router.get('/daily/:days?', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.params.days || '7');
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);
    
    const activityLogs = await ActivityLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    // Create array for all days in range
    const dailyActivity = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayLog = activityLogs.find(log => 
        log.date.toISOString().split('T')[0] === dateStr
      );
      
      dailyActivity.push({
        date: dateStr,
        day: dayName,
        timeSpent: dayLog ? Math.floor(dayLog.totalTimeSpent / 60) : 0, // Convert to minutes
        sessions: dayLog ? dayLog.sessions.length : 0,
        activities: dayLog ? dayLog.sessions.reduce((sum, session) => sum + session.activities.length, 0) : 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json({ dailyActivity });
  } catch (error) {
    console.error('Error fetching daily activity:', error);
    res.status(500).json({ error: 'Failed to fetch daily activity' });
  }
});

// Get activity breakdown by type
router.get('/breakdown/:days?', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.params.days || '7');
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);
    
    const activityLogs = await ActivityLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });
    
    const breakdown = {
      course_viewing: 0,
      problem_solving: 0,
      quiz_taking: 0,
      skill_testing: 0,
      forum_browsing: 0,
      general_browsing: 0
    };
    
    activityLogs.forEach(log => {
      log.sessions.forEach(session => {
        session.activities.forEach(activity => {
          breakdown[activity.type] += Math.floor(activity.duration / 60); // Convert to minutes
        });
      });
    });
    
    res.json({ breakdown });
  } catch (error) {
    console.error('Error fetching activity breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch activity breakdown' });
  }
});

// Get current session info
router.get('/session/current', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activityLog = await ActivityLog.findOne({ userId, date: today });
    
    if (!activityLog || activityLog.sessions.length === 0) {
      return res.json({ hasActiveSession: false });
    }
    
    // Find the most recent session without an end time
    const activeSession = activityLog.sessions.find(session => !session.endTime);
    
    if (!activeSession) {
      return res.json({ hasActiveSession: false });
    }
    
    res.json({
      hasActiveSession: true,
      sessionId: activeSession._id,
      startTime: activeSession.startTime,
      currentActivity: activeSession.activities[activeSession.activities.length - 1]?.type,
      totalTimeToday: Math.floor(activityLog.totalTimeSpent / 60) // in minutes
    });
  } catch (error) {
    console.error('Error fetching current session:', error);
    res.status(500).json({ error: 'Failed to fetch current session' });
  }
});

export default router;