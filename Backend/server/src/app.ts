// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
import path from "path";
const envPath = path.resolve(process.cwd(), ".env");
console.log("Loading .env from:", envPath);
// Don't override existing environment variables (from docker-compose)
dotenv.config({ path: envPath, override: false });

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDatabase } from "./config";
import routes from "./routes";
import { CollaborativeHandler } from "./websocket/collaborativeHandler";
import { setupSocketHandlers } from "./socket/socketHandlers";

// Validate required environment variables
const requiredEnvVars = [
  "GEMINI_API_KEY",
  "JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET"
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ FATAL ERROR: ${envVar} is not defined in .env file.`);
    process.exit(1);
  }
}

// Create Express app and HTTP server
const app = express();
const server = createServer(app);

// Setup Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Make io available to routes
app.set('io', io);

// Initialize collaborative handler
const collaborativeHandler = new CollaborativeHandler(io);

// Setup enhanced socket handlers
setupSocketHandlers(io);

// Cleanup inactive sessions every hour
setInterval(() => {
  collaborativeHandler.cleanupInactiveSessions();
}, 60 * 60 * 1000);

// Middleware
app.use(cors({ 
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173", 
      "http://localhost:5174", 
      "http://localhost:5175",
      "http://localhost:80",
      "http://localhost"
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    console.log(`CORS: Request from origin: ${origin}`);
    // Always allow in development
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to database
connectDatabase();

// Import additional routes
import realtimeRoutes from "./routes/realtime";

// Routes
app.use("/api", routes);
app.use("/api/realtime", realtimeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ message: "Internal server error" });
});

export default server;