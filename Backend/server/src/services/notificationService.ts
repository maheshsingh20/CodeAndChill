import { Notification } from "../models/Notification";
import mongoose from "mongoose";

export class NotificationService {
  // Create a notification for a user
  static async createNotification(
    userId: mongoose.Types.ObjectId | string,
    type: 'achievement' | 'problem_solved' | 'course_completed' | 'contest' | 'system',
    title: string,
    message: string
  ) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        message
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Notify when user solves a problem
  static async notifyProblemSolved(userId: mongoose.Types.ObjectId | string, problemTitle: string) {
    return this.createNotification(
      userId,
      'problem_solved',
      'Problem Solved! 🎉',
      `Congratulations! You successfully solved "${problemTitle}"`
    );
  }

  // Notify when user completes a course
  static async notifyCourseCompleted(userId: mongoose.Types.ObjectId | string, courseTitle: string) {
    return this.createNotification(
      userId,
      'course_completed',
      'Course Completed! 📚',
      `Great job! You completed the course "${courseTitle}"`
    );
  }

  // Notify when user unlocks an achievement
  static async notifyAchievement(userId: mongoose.Types.ObjectId | string, achievementTitle: string) {
    return this.createNotification(
      userId,
      'achievement',
      'Achievement Unlocked! 🏆',
      `You earned the "${achievementTitle}" achievement!`
    );
  }

  // Notify about contest updates
  static async notifyContest(userId: mongoose.Types.ObjectId | string, contestTitle: string, message: string) {
    return this.createNotification(
      userId,
      'contest',
      contestTitle,
      message
    );
  }

  // System notifications
  static async notifySystem(userId: mongoose.Types.ObjectId | string, title: string, message: string) {
    return this.createNotification(
      userId,
      'system',
      title,
      message
    );
  }

  // Bulk notifications (e.g., for all users)
  static async notifyAllUsers(
    type: 'achievement' | 'problem_solved' | 'course_completed' | 'contest' | 'system',
    title: string,
    message: string,
    userIds: (mongoose.Types.ObjectId | string)[]
  ) {
    try {
      const notifications = userIds.map(userId => ({
        userId,
        type,
        title,
        message
      }));
      await Notification.insertMany(notifications);
    } catch (error) {
      console.error("Error creating bulk notifications:", error);
      throw error;
    }
  }

  // Clean up old read notifications (optional maintenance task)
  static async cleanupOldNotifications(daysOld: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await Notification.deleteMany({
        read: true,
        createdAt: { $lt: cutoffDate }
      });
      
      return result.deletedCount;
    } catch (error) {
      console.error("Error cleaning up notifications:", error);
      throw error;
    }
  }
}
