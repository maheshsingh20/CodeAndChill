import mongoose, { Document, Schema } from 'mongoose';

export interface ICollaborativeSession extends Document {
  title: string;
  description?: string;
  hostId: mongoose.Types.ObjectId;
  participants: {
    userId: mongoose.Types.ObjectId;
    username: string;
    joinedAt: Date;
    isActive: boolean;
    cursor?: {
      line: number;
      column: number;
    };
    selection?: {
      startLine: number;
      startColumn: number;
      endLine: number;
      endColumn: number;
    };
  }[];
  code: string;
  language: string;
  isActive: boolean;
  isPublic: boolean;
  maxParticipants: number;
  sessionToken: string;
  createdAt: Date;
  lastActivity: Date;
  chat: {
    userId: mongoose.Types.ObjectId;
    username: string;
    message: string;
    timestamp: Date;
    type: 'message' | 'system' | 'code_change';
  }[];
  codeHistory: {
    userId: mongoose.Types.ObjectId;
    username: string;
    change: string;
    timestamp: Date;
    operation: 'insert' | 'delete' | 'replace';
    position: {
      line: number;
      column: number;
    };
  }[];
}

const CollaborativeSessionSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    cursor: {
      line: { type: Number, default: 0 },
      column: { type: Number, default: 0 }
    },
    selection: {
      startLine: { type: Number },
      startColumn: { type: Number },
      endLine: { type: Number },
      endColumn: { type: Number }
    }
  }],
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript',
    enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'html', 'css']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  maxParticipants: {
    type: Number,
    default: 10,
    min: 2,
    max: 50
  },
  sessionToken: {
    type: String,
    required: true,
    unique: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  chat: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['message', 'system', 'code_change'],
      default: 'message'
    }
  }],
  codeHistory: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    change: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    operation: {
      type: String,
      enum: ['insert', 'delete', 'replace'],
      required: true
    },
    position: {
      line: { type: Number, required: true },
      column: { type: Number, required: true }
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries (sessionToken index is automatically created by unique: true)
CollaborativeSessionSchema.index({ hostId: 1, isActive: 1 });
CollaborativeSessionSchema.index({ 'participants.userId': 1, isActive: 1 });
CollaborativeSessionSchema.index({ isPublic: 1, isActive: 1 });
CollaborativeSessionSchema.index({ lastActivity: -1 });

export default mongoose.model<ICollaborativeSession>('CollaborativeSession', CollaborativeSessionSchema);