import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
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
  applicationDeadline: Date;
  isActive: boolean;
  companyLogo?: string;
  companyDescription?: string;
  applicationCount: number;
  viewCount: number;
  postedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: true
  },
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  responsibilities: [{
    type: String,
    required: true
  }],
  benefits: [{
    type: String
  }],
  skills: [{
    type: String,
    required: true
  }],
  department: {
    type: String,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  companyLogo: {
    type: String
  },
  companyDescription: {
    type: String
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
JobSchema.index({ title: 'text', company: 'text', skills: 'text' });
JobSchema.index({ type: 1, experience: 1, department: 1 });
JobSchema.index({ isActive: 1, applicationDeadline: 1 });
JobSchema.index({ createdAt: -1 });

export default mongoose.model<IJob>('Job', JobSchema);