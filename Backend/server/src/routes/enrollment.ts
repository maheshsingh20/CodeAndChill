import { Router, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { GeneralCourse, Enrollment } from "../models";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

// Initialize Razorpay lazily
let razorpay: Razorpay;
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return razorpay;
};

// Check enrollment status for a course
router.get("/status/:slug", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await GeneralCourse.findOne({ slug: req.params.slug }).select("_id");
    
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: course._id,
    });

    if (enrollment && (enrollment.status === "paid" || enrollment.status === "enrolled")) {
      res.json({ isEnrolled: true });
      return;
    }

    res.json({ isEnrolled: false });
  } catch (error) {
    console.error("Enrollment status check error:", error);
    res.status(500).json({ message: "Server error checking enrollment status" });
  }
});

// Create payment order for paid courses
router.post("/payment/create-order", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseSlug } = req.body;
    const course = await GeneralCourse.findOne({ slug: courseSlug });
    
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.cost <= 0) {
      res.status(400).json({ message: "Course is free" });
      return;
    }

    const amount = Math.round(course.cost * 100); // INR to paise
    
    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${course._id}_${Date.now()}`,
      notes: { courseId: course._id.toString(), userId: req.user._id.toString() },
    });

    await Enrollment.findOneAndUpdate(
      { userId: req.user._id, courseId: course._id },
      { 
        $set: { 
          status: "pending", 
          price: course.cost, 
          "payment.orderId": order.id 
        } 
      },
      { upsert: true, new: true }
    );

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      user: { name: req.user.name, email: req.user.email },
      course: { title: course.title, slug: course.slug, cost: course.cost },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// Verify payment
router.post("/payment/verify", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseSlug } = req.body;
    
    const course = await GeneralCourse.findOne({ slug: courseSlug });
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ message: "Invalid payment signature" });
      return;
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: req.user._id, courseId: course._id, "payment.orderId": razorpay_order_id },
      {
        $set: {
          status: "paid",
          "payment.paymentId": razorpay_payment_id,
          "payment.signature": razorpay_signature,
        },
      },
      { new: true }
    );

    if (!enrollment) {
      res.status(404).json({ message: "Enrollment not found for this order" });
      return;
    }

    res.json({ success: true, message: "Payment successful!" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

export default router;