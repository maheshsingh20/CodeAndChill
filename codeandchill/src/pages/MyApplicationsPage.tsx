import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Eye,
  Trash2,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { careerService, JobApplication } from '@/services/careerService';

export const MyApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await careerService.getMyApplications({
        status: statusFilter || undefined,
        limit: 20
      });
      setApplications(response.applications);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      await careerService.withdrawApplication(applicationId);
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw application. Please try again.');
    }
  };

  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true;
    const job = typeof app.jobId === 'object' ? app.jobId : null;
    if (!job) return false;

    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const ApplicationCard: React.FC<{ application: JobApplication }> = ({ application }) => {
    const job = typeof application.jobId === 'object' ? application.jobId : null;

    if (!job) return null;

    const canWithdraw = ['pending', 'reviewing'].includes(application.status);
    const statusColor = careerService.getStatusColor(application.status);

    return (
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
              <p className="text-gray-400 mb-2">{job.company}</p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{careerService.getTypeLabel(job.type)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{careerService.formatSalary(job.salary)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={statusColor}>
                  {careerService.getStatusLabel(application.status)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Applied {careerService.getTimeAgo(application.applicationDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to={`/careers/${job._id}`}>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Eye className="w-4 h-4 mr-1" />
                  View Job
                </Button>
              </Link>

              {canWithdraw && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWithdrawApplication(application._id)}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Withdraw
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Cover Letter Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Cover Letter</h4>
              <p className="text-sm text-gray-400 line-clamp-2">
                {application.coverLetter}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {application.expectedSalary && (
                <div>
                  <span className="text-gray-500">Expected Salary:</span>
                  <p className="text-gray-300">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: job.salary.currency,
                      minimumFractionDigits: 0
                    }).format(application.expectedSalary)}
                  </p>
                </div>
              )}

              {application.availableFrom && (
                <div>
                  <span className="text-gray-500">Available From:</span>
                  <p className="text-gray-300">
                    {careerService.formatDate(application.availableFrom)}
                  </p>
                </div>
              )}

              <div>
                <span className="text-gray-500">Last Updated:</span>
                <p className="text-gray-300">
                  {careerService.getTimeAgo(application.lastUpdated)}
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-700">
              {application.resume && (
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  <FileText className="w-4 h-4" />
                  Resume
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {application.portfolio && (
                <a
                  href={application.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Portfolio
                </a>
              )}
            </div>

            {/* Feedback */}
            {application.feedback && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <h4 className="text-sm font-medium text-blue-300 mb-1">Feedback</h4>
                <p className="text-sm text-gray-300">{application.feedback}</p>
              </div>
            )}

            {/* Interview Scheduled */}
            {application.interviewScheduled && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                <h4 className="text-sm font-medium text-green-300 mb-1">Interview Scheduled</h4>
                <p className="text-sm text-gray-300">
                  {careerService.formatDate(application.interviewScheduled)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/careers')}
              className="mb-4 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
            <p className="text-gray-400">Track the status of your job applications</p>
          </div>

          <Link to="/careers">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Browse More Jobs
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10 bg-black/50 border-gray-600 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-black/50 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Under Review</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>

              {(statusFilter || searchTerm) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter('');
                    setSearchTerm('');
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {applications.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
              </h3>
              <p className="text-gray-400 mb-6">
                {applications.length === 0
                  ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Link to="/careers">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Browse Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Showing {filteredApplications.length} of {pagination.total} applications
              </p>
            </div>

            {filteredApplications.map((application) => (
              <ApplicationCard key={application._id} application={application} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};