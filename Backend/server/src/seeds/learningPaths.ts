import LearningPath from '../models/LearningPath';
import { Course } from '../models/Course';
import { User } from '../models/User';

export const seedLearningPaths = async () => {
  try {
    // Check if learning paths already exist
    const existingPaths = await LearningPath.countDocuments();
    if (existingPaths > 0) {
      console.log('✅ Learning paths already seeded');
      return;
    }

    // Get courses for learning paths (optional - paths can exist without courses)
    const courses = await Course.find().limit(10);
    console.log(`📚 Found ${courses.length} courses for learning paths`);

    // Get or create admin user as path creator
    let adminUser = await User.findOne({ email: 'admin@codeandchill.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Learning Path Admin',
        email: 'admin@codeandchill.com',
        password: 'hashedpassword',
        role: 'admin'
      });
    }

    const learningPaths = [
      {
        title: 'Full-Stack Web Development',
        description: 'Master the complete web development stack from frontend to backend, including React, Node.js, databases, and deployment. Build real-world applications and learn industry best practices.',
        icon: '🌐',
        difficulty: 'intermediate',
        estimatedDuration: 120, // 120 hours
        prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals', 'Git basics'],
        tags: ['web-development', 'react', 'nodejs', 'full-stack', 'javascript'],
        isPublic: true,
        createdBy: adminUser._id,
        courses: courses.length >= 4 ? [
          { courseId: courses[0]._id, order: 1, isRequired: true, estimatedHours: 30 },
          { courseId: courses[1]._id, order: 2, isRequired: true, estimatedHours: 40 },
          { courseId: courses[2]._id, order: 3, isRequired: true, estimatedHours: 35 },
          { courseId: courses[3]._id, order: 4, isRequired: false, estimatedHours: 15 }
        ] : [],
        milestones: [
          {
            title: 'Frontend Fundamentals',
            description: 'Master HTML, CSS, and JavaScript basics',
            courseIds: courses.length >= 2 ? [courses[0]._id, courses[1]._id] : [],
            order: 1
          },
          {
            title: 'React Mastery',
            description: 'Build dynamic user interfaces with React',
            courseIds: courses.length >= 3 ? [courses[2]._id] : [],
            order: 2
          },
          {
            title: 'Backend Development',
            description: 'Create robust server-side applications',
            courseIds: courses.length >= 4 ? [courses[3]._id] : [],
            order: 3
          }
        ],
        enrollmentCount: 1247,
        completionRate: 78,
        averageRating: 4.6,
        totalRatings: 892
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Comprehensive guide to DSA concepts, problem-solving techniques, and coding interview preparation. Master the fundamentals that every programmer needs.',
        icon: '🧠',
        difficulty: 'intermediate',
        estimatedDuration: 80,
        prerequisites: ['Basic programming knowledge', 'Mathematical thinking'],
        tags: ['algorithms', 'data-structures', 'problem-solving', 'interviews', 'coding'],
        isPublic: true,
        createdBy: adminUser._id,
        courses: courses.length >= 3 ? [
          { courseId: courses[0]._id, order: 1, isRequired: true, estimatedHours: 25 },
          { courseId: courses[1]._id, order: 2, isRequired: true, estimatedHours: 30 },
          { courseId: courses[2]._id, order: 3, isRequired: true, estimatedHours: 25 }
        ] : [],
        milestones: [
          {
            title: 'Basic Data Structures',
            description: 'Arrays, Linked Lists, Stacks, and Queues',
            courseIds: courses.length >= 1 ? [courses[0]._id] : [],
            order: 1
          },
          {
            title: 'Advanced Structures',
            description: 'Trees, Graphs, and Hash Tables',
            courseIds: courses.length >= 2 ? [courses[1]._id] : [],
            order: 2
          },
          {
            title: 'Algorithm Mastery',
            description: 'Sorting, Searching, and Dynamic Programming',
            courseIds: courses.length >= 3 ? [courses[2]._id] : [],
            order: 3
          }
        ],
        enrollmentCount: 2156,
        completionRate: 65,
        averageRating: 4.8,
        totalRatings: 1543
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Dive into the world of AI and machine learning. Learn core concepts, algorithms, and build real-world ML projects using Python and popular libraries.',
        icon: '🤖',
        difficulty: 'advanced',
        estimatedDuration: 100,
        prerequisites: ['Python programming', 'Statistics basics', 'Linear algebra'],
        tags: ['machine-learning', 'ai', 'python', 'data-science', 'neural-networks'],
        isPublic: true,
        createdBy: adminUser._id,
        courses: courses.length >= 4 ? [
          { courseId: courses[0]._id, order: 1, isRequired: true, estimatedHours: 20 },
          { courseId: courses[1]._id, order: 2, isRequired: true, estimatedHours: 30 },
          { courseId: courses[2]._id, order: 3, isRequired: true, estimatedHours: 35 },
          { courseId: courses[3]._id, order: 4, isRequired: false, estimatedHours: 15 }
        ] : [],
        milestones: [
          {
            title: 'ML Foundations',
            description: 'Understanding core ML concepts and mathematics',
            courseIds: courses.length >= 1 ? [courses[0]._id] : [],
            order: 1
          },
          {
            title: 'Supervised Learning',
            description: 'Classification and regression algorithms',
            courseIds: courses.length >= 2 ? [courses[1]._id] : [],
            order: 2
          },
          {
            title: 'Advanced Topics',
            description: 'Neural networks and deep learning basics',
            courseIds: courses.length >= 3 ? [courses[2]._id] : [],
            order: 3
          }
        ],
        enrollmentCount: 987,
        completionRate: 52,
        averageRating: 4.7,
        totalRatings: 634
      },
      {
        title: 'Mobile App Development',
        description: 'Create stunning mobile applications for iOS and Android. Learn React Native, Flutter, or native development to build cross-platform mobile solutions.',
        icon: '📱',
        difficulty: 'intermediate',
        estimatedDuration: 90,
        prerequisites: ['JavaScript/Dart knowledge', 'Basic programming concepts'],
        tags: ['mobile-development', 'react-native', 'flutter', 'ios', 'android'],
        isPublic: true,
        createdBy: adminUser._id,
        courses: courses.length >= 3 ? [
          { courseId: courses[0]._id, order: 1, isRequired: true, estimatedHours: 30 },
          { courseId: courses[1]._id, order: 2, isRequired: true, estimatedHours: 35 },
          { courseId: courses[2]._id, order: 3, isRequired: true, estimatedHours: 25 }
        ] : [],
        milestones: [
          {
            title: 'Mobile Basics',
            description: 'Understanding mobile development fundamentals',
            courseIds: courses.length >= 1 ? [courses[0]._id] : [],
            order: 1
          },
          {
            title: 'UI/UX Design',
            description: 'Creating beautiful and intuitive interfaces',
            courseIds: courses.length >= 2 ? [courses[1]._id] : [],
            order: 2
          },
          {
            title: 'App Deployment',
            description: 'Publishing apps to app stores',
            courseIds: courses.length >= 3 ? [courses[2]._id] : [],
            order: 3
          }
        ],
        enrollmentCount: 756,
        completionRate: 71,
        averageRating: 4.4,
        totalRatings: 423
      },
      {
        title: 'DevOps & Cloud Engineering',
        description: 'Master modern DevOps practices and cloud technologies. Learn Docker, Kubernetes, CI/CD, AWS, and infrastructure as code to build scalable systems.',
        icon: '☁️',
        difficulty: 'advanced',
        estimatedDuration: 110,
        prerequisites: ['Linux basics', 'Networking fundamentals', 'Programming experience'],
        tags: ['devops', 'cloud', 'docker', 'kubernetes', 'aws', 'ci-cd'],
        isPublic: true,
        createdBy: adminUser._id,
        courses: courses.length >= 4 ? [
          { courseId: courses[0]._id, order: 1, isRequired: true, estimatedHours: 25 },
          { courseId: courses[1]._id, order: 2, isRequired: true, estimatedHours: 30 },
          { courseId: courses[2]._id, order: 3, isRequired: true, estimatedHours: 35 },
          { courseId: courses[3]._id, order: 4, isRequired: false, estimatedHours: 20 }
        ] : [],
        milestones: [
          {
            title: 'Containerization',
            description: 'Docker and container orchestration',
            courseIds: courses.length >= 1 ? [courses[0]._id] : [],
            order: 1
          },
          {
            title: 'Cloud Platforms',
            description: 'AWS, Azure, and GCP fundamentals',
            courseIds: courses.length >= 2 ? [courses[1]._id] : [],
            order: 2
          },
          {
            title: 'Infrastructure Automation',
            description: 'Terraform, Ansible, and CI/CD pipelines',
            courseIds: courses.length >= 3 ? [courses[2]._id] : [],
            order: 3
          }
        ],
        enrollmentCount: 543,
        completionRate: 48,
        averageRating: 4.5,
        totalRatings: 287
      },
      {
        title: 'Cybersecurity Fundamentals',
        description: 'Learn essential cybersecurity concepts, ethical hacking, and security best practices. Protect systems and data from modern cyber threats.',
        icon: '🔒',
        difficulty: 'beginner',
        estimatedDuration: 60,
        prerequisites: ['Basic computer knowledge', 'Networking basics'],
        tags: ['cybersecurity', 'ethical-hacking', 'security', 'networking', 'privacy'],
        isPublic: true,
        createdBy: adminUser._id,
        courses: courses.length >= 3 ? [
          { courseId: courses[0]._id, order: 1, isRequired: true, estimatedHours: 20 },
          { courseId: courses[1]._id, order: 2, isRequired: true, estimatedHours: 25 },
          { courseId: courses[2]._id, order: 3, isRequired: true, estimatedHours: 15 }
        ] : [],
        milestones: [
          {
            title: 'Security Basics',
            description: 'Understanding common threats and vulnerabilities',
            courseIds: courses.length >= 1 ? [courses[0]._id] : [],
            order: 1
          },
          {
            title: 'Network Security',
            description: 'Securing networks and communications',
            courseIds: courses.length >= 2 ? [courses[1]._id] : [],
            order: 2
          },
          {
            title: 'Ethical Hacking',
            description: 'Penetration testing and security assessment',
            courseIds: courses.length >= 3 ? [courses[2]._id] : [],
            order: 3
          }
        ],
        enrollmentCount: 1834,
        completionRate: 82,
        averageRating: 4.3,
        totalRatings: 1156
      }
    ];

    // Create learning paths
    const createdPaths = await LearningPath.insertMany(learningPaths);
    console.log(`✅ Learning paths seeded successfully (${createdPaths.length} paths)`);

  } catch (error) {
    console.error('❌ Error seeding learning paths:', error);
    throw error;
  }
};