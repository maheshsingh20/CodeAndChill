import LearningPath from '../../models/LearningPath';
import { Course } from '../../models/Course';
import { User } from '../../models/User';
import { dsaPathData, dsaCourses, dsaMilestones } from './dsa-path';
import { webDevPathData, webDevCourses, webDevMilestones } from './web-dev-path';
import { 
  mlPathData, mlCourses, mlMilestones,
  devopsPathData, devopsCourses, devopsMilestones,
  mobilePathData, mobileCourses, mobileMilestones
} from './advanced-paths';
import { cybersecurityPathData, cybersecurityCourses, cybersecurityMilestones } from './cybersecurity-path';

interface LearningPathSeed {
  pathData: any;
  courses: any[];
  milestones: any[];
}

const learningPathSeeds: LearningPathSeed[] = [
  {
    pathData: dsaPathData,
    courses: dsaCourses,
    milestones: dsaMilestones
  },
  {
    pathData: webDevPathData,
    courses: webDevCourses,
    milestones: webDevMilestones
  },
  {
    pathData: mlPathData,
    courses: mlCourses,
    milestones: mlMilestones
  },
  {
    pathData: devopsPathData,
    courses: devopsCourses,
    milestones: devopsMilestones
  },
  {
    pathData: mobilePathData,
    courses: mobileCourses,
    milestones: mobileMilestones
  },
  {
    pathData: cybersecurityPathData,
    courses: cybersecurityCourses,
    milestones: cybersecurityMilestones
  }
];

export const seedLearningPathsModular = async () => {
  try {
    console.log('🌱 Starting modular learning paths seeding...');

    // Check if learning paths already exist
    const existingPaths = await LearningPath.countDocuments();
    if (existingPaths > 0) {
      console.log('✅ Learning paths already seeded');
      return;
    }

    // Get or create admin user
    let adminUser = await User.findOne({ email: 'admin@codeandchill.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Learning Path Admin',
        email: 'admin@codeandchill.com',
        password: 'hashedpassword',
        role: 'admin'
      });
    }

    const createdPaths = [];

    for (const seed of learningPathSeeds) {
      console.log(`📚 Processing: ${seed.pathData.title}`);

      // Create courses for this learning path
      const createdCourses = [];
      for (const courseData of seed.courses) {
        try {
          // Check if course already exists
          let course = await Course.findOne({ slug: courseData.slug });
          
          if (!course) {
            course = await Course.create(courseData);
            console.log(`  ✓ Created course: ${courseData.courseTitle}`);
          } else {
            console.log(`  ↻ Course exists: ${courseData.courseTitle}`);
          }
          
          createdCourses.push(course);
        } catch (error) {
          console.error(`  ✗ Error creating course ${courseData.courseTitle}:`, error);
        }
      }

      // Build learning path with course references
      const pathCourses = createdCourses.map((course, index) => ({
        courseId: course._id,
        order: index + 1,
        isRequired: index < createdCourses.length - 1, // Last course is optional
        estimatedHours: 25 + (index * 5)
      }));

      // Build milestones with course references
      const pathMilestones = seed.milestones.map((milestone, index) => ({
        ...milestone,
        courseIds: createdCourses
          .slice(index, index + 1)
          .map(c => c._id)
      }));

      // Create learning path
      const learningPath = await LearningPath.create({
        ...seed.pathData,
        createdBy: adminUser._id,
        courses: pathCourses,
        milestones: pathMilestones
      });

      createdPaths.push(learningPath);
      console.log(`  ✅ Created learning path: ${learningPath.title}`);
    }

    console.log(`\n✅ Successfully seeded ${createdPaths.length} learning paths with real content!`);
    return createdPaths;

  } catch (error) {
    console.error('❌ Error seeding modular learning paths:', error);
    throw error;
  }
};
