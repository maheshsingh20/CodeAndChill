const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  experience: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  department: string;
  applicationDeadline: string;
  isActive: boolean;
  companyLogo?: string;
  companyDescription?: string;
  applicationCount: number;
  viewCount: number;
  postedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  _id: string;
  jobId: Job | string;
  applicantId: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  coverLetter: string;
  resume?: string;
  portfolio?: string;
  expectedSalary?: number;
  availableFrom?: string;
  additionalInfo?: string;
  applicationDate: string;
  lastUpdated: string;
  reviewNotes?: string;
  interviewScheduled?: string;
  feedback?: string;
}

export interface JobStats {
  totalJobs: number;
  totalApplications: number;
  jobsByType: Array<{ _id: string; count: number }>;
  jobsByExperience: Array<{ _id: string; count: number }>;
  jobsByDepartment: Array<{ _id: string; count: number }>;
  topCompanies: Array<{ _id: string; count: number }>;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  type?: string;
  experience?: string;
  department?: string;
  location?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface ApplicationsResponse {
  applications: JobApplication[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface ApplicationData {
  coverLetter: string;
  resume?: string;
  portfolio?: string;
  expectedSalary?: number;
  availableFrom?: string;
  additionalInfo?: string;
}

class CareerService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Get all jobs with filtering and pagination
  async getJobs(filters: JobFilters = {}): Promise<JobsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_URL}/jobs?${queryParams}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  }

  // Get job statistics
  async getJobStats(): Promise<JobStats> {
    const response = await fetch(`${API_URL}/jobs/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job statistics');
    }

    return response.json();
  }

  // Get single job by ID
  async getJob(jobId: string): Promise<Job> {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return response.json();
  }

  // Apply for a job
  async applyForJob(jobId: string, applicationData: ApplicationData): Promise<{ message: string; application: JobApplication }> {
    const response = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit application');
    }

    return response.json();
  }

  // Get user's applications
  async getMyApplications(filters: { page?: number; limit?: number; status?: string } = {}): Promise<ApplicationsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_URL}/jobs/applications/my?${queryParams}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return response.json();
  }

  // Get application by ID
  async getApplication(applicationId: string): Promise<JobApplication> {
    const response = await fetch(`${API_URL}/jobs/applications/${applicationId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }

    return response.json();
  }

  // Withdraw application
  async withdrawApplication(applicationId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/jobs/applications/${applicationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to withdraw application');
    }

    return response.json();
  }

  // Get featured/recommended jobs
  async getFeaturedJobs(limit: number = 6): Promise<Job[]> {
    const response = await fetch(`${API_URL}/jobs/featured/recommendations?limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch featured jobs');
    }

    return response.json();
  }

  // Helper methods for formatting
  formatSalary(salary: Job['salary']): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  getDaysUntilDeadline(deadlineString: string): number {
    const now = new Date();
    const deadline = new Date(deadlineString);
    const diffInMs = deadline.getTime() - now.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  getExperienceLabel(experience: Job['experience']): string {
    const labels = {
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
      lead: 'Lead',
      executive: 'Executive'
    };
    return labels[experience] || experience;
  }

  getTypeLabel(type: Job['type']): string {
    const labels = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'remote': 'Remote'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: JobApplication['status']): string {
    const labels = {
      pending: 'Pending Review',
      reviewing: 'Under Review',
      shortlisted: 'Shortlisted',
      interviewed: 'Interviewed',
      rejected: 'Rejected',
      hired: 'Hired'
    };
    return labels[status] || status;
  }

  getStatusColor(status: JobApplication['status']): string {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      reviewing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      shortlisted: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      interviewed: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
      hired: 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
}

export const careerService = new CareerService();