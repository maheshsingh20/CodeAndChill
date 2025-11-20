import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Send, Star } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface FeedbackModalProps {
  children: React.ReactNode;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ children }) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: '',
    subject: '',
    message: '',
    rating: ''
  });

  const feedbackCategories = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement Suggestion' },
    { value: 'content', label: 'Content Feedback' },
    { value: 'ui', label: 'UI/UX Feedback' },
    { value: 'general', label: 'General Feedback' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setError(null);
      
      // Try to send via backend API first
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/feedback/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            category: formData.category,
            subject: formData.subject,
            message: formData.message,
            rating: formData.rating,
            userName: formData.name,
            userEmail: formData.email
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Backend submission successful
          setSubmitted(true);
          
          // Reset form after a delay
          setTimeout(() => {
            setIsOpen(false);
            setSubmitted(false);
            setError(null);
            setFormData({
              name: user?.name || '',
              email: user?.email || '',
              category: '',
              subject: '',
              message: '',
              rating: ''
            });
          }, 3000);
          
          return;
        } else {
          throw new Error(result.message || 'Backend submission failed');
        }
      } catch (backendError) {
        console.log('Backend feedback submission failed:', backendError);
        setError('Unable to send feedback via server. Opening email client as fallback...');
        
        // Wait a moment to show the error message
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Fallback to email client method
      const emailSubject = `[Code & Chill Feedback] ${formData.category ? `[${feedbackCategories.find(c => c.value === formData.category)?.label}] ` : ''}${formData.subject}`;
      
      const emailBody = `
Feedback from Code & Chill Platform

User Details:
- Name: ${formData.name}
- Email: ${formData.email}
- User ID: ${user?._id || 'Not logged in'}

Feedback Details:
- Category: ${feedbackCategories.find(c => c.value === formData.category)?.label || 'Not specified'}
- Subject: ${formData.subject}
- Rating: ${formData.rating ? `${formData.rating}/5 stars` : 'Not provided'}

Message:
${formData.message}

---
Sent from Code & Chill Feedback System
Timestamp: ${new Date().toLocaleString()}
      `.trim();

      // Create mailto link
      const mailtoLink = `mailto:singhmahesh2924@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Mark as submitted
      setSubmitted(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          category: '',
          subject: '',
          message: '',
          rating: ''
        });
      }, 2000);

    } catch (error) {
      console.error('Error sending feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.subject.trim() && formData.message.trim() && formData.name.trim() && formData.email.trim();

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Thank You for Your Feedback!
            </h3>
            <p className="text-gray-400 text-sm">
              Your feedback has been received and will be sent to our admin team. 
              We appreciate your input to help improve Code & Chill!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Send Feedback
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select feedback category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {feedbackCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-gray-300">Overall Rating (Optional)</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleInputChange('rating', rating.toString())}
                  className={`p-1 rounded transition-colors ${
                    parseInt(formData.rating) >= rating
                      ? 'text-yellow-400'
                      : 'text-gray-500 hover:text-yellow-300'
                  }`}
                >
                  <Star className="w-6 h-6" fill={parseInt(formData.rating) >= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-gray-300">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of your feedback"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please provide detailed feedback..."
              className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="mb-1">📧 This will open your email client with pre-filled feedback.</p>
          <p>Your feedback will be sent to: <span className="text-blue-400">singhmahesh2924@gmail.com</span></p>
        </div>
      </DialogContent>
    </Dialog>
  );
};