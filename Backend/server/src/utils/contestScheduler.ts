import Contest from '../models/Contest';
import ContestLeaderboard from '../models/ContestLeaderboard';
import { User } from '../models/User';

/**
 * Update contest statuses based on current time
 */
export async function updateContestStatuses() {
  try {
    const now = new Date();
    
    // Find contests that need status updates
    const contests = await Contest.find({
      $or: [
        { status: 'upcoming', startTime: { $lte: now } },
        { status: 'active', endTime: { $lte: now } }
      ]
    });

    for (const contest of contests) {
      let newStatus = contest.status;
      
      if (now < contest.startTime) {
        newStatus = 'upcoming';
      } else if (now >= contest.startTime && now <= contest.endTime) {
        newStatus = 'active';
      } else if (now > contest.endTime) {
        newStatus = 'completed';
        
        // Update user profiles with contest results
        if (contest.status !== 'completed') {
          await updateUserProfilesWithContestResults(contest._id.toString());
        }
      }
      
      if (newStatus !== contest.status) {
        contest.status = newStatus;
        await contest.save();
        console.log(`Contest "${contest.title}" status updated to ${newStatus}`);
      }
    }
  } catch (error) {
    console.error('Error updating contest statuses:', error);
  }
}

/**
 * Update user profiles with contest results when contest completes
 */
async function updateUserProfilesWithContestResults(contestId: string) {
  try {
    const contest = await Contest.findById(contestId);
    if (!contest) return;

    // Get final leaderboard
    const leaderboard = await ContestLeaderboard.find({ contestId })
      .sort({ totalScore: -1, totalPenalty: 1, lastSubmissionTime: 1 })
      .limit(100);

    // Update user profiles
    for (let i = 0; i < leaderboard.length; i++) {
      const entry = leaderboard[i];
      const rank = i + 1;
      
      const user = await User.findById(entry.userId);
      if (!user) continue;

      // Initialize contestsParticipated if it doesn't exist
      if (!user.contestsParticipated) {
        user.contestsParticipated = [];
      }

      // Add contest participation record
      user.contestsParticipated.push({
        contestId: contest._id,
        contestName: contest.title,
        rank,
        score: entry.totalScore,
        problemsSolved: entry.problemsSolved,
        participatedAt: new Date()
      } as any);

      // Update contest stats
      if (rank === 1) {
        user.contestsWon = (user.contestsWon || 0) + 1;
      }

      // Award points based on rank
      let bonusPoints = 0;
      if (rank === 1) bonusPoints = 500;
      else if (rank === 2) bonusPoints = 300;
      else if (rank === 3) bonusPoints = 200;
      else if (rank <= 10) bonusPoints = 100;
      else if (rank <= 50) bonusPoints = 50;

      if (bonusPoints > 0) {
        user.totalPoints = (user.totalPoints || 0) + bonusPoints;
      }

      await user.save();
      console.log(`Updated profile for user ${user.name} - Rank: ${rank}, Bonus: ${bonusPoints}`);
    }

    console.log(`Updated ${leaderboard.length} user profiles for contest "${contest.title}"`);
  } catch (error) {
    console.error('Error updating user profiles with contest results:', error);
  }
}

/**
 * Start the contest status scheduler
 * Checks every minute for contests that need status updates
 */
export function startContestScheduler() {
  // Run immediately on startup
  updateContestStatuses();
  
  // Then run every minute
  setInterval(updateContestStatuses, 60 * 1000);
  
  console.log('Contest scheduler started - checking every minute');
}
