import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEnrollment extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  status: "pending" | "enrolled" | "paid" | "cancelled";
  price: number;
  payment: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    currency?: string;
    method?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "GenralCourse", required: true },
    status: {
      type: String,
      enum: ["pending", "enrolled", "paid", "cancelled"],
      default: "pending",
    },
    price: { type: Number, required: true },
    payment: {
      orderId: String,
      paymentId: String,
      signature: String,
      currency: String,
      method: String,
    },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

export const canAccessCourse = async (userId: string, courseId: string): Promise<boolean> => {
  const enrollment = await Enrollment.findOne({ userId, courseId });
  if (!enrollment) return false;
  return enrollment.status === "paid" || enrollment.status === "enrolled";
};