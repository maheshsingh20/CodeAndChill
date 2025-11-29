import express from 'express';
import CommunityPost from '../models/CommunityPost';

const router = express.Router();

// Get latest community posts
router.get('/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 4;
    const posts = await CommunityPost.find()
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title user likes comments createdAt');
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching community posts', error });
  }
});

// Get all community posts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find()
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CommunityPost.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching community posts', error });
  }
});

// Get single community post
router.get('/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('user', 'name email profilePicture');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
});

export default router;
