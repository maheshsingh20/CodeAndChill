import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISuccessStory extends Document {
  name: string;
  company: string;
  image: string;
  quote: string;
  skills: string[];
  linkedinUrl: string;
  userId: Types.ObjectId;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SuccessStorySchema = new Schema<ISuccessStory>(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    image: { type: String, required: true },
    quote: { type: String, required: true },
    skills: { type: [String], required: true },
    linkedinUrl: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SuccessStory = mongoose.model<ISuccessStory>("SuccessStory", SuccessStorySchema);