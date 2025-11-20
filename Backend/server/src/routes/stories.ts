import { Router, Request, Response } from "express";
import { SuccessStory } from "../models";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

// Get all approved stories
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const stories = await SuccessStory.find({}).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error("Stories fetch error:", error);
    res.status(500).json({ message: "Server error fetching stories" });
  }
});

// Submit a new story
router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, company, quote, skills, linkedinUrl } = req.body;

    const newStory = new SuccessStory({
      name,
      company,
      quote,
      skills,
      linkedinUrl,
      userId: req.user._id,
      image: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`,
    });

    await newStory.save();
    res.status(201).json({ message: "Thank you! Your story has been submitted for review." });
  } catch (error) {
    console.error("Story submission error:", error);
    res.status(400).json({ message: "Error submitting story" });
  }
});

export default router;