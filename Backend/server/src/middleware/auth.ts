import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

// Augment Express Request to include user
declare global {
  namespace Express {
    interface User {
      _id: any;
      id?: string;
      userId?: string;
      name: string;
      email: string;
      profilePicture?: string;
      avatar?: string;
      role?: string;
      [key: string]: any;
    }
  }
}

export interface AuthRequest extends Request {
  user?: Express.User;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT secret not configured" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user as any;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
