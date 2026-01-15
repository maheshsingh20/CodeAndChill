import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  coverLetter: string;
  resume?: string; // File path or URL
  portfolio?: string; // URL
  expectedSalary?: number;
  availableFrom?: Date;
  additionalInfo?: string;
  applicationDate: Date;
  lastUpdated: Date;
  reviewNotes?: string;
  interviewScheduled?: Date;
  feedback?: string;
}

const JobApplicationSchema = new Schema<IJobApplication>({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'hired'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    required: true
  },
  resume: {
    type: String // File path or URL
  },
  portfolio: {
    type: String // URL
  },
  expectedSalary: {
    type: Number
  },
  availableFrom: {
    type: Date
  },
  additionalInfo: {
    type: String
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  reviewNotes: {
    type: String
  },
  interviewScheduled: {
    type: Date
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
JobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });
JobApplicationSchema.index({ status: 1, applicationDate: -1 });
JobApplicationSchema.index({ applicantId: 1, applicationDate: -1 });

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);