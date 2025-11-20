import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";
    
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.log("⚠️  Server will continue running without database connection");
  }
};