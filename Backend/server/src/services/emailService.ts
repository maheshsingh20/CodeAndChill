import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface FeedbackEmailData {
  userName: string;
  userEmail: string;
  userId: string;
  category: string;
  subject: string;
  message: string;
  rating?: number;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter using Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (not regular password)
      }
    });
  }

  async sendFeedbackEmail(feedbackData: FeedbackEmailData): Promise<boolean> {
    try {
      const { userName, userEmail, userId, category, subject, message, rating } = feedbackData;
      
      const emailSubject = `[Code & Chill Feedback] ${category ? `[${category}] ` : ''}${subject}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; color: #60a5fa;">📧 New Feedback from Code & Chill</h2>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin-top: 0;">User Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${userName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${userEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">User ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${userId}</td>
              </tr>
            </table>

            <h3 style="color: #1f2937;">Feedback Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Category:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${category || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Subject:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${subject}</td>
              </tr>
              ${rating ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Rating:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${'⭐'.repeat(rating)} (${rating}/5)</td>
              </tr>
              ` : ''}
            </table>

            <h3 style="color: #1f2937;">Message</h3>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #60a5fa;">
              <p style="margin: 0; color: #1f2937; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">Sent from Code & Chill Feedback System</p>
              <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `;

      const textContent = `
New Feedback from Code & Chill Platform

User Information:
- Name: ${userName}
- Email: ${userEmail}
- User ID: ${userId}

Feedback Details:
- Category: ${category || 'Not specified'}
- Subject: ${subject}
- Rating: ${rating ? `${rating}/5 stars` : 'Not provided'}

Message:
${message}

---
Sent from Code & Chill Feedback System
Timestamp: ${new Date().toLocaleString()}
      `;

      const mailOptions = {
        from: `"Code & Chill Feedback" <${process.env.GMAIL_USER}>`,
        to: 'singhmahesh2924@gmail.com',
        replyTo: userEmail, // Allow replying directly to the user
        subject: emailSubject,
        text: textContent,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Feedback email sent successfully:', result.messageId);
      return true;

    } catch (error) {
      console.error('❌ Error sending feedback email:', error);
      return false;
    }
  }

  // Test email connection
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();