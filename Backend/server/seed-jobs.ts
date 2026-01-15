import mongoose from 'mongoose';
import Job from './src/models/Job';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeandchill';

const jobsData = [
  {
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'full-time',
    experience: 'senior',
    salary: { min: 120000, max: 180000, currency: 'USD' },
    description: 'We are looking for a Senior Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS, Azure, or GCP)',
      'Strong understanding of database design and optimization',
      'Experience with CI/CD pipelines and DevOps practices'
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Collaborate with cross-functional teams to define and implement features',
      'Optimize applications for maximum speed and scalability',
      'Mentor junior developers and conduct code reviews',
      'Stay up-to-date with emerging technologies and industry trends'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health, dental, and vision insurance',
      'Flexible work arrangements and remote work options',
      'Professional development budget',
      'Unlimited PTO policy'
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'Docker', 'Kubernetes'],
    department: 'Engineering',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    companyLogo: 'https://via.placeholder.com/100x100?text=TC',
    companyDescription: 'TechCorp Solutions is a leading technology company specializing in innovative software solutions for enterprise clients.'
  },
  {
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'full-time',
    experience: 'mid',
    salary: { min: 80000, max: 120000, currency: 'USD' },
    description: 'Join our fast-growing startup as a Frontend Developer. You will work on cutting-edge user interfaces and help shape the future of our product.',
    requirements: [
      '3+ years of experience in frontend development',
      'Expert knowledge of React and modern JavaScript',
      'Experience with state management libraries (Redux, Zustand)',
      'Proficiency in CSS frameworks and responsive design',
      'Understanding of web performance optimization'
    ],
    responsibilities: [
      'Develop responsive and interactive user interfaces',
      'Implement pixel-perfect designs from Figma mockups',
      'Optimize frontend performance and user experience',
      'Collaborate with designers and backend developers',
      'Write clean, maintainable, and testable code'
    ],
    benefits: [
      'Competitive salary with stock options',
      'Health and dental insurance',
      'Flexible working hours',
      'Learning and development opportunities',
      'Modern office with free snacks and drinks'
    ],
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Redux', 'Webpack'],
    department: 'Frontend',
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=SXY',
    companyDescription: 'StartupXYZ is revolutionizing the way people interact with technology through innovative user experiences.'
  },
  {
    title: 'Backend Engineer',
    company: 'DataFlow Inc',
    location: 'Austin, TX',
    type: 'full-time',
    experience: 'mid',
    salary: { min: 90000, max: 140000, currency: 'USD' },
    description: 'We are seeking a talented Backend Engineer to build and maintain our data processing infrastructure and APIs.',
    requirements: [
      '3+ years of backend development experience',
      'Strong proficiency in Python or Node.js',
      'Experience with microservices architecture',
      'Knowledge of database systems (SQL and NoSQL)',
      'Familiarity with message queues and event-driven systems'
    ],
    responsibilities: [
      'Design and implement scalable backend services',
      'Develop and maintain RESTful APIs',
      'Optimize database queries and system performance',
      'Implement security best practices',
      'Monitor and troubleshoot production systems'
    ],
    benefits: [
      'Competitive compensation package',
      'Comprehensive benefits package',
      'Remote work flexibility',
      'Professional growth opportunities',
      'Annual conference and training budget'
    ],
    skills: ['Python', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS'],
    department: 'Backend',
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=DF',
    companyDescription: 'DataFlow Inc specializes in big data solutions and analytics platforms for enterprise customers.'
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudTech Systems',
    location: 'Seattle, WA',
    type: 'full-time',
    experience: 'senior',
    salary: { min: 110000, max: 160000, currency: 'USD' },
    description: 'Join our DevOps team to build and maintain cloud infrastructure that powers our global applications.',
    requirements: [
      '4+ years of DevOps/Infrastructure experience',
      'Expertise in AWS, Azure, or Google Cloud Platform',
      'Strong knowledge of containerization (Docker, Kubernetes)',
      'Experience with Infrastructure as Code (Terraform, CloudFormation)',
      'Proficiency in scripting languages (Python, Bash, PowerShell)'
    ],
    responsibilities: [
      'Design and implement CI/CD pipelines',
      'Manage cloud infrastructure and deployments',
      'Monitor system performance and reliability',
      'Implement security and compliance measures',
      'Automate operational processes and workflows'
    ],
    benefits: [
      'Excellent salary and bonus structure',
      'Full health benefits package',
      'Flexible PTO and work-from-home options',
      'Certification reimbursement program',
      'Stock purchase plan'
    ],
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python', 'Monitoring'],
    department: 'DevOps',
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=CT',
    companyDescription: 'CloudTech Systems provides cloud infrastructure solutions for businesses of all sizes.'
  },
  {
    title: 'Mobile App Developer',
    company: 'MobileFirst Co',
    location: 'Los Angeles, CA',
    type: 'full-time',
    experience: 'mid',
    salary: { min: 85000, max: 125000, currency: 'USD' },
    description: 'We are looking for a skilled Mobile App Developer to create amazing mobile experiences for our users.',
    requirements: [
      '3+ years of mobile app development experience',
      'Proficiency in React Native or Flutter',
      'Experience with native iOS/Android development',
      'Knowledge of mobile app deployment processes',
      'Understanding of mobile UI/UX best practices'
    ],
    responsibilities: [
      'Develop cross-platform mobile applications',
      'Implement responsive and intuitive user interfaces',
      'Integrate with backend APIs and services',
      'Optimize app performance and user experience',
      'Collaborate with design and product teams'
    ],
    benefits: [
      'Competitive salary with performance bonuses',
      'Health, dental, and vision coverage',
      'Flexible work schedule',
      'Professional development support',
      'Team building events and company retreats'
    ],
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'JavaScript', 'Swift', 'Kotlin'],
    department: 'Mobile',
    applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=MF',
    companyDescription: 'MobileFirst Co creates innovative mobile applications that connect people and businesses.'
  },
  {
    title: 'Data Scientist',
    company: 'AI Innovations Lab',
    location: 'Boston, MA',
    type: 'full-time',
    experience: 'senior',
    salary: { min: 130000, max: 190000, currency: 'USD' },
    description: 'Join our AI team as a Data Scientist to work on cutting-edge machine learning projects and data analysis.',
    requirements: [
      '5+ years of data science experience',
      'Advanced degree in Computer Science, Statistics, or related field',
      'Expertise in Python, R, and SQL',
      'Experience with machine learning frameworks (TensorFlow, PyTorch)',
      'Strong statistical analysis and modeling skills'
    ],
    responsibilities: [
      'Develop and deploy machine learning models',
      'Analyze large datasets to extract insights',
      'Design and conduct experiments',
      'Collaborate with engineering teams on model implementation',
      'Present findings to stakeholders and leadership'
    ],
    benefits: [
      'Highly competitive salary and equity',
      'Premium health and wellness benefits',
      'Research and conference budget',
      'Flexible work arrangements',
      'Access to cutting-edge technology and resources'
    ],
    skills: ['Python', 'R', 'TensorFlow', 'PyTorch', 'SQL', 'Statistics', 'Machine Learning'],
    department: 'Data Science',
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=AI',
    companyDescription: 'AI Innovations Lab is at the forefront of artificial intelligence research and development.'
  },
  {
    title: 'Junior Software Developer',
    company: 'CodeCraft Academy',
    location: 'Remote',
    type: 'full-time',
    experience: 'entry',
    salary: { min: 55000, max: 75000, currency: 'USD' },
    description: 'Perfect opportunity for new graduates or career changers to start their software development journey.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Basic knowledge of programming languages (Java, Python, or JavaScript)',
      'Understanding of software development fundamentals',
      'Strong problem-solving and analytical skills',
      'Eagerness to learn and grow in a collaborative environment'
    ],
    responsibilities: [
      'Write clean, efficient, and well-documented code',
      'Participate in code reviews and team meetings',
      'Learn new technologies and development practices',
      'Assist in debugging and troubleshooting issues',
      'Contribute to team projects and initiatives'
    ],
    benefits: [
      'Competitive entry-level salary',
      'Comprehensive mentorship program',
      'Health and dental insurance',
      'Professional development opportunities',
      'Flexible remote work policy'
    ],
    skills: ['Java', 'Python', 'JavaScript', 'Git', 'HTML', 'CSS', 'SQL'],
    department: 'Engineering',
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=CC',
    companyDescription: 'CodeCraft Academy helps aspiring developers launch their careers in technology.'
  },
  {
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'Chicago, IL',
    type: 'full-time',
    experience: 'senior',
    salary: { min: 115000, max: 165000, currency: 'USD' },
    description: 'Lead product strategy and development for our flagship software products.',
    requirements: [
      '5+ years of product management experience',
      'Experience with agile development methodologies',
      'Strong analytical and data-driven decision making skills',
      'Excellent communication and leadership abilities',
      'Technical background with understanding of software development'
    ],
    responsibilities: [
      'Define product roadmap and strategy',
      'Collaborate with engineering, design, and marketing teams',
      'Conduct market research and competitive analysis',
      'Manage product lifecycle from conception to launch',
      'Analyze product metrics and user feedback'
    ],
    benefits: [
      'Competitive salary with performance incentives',
      'Comprehensive benefits package',
      'Stock options and equity participation',
      'Professional development budget',
      'Flexible work environment'
    ],
    skills: ['Product Management', 'Agile', 'Analytics', 'Strategy', 'Leadership', 'Communication'],
    department: 'Product',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=IT',
    companyDescription: 'InnovateTech develops innovative software solutions for modern businesses.'
  },
  {
    title: 'UX/UI Designer',
    company: 'DesignStudio Pro',
    location: 'Portland, OR',
    type: 'full-time',
    experience: 'mid',
    salary: { min: 75000, max: 110000, currency: 'USD' },
    description: 'Create beautiful and intuitive user experiences for our digital products.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
      'Strong portfolio demonstrating design process and outcomes',
      'Understanding of user-centered design principles',
      'Experience with prototyping and user testing'
    ],
    responsibilities: [
      'Design user interfaces for web and mobile applications',
      'Conduct user research and usability testing',
      'Create wireframes, prototypes, and design systems',
      'Collaborate with product and engineering teams',
      'Iterate on designs based on user feedback and data'
    ],
    benefits: [
      'Competitive salary and creative freedom',
      'Health and wellness benefits',
      'Design tool subscriptions and equipment budget',
      'Flexible work schedule',
      'Inspiring creative work environment'
    ],
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
    department: 'Design',
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=DS',
    companyDescription: 'DesignStudio Pro creates exceptional digital experiences for clients worldwide.'
  },
  {
    title: 'Software Engineering Intern',
    company: 'TechGiants Corp',
    location: 'Mountain View, CA',
    type: 'internship',
    experience: 'entry',
    salary: { min: 25, max: 35, currency: 'USD' }, // Per hour
    description: 'Summer internship program for computer science students to gain real-world experience.',
    requirements: [
      'Currently pursuing a degree in Computer Science or related field',
      'Basic programming knowledge in at least one language',
      'Strong academic performance (GPA 3.0+)',
      'Passion for technology and software development',
      'Available for 10-12 week summer internship'
    ],
    responsibilities: [
      'Work on real projects with mentorship from senior engineers',
      'Participate in code reviews and team meetings',
      'Learn industry best practices and development tools',
      'Contribute to open-source projects',
      'Present final project to team and leadership'
    ],
    benefits: [
      'Competitive hourly compensation',
      'Housing assistance for relocating interns',
      'Mentorship from industry professionals',
      'Networking opportunities and events',
      'Potential for full-time offer upon graduation'
    ],
    skills: ['Programming Fundamentals', 'Git', 'Problem Solving', 'Teamwork'],
    department: 'Engineering',
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/100x100?text=TG',
    companyDescription: 'TechGiants Corp is a Fortune 500 technology company with a global presence.'
  }
];

async function seedJobs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Create a default ObjectId for the poster
    const defaultUserId = new mongoose.Types.ObjectId();
    console.log('Using default user ID for job posting');

    // Add postedBy field to all jobs
    const jobsWithPoster = jobsData.map(job => ({
      ...job,
      postedBy: defaultUserId
    }));

    // Insert jobs
    const createdJobs = await Job.insertMany(jobsWithPoster);
    console.log(`Successfully seeded ${createdJobs.length} jobs`);

    // Display summary
    console.log('\n=== Job Seeding Summary ===');
    console.log(`Total jobs created: ${createdJobs.length}`);
    
    const jobsByType = createdJobs.reduce((acc, job) => {
      acc[job.type] = (acc[job.type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Jobs by type:', jobsByType);
    
    const jobsByExperience = createdJobs.reduce((acc, job) => {
      acc[job.experience] = (acc[job.experience] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Jobs by experience:', jobsByExperience);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedJobs();