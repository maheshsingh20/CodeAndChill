import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  Building,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  Share2,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { careerService, Job } from '@/services/careerService';
import { JobApplicationModal } from '@/components/careers/JobApplicationModal';

export const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobData = await careerService.getJob(jobId!);
      setJob(jobData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationModal(false);
    // Refresh job data to update application count
    fetchJob();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job opportunity: ${job?.title} at ${job?.company}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you'd save this to the backend
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <div className="space-y-6">
            <div className="h-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded animate-pulse" />
            <div className="h-64 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded animate-pulse" />
            <div className="h-96 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button onClick={() => navigate('/careers')} className="bg-gradient-to-r from-purple-600 to-pink-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Careers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const daysUntilDeadline = careerService.getDaysUntilDeadline(job.applicationDeadline);
  const isExpired = daysUntilDeadline <= 0;
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/careers')}
          className="mb-6 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Careers
        </Button>

        {/* Job Header */}
        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-600"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-gray-600">
                    <Building className="w-8 h-8 text-purple-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-300">{job.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBookmark}
                  className={`border-gray-600 hover:bg-gray-800 ${isBookmarked ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span>{careerService.getTypeLabel(job.type)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span>{careerService.getExperienceLabel(job.experience)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span>{careerService.formatSalary(job.salary)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{job.applicationCount} applicants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{job.viewCount} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {careerService.getTimeAgo(job.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={`${isExpired ? 'bg-red-500/20 text-red-300 border-red-500/30' : isUrgent ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                  <Calendar className="w-3 h-3 mr-1" />
                  {isExpired ? 'Expired' : isUrgent ? `${daysUntilDeadline} days left` : `${daysUntilDeadline} days left`}
                </Badge>

                <Button
                  onClick={handleApply}
                  disabled={isExpired}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExpired ? 'Application Closed' : 'Apply Now'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Apply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleApply}
                  disabled={isExpired}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  {isExpired ? 'Application Closed' : 'Apply for this Position'}
                </Button>

                <Separator className="bg-gray-700" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Application Deadline:</span>
                    <span className={isExpired ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-gray-300'}>
                      {careerService.formatDate(job.applicationDeadline)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Department:</span>
                    <span className="text-gray-300">{job.department}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Job ID:</span>
                    <span className="text-gray-300 font-mono text-xs">{job._id.slice(-8)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-black/30 border-gray-600 text-gray-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {job.companyDescription || `${job.company} is a leading technology company focused on innovation and excellence.`}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Company Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <JobApplicationModal
          job={job}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};