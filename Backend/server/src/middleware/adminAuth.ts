import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";

export interface AdminRequest extends Request {
  admin?: any;
}

export const adminAuthMiddleware = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    const admin = await Admin.findById(decoded.id).select("-password");
    
    if (!admin) {
      res.status(401).json({ message: "Admin not found" });
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const checkPermission = (permission: string) => {
  return (req: AdminRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (req.admin.role === 'super_admin' || req.admin.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ message: "Insufficient permissions" });
    }
  };
};
