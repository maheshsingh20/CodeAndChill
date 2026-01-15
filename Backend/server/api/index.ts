// Vercel serverless function entry point
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "../src/config/passport";
import { connectDatabase } from "../src/config";
import routes from "../src/routes";

const app = express();

// Middleware
app.use(cors({ 
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to database (only once)
let isConnected = false;
const ensureConnection = async () => {
  if (!isConnected) {
    await connectDatabase();
    isConnected = true;
  }
};

// Routes
app.use("/api", async (req, res, next) => {
  await ensureConnection();
  next();
}, routes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
