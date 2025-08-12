import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import courseRoutes from "./routes/course.js";
import progressRoutes from "./routes/progress.js";  
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());

// --- MongoDB Connection ---
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- User Schema and Model ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// --- Middleware to protect routes ---
const authMiddleware = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// =======================================================
// ## AUTHENTICATION ROUTES ##
// =======================================================

// SIGN UP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      message: "User created successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup." });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: "Logged in successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
});



// =======================================================
// ## AI ASSISTANT ROUTE ##
// =======================================================
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: true,
      }),
    });

    if (!ollamaRes.ok || !ollamaRes.body) {
      throw new Error(`Ollama responded with status: ${ollamaRes.status}`);
    }

    res.setHeader("Content-Type", "application/octet-stream");
    ollamaRes.body.pipe(res);
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Failed to get response from Ollama" });
  }
});

// --- New: Use Course Routes ---
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
// --- Start the Server ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
