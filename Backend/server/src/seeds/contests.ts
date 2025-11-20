import Contest from '../models/Contest';
import { Problem } from '../models';
import { User } from '../models/User';

export const seedContests = async () => {
  try {
    // Check if contests already exist
    const existingContests = await Contest.countDocuments();
    if (existingContests > 0) {
      console.log('Contests already seeded');
      return;
    }

    // Get some problems for contests
    const problems = await Problem.find().limit(10);
    if (problems.length === 0) {
      console.log('No problems found for contests');
      return;
    }

    // Get or create admin user as contest creator
    let adminUser = await User.findOne({ email: 'admin@codeandchill.com' });
    if (!adminUser) {
      // Create a default admin user for contests
      adminUser = await User.create({
        name: 'Contest Admin',
        email: 'admin@codeandchill.com',
        password: 'hashedpassword', // In real app, this would be properly hashed
        role: 'admin'
      });
      console.log('Created admin user for contests');
    }

    const now = new Date();
    
    const contests = [
      {
        title: 'Weekly Coding Challenge #1',
        description: 'Test your algorithmic skills in this exciting weekly challenge! Solve problems ranging from easy to hard difficulty.',
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
        duration: 120, // 2 hours
        status: 'upcoming' as const,
        problems: problems.length >= 3 ? [
          { problemId: problems[0]._id, points: 500, order: 1 },
          { problemId: problems[1]._id, points: 1000, order: 2 },
          { problemId: problems[2]._id, points: 1500, order: 3 }
        ] : [],
        participants: [],
        rules: 'Standard ACM-ICPC rules apply. No external help allowed. Multiple submissions allowed with penalty.',
        prizes: [
          { position: 1, description: '1000 XP + Gold Badge', points: 1000 },
          { position: 2, description: '500 XP + Silver Badge', points: 500 },
          { position: 3, description: '250 XP + Bronze Badge', points: 250 }
        ],
        maxParticipants: 100,
        isPublic: true,
        createdBy: adminUser._id,
        tags: ['algorithms', 'data-structures', 'weekly']
      },
      {
        title: 'Speed Coding Sprint',
        description: 'Fast-paced coding contest! Solve as many problems as you can in 90 minutes.',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day from now
        endTime: new Date(now.getTime() + 25.5 * 60 * 60 * 1000), // 1 day + 1.5 hours
        duration: 90,
        status: 'upcoming' as const,
        problems: problems.length >= 4 ? [
          { problemId: problems[0]._id, points: 300, order: 1 },
          { problemId: problems[1]._id, points: 600, order: 2 },
          { problemId: problems[2]._id, points: 900, order: 3 },
          { problemId: problems[3]._id, points: 1200, order: 4 }
        ] : [],
        participants: [],
        rules: 'Speed matters! Solve problems quickly to maximize your score. Penalty for wrong submissions.',
        prizes: [
          { position: 1, description: '1500 XP + Speed Demon Badge', points: 1500 },
          { position: 2, description: '750 XP + Quick Solver Badge', points: 750 },
          { position: 3, description: '400 XP + Fast Coder Badge', points: 400 }
        ],
        maxParticipants: 200,
        isPublic: true,
        createdBy: adminUser._id,
        tags: ['speed', 'quick-thinking', 'sprint']
      },
      {
        title: 'Algorithm Mastery Contest',
        description: 'Advanced algorithmic challenges for experienced programmers. Test your skills with complex problems.',
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 days + 3 hours
        duration: 180, // 3 hours
        status: 'upcoming' as const,
        problems: problems.length >= 3 ? [
          { problemId: problems[0]._id, points: 800, order: 1 },
          { problemId: problems[1]._id, points: 1200, order: 2 },
          { problemId: problems[2]._id, points: 2000, order: 3 }
        ] : [],
        participants: [],
        rules: 'Advanced contest rules. Focus on algorithmic complexity and optimization.',
        prizes: [
          { position: 1, description: '2000 XP + Algorithm Master Badge', points: 2000 },
          { position: 2, description: '1200 XP + Advanced Coder Badge', points: 1200 },
          { position: 3, description: '800 XP + Problem Solver Badge', points: 800 }
        ],
        maxParticipants: 50,
        isPublic: true,
        createdBy: adminUser._id,
        tags: ['advanced', 'algorithms', 'mastery']
      },
      {
        title: 'Beginner Friendly Contest',
        description: 'Perfect for newcomers! Learn competitive programming basics with easy to medium problems.',
        startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 1 week + 2 hours
        duration: 120,
        status: 'upcoming' as const,
        problems: problems.length >= 3 ? [
          { problemId: problems[0]._id, points: 400, order: 1 },
          { problemId: problems[1]._id, points: 600, order: 2 },
          { problemId: problems[2]._id, points: 800, order: 3 }
        ] : [],
        participants: [],
        rules: 'Beginner-friendly rules. Focus on learning and improvement rather than competition.',
        prizes: [
          { position: 1, description: '800 XP + Rising Star Badge', points: 800 },
          { position: 2, description: '500 XP + Newcomer Badge', points: 500 },
          { position: 3, description: '300 XP + First Steps Badge', points: 300 }
        ],
        maxParticipants: 300,
        isPublic: true,
        createdBy: adminUser._id,
        tags: ['beginner', 'learning', 'friendly']
      },
      {
        title: 'Live Coding Championship',
        description: 'The ultimate coding challenge! Compete with the best programmers in real-time.',
        startTime: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago (active contest)
        endTime: new Date(now.getTime() + 90 * 60 * 1000), // 90 minutes from now
        duration: 120,
        status: 'active' as const,
        problems: problems.length >= 4 ? [
          { problemId: problems[0]._id, points: 1000, order: 1 },
          { problemId: problems[1]._id, points: 1500, order: 2 },
          { problemId: problems[2]._id, points: 2000, order: 3 },
          { problemId: problems[3]._id, points: 2500, order: 4 }
        ] : [],
        participants: [],
        rules: 'Championship rules apply. Real-time leaderboard updates. No second chances!',
        prizes: [
          { position: 1, description: '3000 XP + Champion Badge + Trophy', points: 3000 },
          { position: 2, description: '2000 XP + Runner-up Badge', points: 2000 },
          { position: 3, description: '1000 XP + Third Place Badge', points: 1000 }
        ],
        maxParticipants: 500,
        isPublic: true,
        createdBy: adminUser._id,
        tags: ['championship', 'live', 'competitive']
      }
    ];

    await Contest.insertMany(contests);
    console.log('✅ Contests seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding contests:', error);
  }
};