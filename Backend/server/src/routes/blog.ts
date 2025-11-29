import express from 'express';
import BlogPost from '../models/BlogPost';

const router = express.Router();

// Get latest blog posts
router.get('/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const posts = await BlogPost.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title slug excerpt category image createdAt views likes');
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error });
  }
});

// Get all blog posts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments({ published: true });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error });
  }
});

// Get single blog post
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true })
      .populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error });
  }
});

export default router;
