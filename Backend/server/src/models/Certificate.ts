import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId;
  learningPathId?: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  certificateType: 'course' | 'path' | 'achievement';
  title: string;
  description: string;
  certificateId: string; // Unique certificate ID
  issuedAt: Date;
  completionDate: Date;
  skills: string[];
  grade?: string;
  score?: number;
}

const CertificateSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learningPathId: {
    type: Schema.Types.ObjectId,
    ref: 'LearningPath'
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  certificateType: {
    type: String,
    enum: ['course', 'path', 'achievement'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  certificateId: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date,
    required: true
  },
  skills: [{
    type: String
  }],
  grade: {
    type: String
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

CertificateSchema.index({ userId: 1, certificateType: 1 });
CertificateSchema.index({ certificateId: 1 }, { unique: true });

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
