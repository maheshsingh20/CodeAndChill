import BlogPost from '../models/BlogPost';
import CommunityPost from '../models/CommunityPost';
import { User } from '../models';

export const seedBlogAndCommunity = async () => {
  try {
    // Create a default author if none exists
    let author = await User.findOne({ email: 'admin@codeandchill.com' });
    if (!author) {
      author = await User.create({
        name: 'Code & Chill Team',
        email: 'admin@codeandchill.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    // Clear existing data
    await BlogPost.deleteMany({});
    await CommunityPost.deleteMany({});

    // Seed blog posts
    const blogPosts = [
      {
        title: 'Understanding Asynchronous JavaScript',
        slug: 'understanding-asynchronous-javascript',
        content: 'Asynchronous programming is a fundamental concept in JavaScript that allows code to run without blocking the main thread. In this comprehensive guide, we\'ll explore callbacks, promises, and async/await patterns...',
        excerpt: 'Master async JavaScript with callbacks, promises, and async/await patterns.',
        author: author._id,
        category: 'JavaScript',
        tags: ['javascript', 'async', 'promises', 'programming'],
        image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop',
        published: true,
        views: 1250,
        likes: 89
      },
      {
        title: 'A Complete Guide to System Design Interviews',
        slug: 'system-design-interviews-guide',
        content: 'System design interviews are crucial for senior engineering positions. This guide covers everything from scalability to database design, caching strategies, and more...',
        excerpt: 'Everything you need to ace system design interviews at top tech companies.',
        author: author._id,
        category: 'Careers',
        tags: ['system-design', 'interviews', 'career', 'engineering'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
        published: true,
        views: 2340,
        likes: 156
      },
      {
        title: 'React Hooks: A Deep Dive',
        slug: 'react-hooks-deep-dive',
        content: 'React Hooks revolutionized how we write React components. Learn about useState, useEffect, useContext, and custom hooks with practical examples...',
        excerpt: 'Master React Hooks with practical examples and best practices.',
        author: author._id,
        category: 'React',
        tags: ['react', 'hooks', 'frontend', 'javascript'],
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
        published: true,
        views: 1890,
        likes: 134
      },
      {
        title: 'Data Structures Every Developer Should Know',
        slug: 'essential-data-structures',
        content: 'Understanding data structures is fundamental to becoming a better programmer. We\'ll cover arrays, linked lists, trees, graphs, and more...',
        excerpt: 'Essential data structures explained with real-world examples.',
        author: author._id,
        category: 'Data Structures',
        tags: ['dsa', 'data-structures', 'algorithms', 'programming'],
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2070&auto=format&fit=crop',
        published: true,
        views: 3120,
        likes: 245
      },
      {
        title: 'Building RESTful APIs with Node.js and Express',
        slug: 'restful-apis-nodejs-express',
        content: 'Learn how to build scalable RESTful APIs using Node.js and Express. We\'ll cover routing, middleware, authentication, and best practices...',
        excerpt: 'Complete guide to building production-ready REST APIs.',
        author: author._id,
        category: 'Backend',
        tags: ['nodejs', 'express', 'api', 'backend'],
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070&auto=format&fit=crop',
        published: true,
        views: 1670,
        likes: 98
      },
      {
        title: 'Introduction to Docker for Developers',
        slug: 'docker-for-developers',
        content: 'Docker has become essential for modern development. Learn containerization, Docker Compose, and deployment strategies...',
        excerpt: 'Get started with Docker and containerize your applications.',
        author: author._id,
        category: 'DevOps',
        tags: ['docker', 'devops', 'containers', 'deployment'],
        image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=2070&auto=format&fit=crop',
        published: true,
        views: 2450,
        likes: 187
      }
    ];

    await BlogPost.insertMany(blogPosts);
    console.log('✅ Blog posts seeded');

    // Get some users for community posts
    const users = await User.find().limit(10);
    const userIds = users.length > 0 ? users.map(u => u._id) : [author._id];

    // Seed community posts
    const communityPosts = [
      {
        user: userIds[0],
        title: 'Can anyone explain this React hook behavior?',
        content: 'I\'m seeing some unexpected behavior with useEffect. When I update state inside useEffect, it causes an infinite loop. How can I fix this?',
        category: 'React',
        tags: ['react', 'hooks', 'help'],
        likes: 12,
        comments: 5,
        views: 234
      },
      {
        user: userIds[Math.min(1, userIds.length - 1)],
        title: 'My solution for the "Two Sum" problem in Python',
        content: 'Here\'s an optimized O(n) solution using a hash map. Would love to hear your thoughts!',
        category: 'Algorithms',
        tags: ['python', 'algorithms', 'leetcode'],
        likes: 28,
        comments: 11,
        views: 456
      },
      {
        user: userIds[Math.min(2, userIds.length - 1)],
        title: 'Tips for passing technical interviews?',
        content: 'I have interviews coming up at FAANG companies. What are your best tips for preparation?',
        category: 'Career',
        tags: ['interviews', 'career', 'advice'],
        likes: 19,
        comments: 7,
        views: 389
      },
      {
        user: userIds[Math.min(3, userIds.length - 1)],
        title: 'Best resources for learning TypeScript?',
        content: 'I\'m coming from JavaScript and want to learn TypeScript. What are the best resources you\'ve used?',
        category: 'TypeScript',
        tags: ['typescript', 'learning', 'resources'],
        likes: 15,
        comments: 4,
        views: 267
      },
      {
        user: userIds[Math.min(4, userIds.length - 1)],
        title: 'How to optimize MongoDB queries?',
        content: 'My queries are getting slow as data grows. What indexing strategies do you recommend?',
        category: 'Database',
        tags: ['mongodb', 'database', 'optimization'],
        likes: 22,
        comments: 8,
        views: 312
      },
      {
        user: userIds[Math.min(5, userIds.length - 1)],
        title: 'Docker vs Kubernetes: When to use what?',
        content: 'I\'m confused about when to use Docker alone vs when to bring in Kubernetes. Can someone clarify?',
        category: 'DevOps',
        tags: ['docker', 'kubernetes', 'devops'],
        likes: 31,
        comments: 13,
        views: 521
      },
      {
        user: userIds[Math.min(6, userIds.length - 1)],
        title: 'Just got my first dev job! 🎉',
        content: 'After 6 months of learning on Code & Chill, I finally landed my first developer role! Thank you to this amazing community!',
        category: 'Success',
        tags: ['success', 'career', 'motivation'],
        likes: 87,
        comments: 24,
        views: 892
      },
      {
        user: userIds[Math.min(7, userIds.length - 1)],
        title: 'Understanding Big O notation',
        content: 'Can someone explain Big O notation in simple terms? I keep getting confused with time complexity analysis.',
        category: 'Algorithms',
        tags: ['algorithms', 'big-o', 'help'],
        likes: 18,
        comments: 9,
        views: 345
      }
    ];

    await CommunityPost.insertMany(communityPosts);
    console.log('✅ Community posts seeded');

  } catch (error) {
    console.error('❌ Error seeding blog and community:', error);
    throw error;
  }
};
