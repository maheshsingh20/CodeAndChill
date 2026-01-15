import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  Building,
  Calendar,
  ChevronRight,
  Star,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { careerService, Job, JobStats, JobFilters } from '@/services/careerService';

export const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, featuredResponse, statsResponse] = await Promise.all([
        careerService.getJobs(filters),
        careerService.getFeaturedJobs(6),
        careerService.getJobStats()
      ]);

      setJobs(jobsResponse.jobs);
      setPagination(jobsResponse.pagination);
      setFeaturedJobs(featuredResponse);
      setStats(statsResponse);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setSearchLoading(true);
      const response = await careerService.getJobs(filters);
      setJobs(response.jobs);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }));
  };

  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const JobCard: React.FC<{ job: Job; featured?: boolean }> = ({ job, featured = false }) => {
    const daysUntilDeadline = careerService.getDaysUntilDeadline(job.applicationDeadline);
    const isUrgent = daysUntilDeadline <= 7;

    return (
      <Card className={`group h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer ${featured ? 'ring-2 ring-purple-500/30' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-600"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-gray-600">
                  <Building className="w-6 h-6 text-purple-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-400">{job.company}</p>
              </div>
            </div>
            {featured && (
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{careerService.getTypeLabel(job.type)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{careerService.formatSalary(job.salary)}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{careerService.getExperienceLabel(job.experience)}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
            {job.description}
          </p>

          <div className="space-y-3">
            {/* Skills */}
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 4).map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-xs bg-black/30 border-gray-600 text-gray-300"
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="outline" className="text-xs bg-black/30 border-gray-600 text-gray-300">
                  +{job.skills.length - 4}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{job.applicationCount} applied</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{job.viewCount} views</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className={isUrgent ? 'text-red-400' : ''}>
                  {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Expired'}
                </span>
              </div>
            </div>

            {/* Action */}
            <Link to={`/careers/${job._id}`} className="block">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="sm"
              >
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
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

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Briefcase className="text-purple-400" size={48} />
            Careers
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Join our team and build the future of technology. Discover exciting opportunities and grow your career with us.
          </p>
        </header>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{stats.totalJobs}</div>
                <div className="text-sm text-gray-400">Open Positions</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{stats.totalApplications}</div>
                <div className="text-sm text-gray-400">Applications</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{stats.topCompanies.length}</div>
                <div className="text-sm text-gray-400">Companies</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-pink-400 mb-1">{stats.jobsByDepartment.length}</div>
                <div className="text-sm text-gray-400">Departments</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="text-purple-400" />
              Featured Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} featured />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                className="pl-10 bg-black/50 border-gray-600 text-white"
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="bg-black/50 border-gray-600 text-white">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.experience || 'all'} onValueChange={(value) => handleFilterChange('experience', value)}>
              <SelectTrigger className="bg-black/50 border-gray-600 text-white">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.department || 'all'} onValueChange={(value) => handleFilterChange('department', value)}>
              <SelectTrigger className="bg-black/50 border-gray-600 text-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={filters.sortBy || 'createdAt'} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger className="w-40 bg-black/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Posted</SelectItem>
                  <SelectItem value="applicationDeadline">Deadline</SelectItem>
                  <SelectItem value="salary.min">Salary</SelectItem>
                  <SelectItem value="viewCount">Popularity</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortOrder || 'desc'} onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}>
                <SelectTrigger className="w-32 bg-black/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              All Positions ({pagination.total})
            </h2>
            <Link to="/careers/my-applications">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                My Applications
              </Button>
            </Link>
          </div>

          {searchLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-md animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Jobs Found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
                <Button onClick={clearFilters} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.current === 1}
                    onClick={() => handleFilterChange('page', pagination.current - 1)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Previous
                  </Button>

                  {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={pagination.current === page ? "default" : "outline"}
                        onClick={() => handleFilterChange('page', page)}
                        className={pagination.current === page
                          ? "bg-gradient-to-r from-purple-600 to-pink-600"
                          : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    disabled={pagination.current === pagination.pages}
                    onClick={() => handleFilterChange('page', pagination.current + 1)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};