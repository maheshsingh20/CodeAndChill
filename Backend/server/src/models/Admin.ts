import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
  lastLogin: Date;
}

const adminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'moderator'], 
    default: 'admin' 
  },
  permissions: { 
    type: [String], 
    default: ['view_users', 'view_content', 'edit_content'] 
  },
  lastLogin: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
