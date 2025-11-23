import mongoose, { Document, Schema } from 'mongoose';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  learningPathId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learningPathId: {
    type: Schema.Types.ObjectId,
    ref: 'LearningPath',
    required: true
  }
}, {
  timestamps: true
});

BookmarkSchema.index({ userId: 1, learningPathId: 1 }, { unique: true });

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
