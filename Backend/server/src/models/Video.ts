import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  learningPathId: mongoose.Types.ObjectId;
  lessonId?: string;
  duration: number; // in seconds
  thumbnail: string;
  videoUrl: string;
  qualities: {
    quality: '360p' | '480p' | '720p' | '1080p';
    url: string;
    size: number;
  }[];
  subtitles: {
    language: string;
    url: string;
  }[];
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
  views: number;
  likes: mongoose.Types.ObjectId[];
  isPublished: boolean;
  order: number;
  tags: string[];
}

const VideoSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  learningPathId: {
    type: Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  },
  lessonId: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  thumbnail: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  qualities: [{
    quality: {
      type: String,
      enum: ['360p', '480p', '720p', '1080p'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  }],
  subtitles: [{
    language: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
VideoSchema.index({ learningPathId: 1, order: 1 });
VideoSchema.index({ uploadedBy: 1 });
VideoSchema.index({ isPublished: 1 });
VideoSchema.index({ tags: 1 });

export default mongoose.model<IVideo>('Video', VideoSchema);
