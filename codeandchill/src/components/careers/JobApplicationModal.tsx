import React, { useState } from 'react';
import { X, Upload, FileText, Link as LinkIcon, DollarSign, Calendar, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { careerService, Job, ApplicationData } from '@/services/careerService';

interface JobApplicationModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<ApplicationData>({
    coverLetter: '',
    resume: '',
    portfolio: '',
    expectedSalary: undefined,
    availableFrom: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.coverLetter.trim()) {
      setError('Cover letter is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await careerService.applyForJob(job._id, formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const daysUntilDeadline = careerService.getDaysUntilDeadline(job.applicationDeadline);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-white mb-2">Apply for Position</CardTitle>
              <div className="space-y-1">
                <h3 className="font-semibold text-purple-300">{job.title}</h3>
                <p className="text-sm text-gray-400">{job.company} • {job.location}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <Calendar className="w-3 h-3 mr-1" />
                    {daysUntilDeadline} days left
                  </Badge>
                  <Badge variant="outline" className="bg-black/30 border-gray-600 text-gray-300">
                    {careerService.getTypeLabel(job.type)}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-white flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Cover Letter *
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                className="min-h-32 bg-black/50 border-gray-600 text-white resize-none"
                required
              />
              <p className="text-xs text-gray-500">
                {formData.coverLetter.length}/1000 characters
              </p>
            </div>

            <Separator className="bg-gray-700" />

            {/* Resume */}
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-white flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Resume/CV
              </Label>
              <Input
                id="resume"
                type="url"
                placeholder="https://drive.google.com/file/d/... or https://resume.com/..."
                value={formData.resume || ''}
                onChange={(e) => handleInputChange('resume', e.target.value)}
                className="bg-black/50 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500">
                Provide a link to your resume (Google Drive, Dropbox, personal website, etc.)
              </p>
            </div>

            {/* Portfolio */}
            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Portfolio/Website
              </Label>
              <Input
                id="portfolio"
                type="url"
                placeholder="https://yourportfolio.com or https://github.com/username"
                value={formData.portfolio || ''}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                className="bg-black/50 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500">
                Share your portfolio, GitHub, or personal website
              </p>
            </div>

            <Separator className="bg-gray-700" />

            {/* Expected Salary */}
            <div className="space-y-2">
              <Label htmlFor="expectedSalary" className="text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Expected Salary ({job.salary.currency})
              </Label>
              <Input
                id="expectedSalary"
                type="number"
                placeholder="e.g., 75000"
                value={formData.expectedSalary || ''}
                onChange={(e) => handleInputChange('expectedSalary', e.target.value ? Number(e.target.value) : undefined)}
                className="bg-black/50 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500">
                Salary range for this position: {careerService.formatSalary(job.salary)}
              </p>
            </div>

            {/* Available From */}
            <div className="space-y-2">
              <Label htmlFor="availableFrom" className="text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Available From
              </Label>
              <Input
                id="availableFrom"
                type="date"
                value={formData.availableFrom || ''}
                onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                className="bg-black/50 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500">
                When can you start working?
              </p>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-white">
                Additional Information
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any additional information you'd like to share (optional)..."
                value={formData.additionalInfo || ''}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                className="bg-black/50 border-gray-600 text-white resize-none"
                rows={3}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.coverLetter.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};