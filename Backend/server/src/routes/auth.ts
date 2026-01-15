import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "../config/passport";
import { User } from "../models";

const router = Router();

// Signup route
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      provider: 'local'
    });

    await newUser.save();

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT secret not configured" });
      return;
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    // Check if user signed up with OAuth
    if (!user.password && (user.githubId || user.googleId)) {
      res.status(400).json({ 
        message: "This account was created with social login. Please use the appropriate social login button." 
      });
      return;
    }

    if (!user.password) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT secret not configured" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// GitHub OAuth routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback", 
  passport.authenticate("github", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      if (!process.env.JWT_SECRET) {
        return res.redirect(`${process.env.CLIENT_URL}/auth?error=server_error`);
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("GitHub callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_error`);
    }
  }
);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      if (!process.env.JWT_SECRET) {
        return res.redirect(`${process.env.CLIENT_URL}/auth?error=server_error`);
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_error`);
    }
  }
);

export default router;