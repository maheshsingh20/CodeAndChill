import express from 'express';
import Job from '../models/Job';
import JobApplication from '../models/JobApplication';
import { authMiddleware } from '../middleware/auth';
import { adminAuthMiddleware } from '../middleware/adminAuth';
import mongoose from 'mongoose';

const router = express.Router();

// Get all jobs with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      experience,
      department,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter: any = { isActive: true, applicationDeadline: { $gte: new Date() } };

    // Apply filters
    if (type && type !== 'all') filter.type = type;
    if (experience && experience !== 'all') filter.experience = experience;
    if (department && department !== 'all') filter.department = department;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) {
      filter.$text = { $search: search as string };
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await Job.find(filter)
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('postedBy', 'name email')
      .select('-__v');

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job statistics
router.get('/stats', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalApplications = await JobApplication.countDocuments();
    
    const jobsByType = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const jobsByExperience = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$experience', count: { $sum: 1 } } }
    ]);

    const jobsByDepartment = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const topCompanies = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalJobs,
      totalApplications,
      jobsByType,
      jobsByExperience,
      jobsByDepartment,
      topCompanies
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({ error: 'Failed to fetch job statistics' });
  }
});

// Get single job by ID
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const job = await Job.findById(jobId)
      .populate('postedBy', 'name email')
      .select('-__v');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Increment view count
    await Job.findByIdAndUpdate(jobId, { $inc: { viewCount: 1 } });

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Apply for a job
router.post('/:jobId/apply', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;
    const {
      coverLetter,
      resume,
      portfolio,
      expectedSalary,
      availableFrom,
      additionalInfo
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive || job.applicationDeadline < new Date()) {
      return res.status(400).json({ error: 'Job not available for applications' });
    }

    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
      jobId,
      applicantId: userId
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create new application
    const application = new JobApplication({
      jobId,
      applicantId: userId,
      coverLetter,
      resume,
      portfolio,
      expectedSalary,
      availableFrom,
      additionalInfo
    });

    await application.save();

    // Increment application count for the job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: application.toObject()
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get user's applications
router.get('/applications/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const filter: any = { applicantId: userId };
    if (status) filter.status = status;

    const applications = await JobApplication.find(filter)
      .populate({
        path: 'jobId',
        select: 'title company location type experience salary applicationDeadline'
      })
      .sort({ applicationDate: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .select('-__v');

    const total = await JobApplication.countDocuments(filter);

    res.json({
      applications,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get application by ID
router.get('/applications/:applicationId', authMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const application = await JobApplication.findOne({
      _id: applicationId,
      applicantId: userId
    })
      .populate({
        path: 'jobId',
        select: 'title company location type experience salary description requirements responsibilities benefits'
      })
      .select('-__v');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Withdraw application
router.delete('/applications/:applicationId', authMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const application = await JobApplication.findOne({
      _id: applicationId,
      applicantId: userId
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Only allow withdrawal if status is pending or reviewing
    if (!['pending', 'reviewing'].includes(application.status)) {
      return res.status(400).json({ 
        error: 'Cannot withdraw application at this stage' 
      });
    }

    await JobApplication.findByIdAndDelete(applicationId);

    // Decrement application count for the job
    await Job.findByIdAndUpdate(application.jobId, { 
      $inc: { applicationCount: -1 } 
    });

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
});

// Get featured/recommended jobs
router.get('/featured/recommendations', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Get jobs with high view counts and recent postings
    const featuredJobs = await Job.find({
      isActive: true,
      applicationDeadline: { $gte: new Date() }
    })
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(Number(limit))
      .populate('postedBy', 'name')
      .select('-__v');

    res.json(featuredJobs);
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    res.status(500).json({ error: 'Failed to fetch featured jobs' });
  }
});

// Admin routes for managing job applications
router.get('/admin/applications', adminAuthMiddleware, async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate('jobId', 'title company location department type')
      .populate('applicantId', 'name email')
      .sort({ appliedAt: -1 })
      .select('-__v');

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status (admin only)
router.patch('/admin/applications/:applicationId/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('jobId', 'title company')
     .populate('applicantId', 'name email');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Get application statistics (admin only)
router.get('/admin/applications/stats', adminAuthMiddleware, async (req, res) => {
  try {
    const stats = await JobApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await JobApplication.countDocuments();
    const recentApplications = await JobApplication.countDocuments({
      appliedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      total: totalApplications,
      recent: recentApplications,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({ error: 'Failed to fetch application stats' });
  }
});

export default router;