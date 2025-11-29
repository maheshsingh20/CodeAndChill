import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityPostSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);
