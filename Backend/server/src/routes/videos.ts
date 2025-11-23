import express, { Request, Response } from 'express';
import Video from '../models/Video';
import VideoProgress from '../models/VideoProgress';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only video files are allowed!'));
  }
});

// Upload video (admin/instructor only)
router.post('/upload', authMiddleware, upload.single('video'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { title, description, learningPathId, lessonId, duration, tags } = req.body;

    // Create video URL
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    const thumbnail = `/uploads/videos/thumbnails/${req.file.filename}.jpg`; // Will be generated

    const video = new Video({
      title,
      description,
      learningPathId,
      lessonId,
      duration: parseInt(duration),
      thumbnail,
      videoUrl,
      qualities: [{
        quality: '720p',
        url: videoUrl,
        size: req.file.size
      }],
      uploadedBy: req.user.userId,
      tags: tags ? JSON.parse(tags) : [],
      isPublished: false
    });

    await video.save();

    res.status(201).json({
      message: 'Video uploaded successfully',
      video
    });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Failed to upload video', error: error.message });
  }
});

// Get videos by learning path
router.get('/learning-path/:pathId', async (req: Request, res: Response) => {
  try {
    const { pathId } = req.params;

    const videos = await Video.find({
      learningPathId: pathId,
      isPublished: true
    })
    .sort({ order: 1 })
    .populate('uploadedBy', 'name email')
    .lean();

    res.json({ videos });
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
});

// Get single video details
router.get('/:videoId', async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId)
      .populate('uploadedBy', 'name email')
      .lean();

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment view count
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    res.json({ video });
  } catch (error: any) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Failed to fetch video', error: error.message });
  }
});

// Stream video
router.get('/:videoId/stream', async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const videoPath = path.join(__dirname, '../..', video.videoUrl);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error: any) {
    console.error('Error streaming video:', error);
    res.status(500).json({ message: 'Failed to stream video', error: error.message });
  }
});

// Update video progress
router.post('/:videoId/progress', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const { watchedDuration, lastPosition } = req.body;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Calculate if video is completed (watched 90% or more)
    const completed = (watchedDuration / video.duration) >= 0.9;

    let progress = await VideoProgress.findOne({ userId, videoId });

    if (progress) {
      progress.watchedDuration = Math.max(progress.watchedDuration, watchedDuration);
      progress.lastPosition = lastPosition;
      progress.watchHistory.push({
        timestamp: new Date(),
        duration: watchedDuration
      });
      
      if (completed && !progress.completed) {
        progress.completed = true;
        progress.completedAt = new Date();
      }
      
      await progress.save();
    } else {
      progress = new VideoProgress({
        userId,
        videoId,
        watchedDuration,
        lastPosition,
        completed,
        completedAt: completed ? new Date() : undefined,
        watchHistory: [{
          timestamp: new Date(),
          duration: watchedDuration
        }]
      });
      await progress.save();
    }

    res.json({
      message: 'Progress updated successfully',
      progress
    });
  } catch (error: any) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
});

// Get user's video progress
router.get('/:videoId/progress', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.userId;

    const progress = await VideoProgress.findOne({ userId, videoId });

    if (!progress) {
      return res.json({
        progress: {
          watchedDuration: 0,
          lastPosition: 0,
          completed: false
        }
      });
    }

    res.json({ progress });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
  }
});

// Like/unlike video
router.post('/:videoId/like', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const likeIndex = video.likes.indexOf(userId as any);
    
    if (likeIndex > -1) {
      // Unlike
      video.likes.splice(likeIndex, 1);
    } else {
      // Like
      video.likes.push(userId as any);
    }

    await video.save();

    res.json({
      message: likeIndex > -1 ? 'Video unliked' : 'Video liked',
      likes: video.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error: any) {
    console.error('Error liking video:', error);
    res.status(500).json({ message: 'Failed to like video', error: error.message });
  }
});

// Get all videos for a user (with progress)
router.get('/user/all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    const progress = await VideoProgress.find({ userId })
      .populate({
        path: 'videoId',
        populate: {
          path: 'learningPathId',
          select: 'title icon'
        }
      })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ progress });
  } catch (error: any) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ message: 'Failed to fetch user videos', error: error.message });
  }
});

// Admin: Publish/unpublish video
router.patch('/:videoId/publish', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const { isPublished } = req.body;

    const video = await Video.findByIdAndUpdate(
      videoId,
      { isPublished },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({
      message: `Video ${isPublished ? 'published' : 'unpublished'} successfully`,
      video
    });
  } catch (error: any) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: 'Failed to update video', error: error.message });
  }
});

// Admin: Delete video
router.delete('/:videoId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete video file
    const videoPath = path.join(__dirname, '../..', video.videoUrl);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // Delete video progress records
    await VideoProgress.deleteMany({ videoId });

    // Delete video document
    await Video.findByIdAndDelete(videoId);

    res.json({ message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Failed to delete video', error: error.message });
  }
});

export default router;
