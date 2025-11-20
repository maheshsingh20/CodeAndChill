import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware";
import { emailService } from "../services/emailService";

const router = Router();

// Simple test endpoint to verify route is working
router.get("/test", async (req: any, res: Response): Promise<void> => {
  res.json({ 
    success: true, 
    message: "Feedback route is working!",
    timestamp: new Date().toISOString()
  });
});

// Send feedback endpoint
router.post("/send", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, subject, message, rating, userEmail, userName } = req.body;
    
    if (!subject || !message) {
      res.status(400).json({ message: "Subject and message are required" });
      return;
    }

    const user = req.user;
    
    const feedbackData = {
      userName: userName || user.name,
      userEmail: userEmail || user.email,
      userId: user._id.toString(),
      category,
      subject,
      message,
      rating: rating ? parseInt(rating) : undefined
    };
    
    console.log('📧 Processing feedback from:', feedbackData.userName);
    
    // Send email using the email service
    const emailSent = await emailService.sendFeedbackEmail(feedbackData);
    
    if (emailSent) {
      res.json({ 
        success: true, 
        message: "Feedback sent successfully to admin",
        feedbackId: `feedback_${Date.now()}`
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send feedback email. Please try again later."
      });
    }

  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({ message: "Server error while processing feedback" });
  }
});

// Test email configuration (no auth required for testing)
router.get("/test-email", async (req: any, res: Response): Promise<void> => {
  try {
    const isConnected = await emailService.testConnection();
    
    if (isConnected) {
      res.json({ 
        success: true, 
        message: "Email service is configured correctly" 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Email service configuration failed" 
      });
    }
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error testing email configuration" 
    });
  }
});

// Send test feedback email (no auth required for testing)
router.post("/test-send", async (req: any, res: Response): Promise<void> => {
  try {
    const testFeedbackData = {
      userName: "Test User",
      userEmail: "test@example.com",
      userId: "test_user_123",
      category: "Bug Report",
      subject: "Test Feedback Email",
      message: "This is a test feedback email to verify the email service is working correctly.",
      rating: 5
    };
    
    const emailSent = await emailService.sendFeedbackEmail(testFeedbackData);
    
    if (emailSent) {
      res.json({ 
        success: true, 
        message: "Test feedback email sent successfully to singhmahesh2924@gmail.com" 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send test feedback email" 
      });
    }
  } catch (error) {
    console.error("Test email send error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error sending test feedback email" 
    });
  }
});

// Get feedback statistics (admin only)
router.get("/stats", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // This would typically query a feedback database
    // For now, return mock statistics
    
    const stats = {
      totalFeedback: 42,
      averageRating: 4.2,
      categoryBreakdown: {
        bug: 8,
        feature: 15,
        improvement: 12,
        content: 5,
        ui: 2,
        general: 0,
        other: 0
      },
      recentFeedback: [
        {
          id: 'fb_001',
          subject: 'Great platform!',
          category: 'general',
          rating: 5,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    res.json(stats);

  } catch (error) {
    console.error("Feedback stats error:", error);
    res.status(500).json({ message: "Server error while fetching feedback stats" });
  }
});

export default router;