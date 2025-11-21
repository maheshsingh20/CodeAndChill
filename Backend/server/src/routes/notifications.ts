import { Router, Response } from "express";
import { Notification } from "../models/Notification";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

// Get user notifications
router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false
    });

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as read
router.put("/:id/read", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.json({ notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark all notifications as read
router.put("/read-all", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete notification
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create notification (for testing or system use)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, title, message } = req.body;

    const notification = new Notification({
      userId: req.user._id,
      type,
      title,
      message
    });

    await notification.save();
    res.status(201).json({ notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Subscribe to push notifications
router.post("/subscribe", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Store the push subscription (you can add a PushSubscription model if needed)
    // For now, just acknowledge the subscription
    res.json({ message: "Push notification subscription received" });
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate sample notifications (for testing)
router.post("/generate-samples", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sampleNotifications = [
      {
        userId: req.user._id,
        type: 'achievement',
        title: 'Achievement Unlocked! 🏆',
        message: 'You earned the "First Steps" achievement for solving your first problem!'
      },
      {
        userId: req.user._id,
        type: 'problem_solved',
        title: 'Problem Solved! 🎉',
        message: 'Congratulations! You successfully solved "Two Sum"'
      },
      {
        userId: req.user._id,
        type: 'course_completed',
        title: 'Course Completed! 📚',
        message: 'Great job! You completed the course "JavaScript Fundamentals"'
      },
      {
        userId: req.user._id,
        type: 'contest',
        title: 'Contest Starting Soon! ⚡',
        message: 'The "Weekly Challenge #42" contest starts in 1 hour. Get ready!'
      },
      {
        userId: req.user._id,
        type: 'system',
        title: 'Welcome to Code & Chill! 👋',
        message: 'Start your coding journey by solving your first problem or taking a course.'
      }
    ];

    await Notification.insertMany(sampleNotifications);
    res.json({ message: "Sample notifications created", count: sampleNotifications.length });
  } catch (error) {
    console.error("Error generating sample notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
