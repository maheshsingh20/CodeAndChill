import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Search,
  Filter,
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  ExternalLink
} from 'lucide-react';

interface JobApplication {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  applicantId: {
    _id: string;
    name: string;
    email: string;
  };
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
  updatedAt: string;
}

export const AdminJobApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/admin/job-applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/admin/job-applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setApplications(prev =>
          prev.map(app =>
            app._id === applicationId
              ? { ...app, status: newStatus as any, updatedAt: new Date().toISOString() }
              : app
          )
        );
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewing': return 'bg-blue-500';
      case 'shortlisted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'hired': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Job Applications</h1>
          <p className="text-gray-400">Manage and review job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">{applications.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{getStatusCount('pending')}</p>
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Reviewing</p>
                  <p className="text-2xl font-bold text-blue-400">{getStatusCount('reviewing')}</p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Shortlisted</p>
                  <p className="text-2xl font-bold text-green-400">{getStatusCount('shortlisted')}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Hired</p>
                  <p className="text-2xl font-bold text-purple-400">{getStatusCount('hired')}</p>
                </div>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, job title, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-600 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Applicant</TableHead>
                    <TableHead className="text-gray-300">Job</TableHead>
                    <TableHead className="text-gray-300">Applied Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application._id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{application.fullName}</p>
                          <p className="text-gray-400 text-sm">{application.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">{application.jobId.title}</p>
                          <p className="text-gray-400 text-sm">{application.jobId.company}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(application.status)} text-white`}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedApplication(application)}
                                className="text-purple-400 hover:text-purple-300"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Application Details</DialogTitle>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-gray-400 text-sm">Full Name</label>
                                      <p className="text-white">{selectedApplication.fullName}</p>
                                    </div>
                                    <div>
                                      <label className="text-gray-400 text-sm">Email</label>
                                      <p className="text-white flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {selectedApplication.email}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-gray-400 text-sm">Phone</label>
                                      <p className="text-white flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {selectedApplication.phone}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-gray-400 text-sm">Applied Date</label>
                                      <p className="text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-gray-400 text-sm">Job Position</label>
                                    <p className="text-white">{selectedApplication.jobId.title}</p>
                                    <p className="text-gray-400">{selectedApplication.jobId.company} • {selectedApplication.jobId.location}</p>
                                  </div>

                                  <div>
                                    <label className="text-gray-400 text-sm">Cover Letter</label>
                                    <div className="bg-gray-800 p-3 rounded-lg">
                                      <p className="text-gray-300 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-4">
                                    {selectedApplication.resumeUrl && (
                                      <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300">
                                        <a href={selectedApplication.resumeUrl} target="_blank" rel="noopener noreferrer">
                                          <FileText className="w-4 h-4 mr-2" />
                                          Resume
                                        </a>
                                      </Button>
                                    )}
                                    {selectedApplication.linkedinUrl && (
                                      <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300">
                                        <a href={selectedApplication.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          LinkedIn
                                        </a>
                                      </Button>
                                    )}
                                    {selectedApplication.portfolioUrl && (
                                      <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300">
                                        <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          Portfolio
                                        </a>
                                      </Button>
                                    )}
                                  </div>

                                  <div>
                                    <label className="text-gray-400 text-sm">Update Status</label>
                                    <Select
                                      value={selectedApplication.status}
                                      onValueChange={(value) => updateApplicationStatus(selectedApplication._id, value)}
                                    >
                                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-800 border-gray-600">
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="reviewing">Reviewing</SelectItem>
                                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="hired">Hired</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Select
                            value={application.status}
                            onValueChange={(value) => updateApplicationStatus(application._id, value)}
                          >
                            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewing">Reviewing</SelectItem>
                              <SelectItem value="shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="hired">Hired</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};