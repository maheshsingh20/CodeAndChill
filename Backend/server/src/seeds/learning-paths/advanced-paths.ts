import { Course } from '../../models/Course';

// Machine Learning Path
export const mlPathData = {
  title: 'Machine Learning Mastery',
  description: 'Comprehensive journey from ML fundamentals to advanced deep learning. Build real-world AI applications and master the mathematics behind machine learning algorithms.',
  icon: '🤖',
  difficulty: 'advanced' as const,
  estimatedDuration: 120,
  prerequisites: ['Python programming', 'Statistics and probability', 'Linear algebra', 'Calculus basics'],
  tags: ['machine-learning', 'ai', 'python', 'data-science', 'neural-networks', 'deep-learning'],
  isPublic: true,
  enrollmentCount: 987,
  completionRate: 52,
  averageRating: 4.7,
  totalRatings: 634
};

export const mlCourses = [
  {
    courseTitle: 'ML Fundamentals & Mathematics',
    slug: 'ml-fundamentals-math',
    modules: [
      {
        title: 'Introduction to Machine Learning',
        topics: [
          {
            title: 'What is Machine Learning?',
            subtopics: [
              {
                id: 'ml-intro',
                title: 'Understanding Machine Learning',
                videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
                content: `<h2>Machine Learning Overview</h2>
                <p>Machine Learning is a subset of Artificial Intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.</p>
                
                <h3>Types of Machine Learning:</h3>
                <ul>
                  <li><strong>Supervised Learning:</strong> Learning with labeled data (Classification, Regression)</li>
                  <li><strong>Unsupervised Learning:</strong> Finding patterns in unlabeled data (Clustering, Association)</li>
                  <li><strong>Reinforcement Learning:</strong> Learning through interaction and rewards</li>
                  <li><strong>Semi-supervised Learning:</strong> Combination of labeled and unlabeled data</li>
                </ul>
                
                <h3>Applications:</h3>
                <ul>
                  <li>Image and speech recognition</li>
                  <li>Natural language processing</li>
                  <li>Recommendation systems</li>
                  <li>Autonomous vehicles</li>
                  <li>Medical diagnosis</li>
                  <li>Financial fraud detection</li>
                </ul>`,
                duration: 30
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Supervised Learning Algorithms',
    slug: 'supervised-learning-algorithms',
    modules: [
      {
        title: 'Classification Algorithms',
        topics: [
          {
            title: 'Decision Trees and Random Forest',
            subtopics: [
              {
                id: 'decision-trees',
                title: 'Decision Trees',
                videoUrl: 'https://www.youtube.com/embed/_L39rN6gz7Y',
                content: `<h2>Decision Trees</h2>
                <p>Decision trees are intuitive ML algorithms that make decisions by splitting data based on feature values, creating a tree-like model of decisions.</p>
                
                <h3>How Decision Trees Work:</h3>
                <ol>
                  <li>Start with the entire dataset at the root</li>
                  <li>Find the best feature to split on (using metrics like Gini impurity or entropy)</li>
                  <li>Split the data based on that feature</li>
                  <li>Repeat recursively for each subset</li>
                  <li>Stop when a stopping criterion is met</li>
                </ol>`,
                duration: 25
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Deep Learning & Neural Networks',
    slug: 'deep-learning-neural-networks',
    modules: [
      {
        title: 'Neural Network Fundamentals',
        topics: [
          {
            title: 'Introduction to Neural Networks',
            subtopics: [
              {
                id: 'neural-networks-intro',
                title: 'Understanding Neural Networks',
                videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
                content: `<h2>Neural Networks</h2>
                <p>Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information.</p>
                
                <h3>Components:</h3>
                <ul>
                  <li><strong>Neurons:</strong> Basic processing units</li>
                  <li><strong>Weights:</strong> Connection strengths between neurons</li>
                  <li><strong>Biases:</strong> Threshold values for activation</li>
                  <li><strong>Activation Functions:</strong> Determine neuron output</li>
                </ul>`,
                duration: 35
              }
            ]
          }
        ]
      }
    ]
  }
];

export const mlMilestones = [
  {
    title: 'ML Foundations',
    description: 'Master the mathematical foundations and core concepts',
    order: 1
  },
  {
    title: 'Supervised Learning Expert',
    description: 'Implement and optimize classification and regression algorithms',
    order: 2
  },
  {
    title: 'Deep Learning Practitioner',
    description: 'Build and deploy neural networks for complex problems',
    order: 3
  },
  {
    title: 'AI Project Master',
    description: 'Complete end-to-end ML projects with real-world impact',
    order: 4
  }
];

// DevOps & Cloud Engineering Path
export const devopsPathData = {
  title: 'DevOps & Cloud Engineering',
  description: 'Master modern DevOps practices, cloud technologies, and infrastructure automation. Learn Docker, Kubernetes, CI/CD, AWS, and infrastructure as code.',
  icon: '☁️',
  difficulty: 'advanced' as const,
  estimatedDuration: 110,
  prerequisites: ['Linux basics', 'Networking fundamentals', 'Programming experience', 'Command line proficiency'],
  tags: ['devops', 'cloud', 'docker', 'kubernetes', 'aws', 'ci-cd', 'infrastructure'],
  isPublic: true,
  enrollmentCount: 543,
  completionRate: 48,
  averageRating: 4.5,
  totalRatings: 287
};

export const devopsCourses = [
  {
    courseTitle: 'Containerization with Docker',
    slug: 'containerization-docker',
    modules: [
      {
        title: 'Docker Fundamentals',
        topics: [
          {
            title: 'Introduction to Containers',
            subtopics: [
              {
                id: 'docker-intro',
                title: 'What are Containers?',
                videoUrl: 'https://www.youtube.com/embed/0qotVMX-J5s',
                content: `<h2>Container Technology</h2>
                <p>Containers are lightweight, portable, and consistent environments that package applications with their dependencies.</p>
                
                <h3>Benefits of Containers:</h3>
                <ul>
                  <li><strong>Portability:</strong> Run anywhere - dev, test, production</li>
                  <li><strong>Consistency:</strong> Same environment across all stages</li>
                  <li><strong>Efficiency:</strong> Share OS kernel, lightweight</li>
                  <li><strong>Scalability:</strong> Easy to scale up/down</li>
                  <li><strong>Isolation:</strong> Applications run independently</li>
                </ul>`,
                duration: 20
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Kubernetes Orchestration',
    slug: 'kubernetes-orchestration',
    modules: [
      {
        title: 'Kubernetes Basics',
        topics: [
          {
            title: 'Container Orchestration',
            subtopics: [
              {
                id: 'k8s-intro',
                title: 'Introduction to Kubernetes',
                videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do',
                content: `<h2>Kubernetes Overview</h2>
                <p>Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.</p>
                
                <h3>Key Components:</h3>
                <ul>
                  <li><strong>Master Node:</strong> Control plane components</li>
                  <li><strong>Worker Nodes:</strong> Run application containers</li>
                  <li><strong>Pods:</strong> Smallest deployable units</li>
                  <li><strong>Services:</strong> Network abstraction for pods</li>
                  <li><strong>Deployments:</strong> Manage pod replicas</li>
                </ul>`,
                duration: 30
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'CI/CD Pipelines & Infrastructure as Code',
    slug: 'cicd-infrastructure-code',
    modules: [
      {
        title: 'Continuous Integration/Deployment',
        topics: [
          {
            title: 'CI/CD Fundamentals',
            subtopics: [
              {
                id: 'cicd-intro',
                title: 'Understanding CI/CD',
                content: `<h2>CI/CD Pipeline</h2>
                <p>Continuous Integration and Continuous Deployment automate the software delivery process from code commit to production deployment.</p>
                
                <h3>Continuous Integration (CI):</h3>
                <ul>
                  <li>Automated code integration</li>
                  <li>Automated testing</li>
                  <li>Code quality checks</li>
                  <li>Build automation</li>
                </ul>
                
                <h3>Continuous Deployment (CD):</h3>
                <ul>
                  <li>Automated deployment to staging</li>
                  <li>Automated testing in staging</li>
                  <li>Automated production deployment</li>
                  <li>Rollback capabilities</li>
                </ul>`,
                duration: 25
              }
            ]
          }
        ]
      }
    ]
  }
];

export const devopsMilestones = [
  {
    title: 'Containerization Master',
    description: 'Master Docker and container technologies',
    order: 1
  },
  {
    title: 'Orchestration Expert',
    description: 'Deploy and manage applications with Kubernetes',
    order: 2
  },
  {
    title: 'CI/CD Architect',
    description: 'Build robust automated deployment pipelines',
    order: 3
  },
  {
    title: 'Cloud Infrastructure Engineer',
    description: 'Design and implement scalable cloud solutions',
    order: 4
  }
];

// Mobile Development Path
export const mobilePathData = {
  title: 'Mobile App Development',
  description: 'Create stunning mobile applications for iOS and Android. Master React Native, Flutter, and native development to build cross-platform mobile solutions.',
  icon: '📱',
  difficulty: 'intermediate' as const,
  estimatedDuration: 90,
  prerequisites: ['JavaScript/Dart knowledge', 'Basic programming concepts', 'Understanding of mobile UI/UX'],
  tags: ['mobile-development', 'react-native', 'flutter', 'ios', 'android', 'cross-platform'],
  isPublic: true,
  enrollmentCount: 756,
  completionRate: 71,
  averageRating: 4.4,
  totalRatings: 423
};

export const mobileCourses = [
  {
    courseTitle: 'React Native Fundamentals',
    slug: 'react-native-fundamentals',
    modules: [
      {
        title: 'Getting Started with React Native',
        topics: [
          {
            title: 'Mobile Development Basics',
            subtopics: [
              {
                id: 'mobile-dev-intro',
                title: 'Introduction to Mobile Development',
                videoUrl: 'https://www.youtube.com/embed/0-S5a0eXPoc',
                content: `<h2>Mobile Development Overview</h2>
                <p>Mobile development involves creating applications for mobile devices like smartphones and tablets.</p>
                
                <h3>Development Approaches:</h3>
                <ul>
                  <li><strong>Native Development:</strong> Platform-specific (Swift/Objective-C for iOS, Java/Kotlin for Android)</li>
                  <li><strong>Cross-Platform:</strong> Single codebase for multiple platforms (React Native, Flutter)</li>
                  <li><strong>Hybrid:</strong> Web technologies wrapped in native container (Cordova, Ionic)</li>
                </ul>
                
                <h3>React Native Benefits:</h3>
                <ul>
                  <li>Code reuse between iOS and Android</li>
                  <li>Faster development cycle</li>
                  <li>Hot reloading for quick iterations</li>
                  <li>Native performance</li>
                  <li>Large community and ecosystem</li>
                </ul>`,
                duration: 20
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Flutter Development',
    slug: 'flutter-development',
    modules: [
      {
        title: 'Flutter Basics',
        topics: [
          {
            title: 'Dart Programming & Flutter Widgets',
            subtopics: [
              {
                id: 'flutter-intro',
                title: 'Introduction to Flutter',
                videoUrl: 'https://www.youtube.com/embed/1xipg02Wu8s',
                content: `<h2>Flutter Framework</h2>
                <p>Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.</p>
                
                <h3>Key Features:</h3>
                <ul>
                  <li><strong>Single Codebase:</strong> Write once, run everywhere</li>
                  <li><strong>Hot Reload:</strong> See changes instantly</li>
                  <li><strong>Native Performance:</strong> Compiled to native code</li>
                  <li><strong>Rich Widgets:</strong> Extensive widget library</li>
                  <li><strong>Dart Language:</strong> Modern, object-oriented language</li>
                </ul>`,
                duration: 25
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Mobile UI/UX Design & Publishing',
    slug: 'mobile-ui-ux-publishing',
    modules: [
      {
        title: 'Mobile Design Principles',
        topics: [
          {
            title: 'Mobile UI/UX Best Practices',
            subtopics: [
              {
                id: 'mobile-design',
                title: 'Mobile Design Guidelines',
                content: `<h2>Mobile UI/UX Design</h2>
                <p>Creating intuitive and engaging mobile interfaces requires understanding platform-specific design guidelines and user behavior patterns.</p>
                
                <h3>Design Principles:</h3>
                <ul>
                  <li><strong>Touch-First:</strong> Design for finger navigation</li>
                  <li><strong>Thumb-Friendly:</strong> Place important elements within thumb reach</li>
                  <li><strong>Consistent:</strong> Follow platform conventions</li>
                  <li><strong>Simple:</strong> Minimize cognitive load</li>
                  <li><strong>Accessible:</strong> Support all users</li>
                </ul>`,
                duration: 20
              }
            ]
          }
        ]
      }
    ]
  }
];

export const mobileMilestones = [
  {
    title: 'Mobile Basics',
    description: 'Understand mobile development fundamentals and setup',
    order: 1
  },
  {
    title: 'Cross-Platform Expert',
    description: 'Master React Native or Flutter development',
    order: 2
  },
  {
    title: 'UI/UX Designer',
    description: 'Create beautiful and intuitive mobile interfaces',
    order: 3
  },
  {
    title: 'App Publisher',
    description: 'Successfully publish apps to app stores',
    order: 4
  }
];