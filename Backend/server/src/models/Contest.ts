import mongoose, { Document, Schema } from 'mongoose';

export interface IContest extends Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  status: 'upcoming' | 'active' | 'completed';
  problems: {
    problemId: mongoose.Types.ObjectId;
    points: number;
    order: number;
  }[];
  participants: mongoose.Types.ObjectId[];
  rules: string;
  prizes: {
    position: number;
    description: string;
    points?: number;
  }[];
  maxParticipants?: number;
  isPublic: boolean;
  createdBy: mongoose.Types.ObjectId;
  tags: string[];
}

const ContestSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 30,
    max: 300 // 5 hours max
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  problems: [{
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true
    },
    points: {
      type: Number,
      required: true,
      min: 100,
      max: 3000
    },
    order: {
      type: Number,
      required: true
    }
  }],
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  rules: {
    type: String,
    default: 'Standard contest rules apply'
  },
  prizes: [{
    position: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    points: {
      type: Number
    }
  }],
  maxParticipants: {
    type: Number,
    default: 1000
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
ContestSchema.index({ status: 1, startTime: 1 });
ContestSchema.index({ startTime: 1, endTime: 1 });
ContestSchema.index({ participants: 1 });
ContestSchema.index({ isPublic: 1, status: 1 });

export default mongoose.model<IContest>('Contest', ContestSchema);