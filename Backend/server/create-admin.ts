import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Admin } from "./src/models/Admin";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill");
    console.log("Connected to MongoDB");

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ role: 'super_admin' });
    if (existingAdmin) {
      console.log("Super admin already exists!");
      console.log("Email:", existingAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const superAdmin = new Admin({
      name: "Super Admin",
      email: "admin@codeandchill.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: [
        "view_users",
        "edit_users",
        "delete_users",
        "view_content",
        "edit_content",
        "delete_content",
        "manage_admins"
      ]
    });

    await superAdmin.save();
    console.log("Super admin created successfully!");
    console.log("Email: admin@codeandchill.com");
    console.log("Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
