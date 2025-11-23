import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course, GeneralCourse, Subject, Quiz, Problem, ProblemSet } from "../models";
import LearningPath from "../models/LearningPath";
import { seedSkillTests } from './skillTests';
import { seedContests } from './contests';
import { seedLearningPaths } from './learningPaths';
import { seedLearningPathsModular } from './learning-paths';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// Course data
const coursesToSeed = [
  {
    courseTitle: "Operating Systems",
    slug: "operating-systems",
    modules: [
      {
        title: "Module 1: Introduction to OS",
        topics: [
          {
            title: "What is an Operating System?",
            subtopics: [
              { 
                id: "os-intro-definition", 
                title: "Definition and Goals", 
                content: "An Operating System is a System software that manages all the resources of the computing device, including hardware and software resources. It acts as an intermediary between users and the computer hardware. The main goals of an OS are: 1) Resource Management 2) Process Management 3) Memory Management 4) File System Management 5) Security and Protection." 
              },
              { 
                id: "os-intro-types", 
                title: "Types of OS", 
                content: "There are several types of operating systems: 1) Batch Operating System - Jobs are processed in batches without user interaction. 2) Time-Sharing OS - Multiple users can use the system simultaneously. 3) Distributed OS - Manages a group of independent computers. 4) Real-time OS - Provides immediate response to inputs. 5) Network OS - Manages network resources." 
              },
              { 
                id: "os-intro-functions", 
                title: "Functions of OS", 
                content: "Key functions include: Process Management (creating, scheduling, terminating processes), Memory Management (allocation and deallocation), File Management (organizing and accessing files), Device Management (controlling I/O devices), Security (protecting system resources), and User Interface (providing interaction methods)." 
              },
            ]
          },
          {
            title: "Process Management",
            subtopics: [
              { 
                id: "os-process-concept", 
                title: "Process Concept", 
                content: "A process is a program in execution. It includes the program code, current activity (program counter), stack, data section, and heap. Process states include: New, Ready, Running, Waiting, and Terminated." 
              },
              { 
                id: "os-process-scheduling", 
                title: "Process Scheduling", 
                content: "CPU scheduling algorithms determine which process runs next. Common algorithms include: FCFS (First Come First Served), SJF (Shortest Job First), Priority Scheduling, Round Robin, and Multilevel Queue Scheduling." 
              },
            ]
          }
        ]
      },
      {
        title: "Module 2: Memory Management",
        topics: [
          {
            title: "Memory Allocation",
            subtopics: [
              { 
                id: "os-memory-allocation", 
                title: "Memory Allocation Strategies", 
                content: "Memory allocation strategies include: Contiguous allocation (single partition, multiple partition), Non-contiguous allocation (paging, segmentation), and Virtual memory management." 
              },
              { 
                id: "os-virtual-memory", 
                title: "Virtual Memory", 
                content: "Virtual memory allows execution of processes that are not completely in memory. It uses demand paging, page replacement algorithms (FIFO, LRU, Optimal), and provides benefits like increased multiprogramming and efficient memory utilization." 
              },
            ]
          }
        ]
      }
    ],
  },
  {
    courseTitle: "Database Management Systems",
    slug: "dbms",
    modules: [
      {
        title: "Module 1: Introduction to Databases",
        topics: [
          {
            title: "What is a DBMS?",
            subtopics: [
              { 
                id: "dbms-intro-definition", 
                title: "Definition", 
                content: "A Database Management System (DBMS) is software for creating and managing databases. It provides an interface between the database and users/applications. Examples include MySQL, PostgreSQL, Oracle, SQL Server, and MongoDB." 
              },
              { 
                id: "dbms-advantages", 
                title: "Advantages of DBMS", 
                content: "Key advantages include: Data Independence, Efficient Data Access, Data Integrity and Security, Data Administration, Concurrent Access and Crash Recovery, Reduced Application Development Time." 
              },
            ]
          },
          {
            title: "Database Models",
            subtopics: [
              { 
                id: "dbms-relational-model", 
                title: "Relational Model", 
                content: "The relational model organizes data into tables (relations) with rows (tuples) and columns (attributes). It uses primary keys, foreign keys, and follows normalization rules to eliminate redundancy." 
              },
              { 
                id: "dbms-er-model", 
                title: "Entity-Relationship Model", 
                content: "ER model represents data as entities, attributes, and relationships. Entities are objects, attributes are properties, and relationships show how entities are connected. Used for database design." 
              },
            ]
          }
        ]
      },
      {
        title: "Module 2: SQL and Queries",
        topics: [
          {
            title: "SQL Fundamentals",
            subtopics: [
              { 
                id: "dbms-sql-basics", 
                title: "SQL Basics", 
                content: "SQL (Structured Query Language) is used to communicate with databases. Main categories: DDL (Data Definition Language), DML (Data Manipulation Language), DCL (Data Control Language), and TCL (Transaction Control Language)." 
              },
              { 
                id: "dbms-sql-queries", 
                title: "SQL Queries", 
                content: "Common SQL operations include: SELECT (retrieve data), INSERT (add data), UPDATE (modify data), DELETE (remove data), JOIN (combine tables), GROUP BY (group results), ORDER BY (sort results)." 
              },
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: "Computer Networks",
    slug: "computer-networks",
    modules: [
      {
        title: "Module 1: Network Fundamentals",
        topics: [
          {
            title: "Introduction to Networks",
            subtopics: [
              { 
                id: "cn-intro-definition", 
                title: "What is a Computer Network?", 
                content: "A computer network is a collection of interconnected devices that can communicate and share resources. Networks enable data sharing, resource sharing, communication, and distributed processing." 
              },
              { 
                id: "cn-network-types", 
                title: "Types of Networks", 
                content: "Networks are classified by size and scope: LAN (Local Area Network), WAN (Wide Area Network), MAN (Metropolitan Area Network), PAN (Personal Area Network), and by topology: Bus, Star, Ring, Mesh, Tree." 
              },
            ]
          },
          {
            title: "OSI Model",
            subtopics: [
              { 
                id: "cn-osi-layers", 
                title: "OSI Seven Layers", 
                content: "The OSI model has 7 layers: 1) Physical (bits transmission), 2) Data Link (frame transmission), 3) Network (routing), 4) Transport (end-to-end delivery), 5) Session (dialog management), 6) Presentation (data formatting), 7) Application (user interface)." 
              },
              { 
                id: "cn-tcp-ip", 
                title: "TCP/IP Model", 
                content: "TCP/IP model has 4 layers: 1) Network Access Layer, 2) Internet Layer (IP), 3) Transport Layer (TCP/UDP), 4) Application Layer (HTTP, FTP, SMTP). It's the foundation of the internet." 
              },
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: "Data Structures & Algorithms",
    slug: "dsa",
    modules: [
      {
        title: "Module 1: Arrays & Strings",
        topics: [
          {
            title: "Introduction to Arrays",
            subtopics: [
              { 
                id: "dsa-arrays-intro", 
                title: "What is an Array?", 
                content: "An array is a data structure consisting of a collection of elements, each identified by an array index. Arrays store elements in contiguous memory locations, providing O(1) access time." 
              },
              { 
                id: "dsa-arrays-operations", 
                title: "Array Operations", 
                content: "Common array operations include: Access (O(1)), Search (O(n)), Insertion (O(n)), Deletion (O(n)), Traversal (O(n)). Arrays are ideal for scenarios requiring frequent access by index." 
              },
            ]
          },
          {
            title: "String Algorithms",
            subtopics: [
              { 
                id: "dsa-string-matching", 
                title: "String Matching", 
                content: "String matching algorithms find occurrences of a pattern in text. Common algorithms include: Naive approach (O(nm)), KMP algorithm (O(n+m)), Rabin-Karp (O(n+m) average case)." 
              },
            ]
          }
        ]
      },
      {
        title: "Module 2: Linked Lists",
        topics: [
          {
            title: "Linked List Fundamentals",
            subtopics: [
              { 
                id: "dsa-linkedlist-intro", 
                title: "Introduction to Linked Lists", 
                content: "A linked list is a linear data structure where elements are stored in nodes, and each node contains data and a reference to the next node. Types include: Singly, Doubly, and Circular linked lists." 
              },
              { 
                id: "dsa-linkedlist-operations", 
                title: "Linked List Operations", 
                content: "Operations include: Insertion (O(1) at head, O(n) at position), Deletion (O(1) if node reference available), Search (O(n)), Traversal (O(n)). Advantages: Dynamic size, efficient insertion/deletion." 
              },
            ]
          }
        ]
      }
    ]
  }
];

// General courses data
const generalCoursesToSeed = [
  {
    title: "Full-Stack Web Development",
    slug: "full-stack-web-dev",
    description: "Master the MERN stack and build real-world applications from scratch.",
    tutor: {
      name: "Jane Doe",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    cost: 49.99,
    modules: [
      {
        title: "Module 1: Frontend with React",
        lessons: [
          {
            title: "Introduction to React",
            topics: [
              {
                title: "What is React?",
                contentType: "text",
                textContent: "React is a JavaScript library for building user interfaces. It allows developers to create large web applications that can update and render efficiently in response to data changes.",
              },
              {
                title: "Setting up Your Environment",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
              },
            ],
          },
          {
            title: "Components & Props",
            topics: [
              {
                title: "Functional Components",
                contentType: "text",
                textContent: "Functional components are simple JavaScript functions that return React elements. They are the backbone of React UI and are easier to test and debug.",
              },
              {
                title: "Props in React",
                contentType: "text",
                textContent: "Props are arguments passed into React components. Props allow data to be passed from parent to child components, making components reusable.",
              },
            ],
          },
        ],
      },
      {
        title: "Module 2: Backend with Node.js",
        lessons: [
          {
            title: "Node.js Fundamentals",
            topics: [
              {
                title: "Introduction to Node.js",
                contentType: "text",
                textContent: "Node.js is a runtime environment that lets you run JavaScript on the server side. It's built on Chrome's V8 JavaScript engine.",
              },
              {
                title: "Express.js Setup",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/L72fhGm1tfE",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Data Structures & Algorithms Mastery",
    slug: "dsa-mastery",
    description: "Complete guide to DSA with coding practice and interview preparation.",
    tutor: {
      name: "John Smith",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    cost: 0,
    modules: [
      {
        title: "Module 1: Arrays & Strings",
        lessons: [
          {
            title: "Array Fundamentals",
            topics: [
              {
                title: "Array Basics",
                contentType: "text",
                textContent: "Arrays are fundamental data structures that store elements in contiguous memory locations. They provide O(1) access time.",
              },
              {
                title: "Time Complexity Analysis",
                contentType: "table",
                tableData: [
                  ["Operation", "Time Complexity", "Space Complexity"],
                  ["Access", "O(1)", "O(1)"],
                  ["Search", "O(n)", "O(1)"],
                  ["Insertion", "O(n)", "O(1)"],
                  ["Deletion", "O(n)", "O(1)"],
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Machine Learning Fundamentals",
    slug: "ml-fundamentals",
    description: "Learn ML concepts, algorithms, and build real-world projects.",
    tutor: {
      name: "Dr. Sarah Wilson",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    cost: 79.99,
    modules: [
      {
        title: "Module 1: Introduction to ML",
        lessons: [
          {
            title: "What is Machine Learning?",
            topics: [
              {
                title: "ML Overview",
                contentType: "text",
                textContent: "Machine Learning is a subset of AI that enables systems to learn and improve from data without explicit programming.",
              },
              {
                title: "Types of ML",
                contentType: "table",
                tableData: [
                  ["Type", "Description", "Examples"],
                  ["Supervised", "Learning with labeled data", "Classification, Regression"],
                  ["Unsupervised", "Finding patterns in unlabeled data", "Clustering, Association"],
                  ["Reinforcement", "Learning through rewards/penalties", "Game AI, Robotics"],
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Python Programming Complete",
    slug: "python-complete",
    description: "From basics to advanced Python programming with projects.",
    tutor: {
      name: "Mike Johnson",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    cost: 29.99,
    modules: [
      {
        title: "Module 1: Python Basics",
        lessons: [
          {
            title: "Getting Started with Python",
            topics: [
              {
                title: "Python Introduction",
                contentType: "text",
                textContent: "Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in web development, data science, AI, and automation.",
              },
              {
                title: "Python Setup",
                contentType: "video",
                videoUrl: "https://www.youtube.com/embed/YYXdXT2l-Gg",
              },
            ],
          },
        ],
      },
    ],
  },
];

// Quiz subjects and quizzes
const subjectsToSeed = [
  {
    name: "JavaScript",
    slug: "javascript",
    description: "Test your knowledge of core JS concepts.",
  },
  {
    name: "Python",
    slug: "python",
    description: "Challenge yourself with questions on Python syntax.",
  },
  {
    name: "Operating Systems",
    slug: "operating-systems",
    description: "Test your understanding of OS concepts.",
  },
  {
    name: "Database Management",
    slug: "database-management",
    description: "Evaluate your DBMS and SQL knowledge.",
  },
  {
    name: "Data Structures",
    slug: "data-structures",
    description: "Challenge yourself with DSA questions.",
  },
  {
    name: "Computer Networks",
    slug: "computer-networks",
    description: "Test your networking fundamentals.",
  },
];

const quizzesToSeed = [
  {
    subjectSlug: "javascript",
    title: "JS Variables & Scope",
    slug: "js-variables-scope",
    questions: [
      {
        questionText: "Which keyword creates a block-scoped variable?",
        options: [
          { text: "var" },
          { text: "let", isCorrect: true },
          { text: "const" },
          { text: "function" },
        ],
        explanation: "`let` creates block-scoped variables, unlike `var` which is function-scoped.",
      },
      {
        questionText: "What is the output of `typeof null`?",
        options: [
          { text: "null" },
          { text: "undefined" },
          { text: "object", isCorrect: true },
          { text: "boolean" },
        ],
        explanation: "Due to a long-standing bug in JavaScript, `typeof null` returns 'object'.",
      },
      {
        questionText: "Which method adds an element to the end of an array?",
        options: [
          { text: "unshift()" },
          { text: "push()", isCorrect: true },
          { text: "pop()" },
          { text: "shift()" },
        ],
        explanation: "`push()` adds elements to the end of an array and returns the new length.",
      },
    ],
  },
  {
    subjectSlug: "javascript",
    title: "JS Functions & Closures",
    slug: "js-functions-closures",
    questions: [
      {
        questionText: "What is a closure in JavaScript?",
        options: [
          { text: "A function that returns another function" },
          { text: "A function that has access to outer scope variables", isCorrect: true },
          { text: "A function with no parameters" },
          { text: "A function that calls itself" },
        ],
        explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
      },
    ],
  },
  {
    subjectSlug: "python",
    title: "Python Data Types",
    slug: "python-data-types",
    questions: [
      {
        questionText: "Which of the following is an immutable data type in Python?",
        options: [
          { text: "List" },
          { text: "Dictionary" },
          { text: "Tuple", isCorrect: true },
          { text: "Set" },
        ],
        explanation: "Tuples are immutable in Python, meaning their contents cannot be changed after creation.",
      },
      {
        questionText: "What is the correct way to create a dictionary in Python?",
        options: [
          { text: "dict = []" },
          { text: "dict = {}", isCorrect: true },
          { text: "dict = ()" },
          { text: "dict = set()" },
        ],
        explanation: "Dictionaries in Python are created using curly braces {} or the dict() constructor.",
      },
    ],
  },
  {
    subjectSlug: "operating-systems",
    title: "OS Fundamentals",
    slug: "os-fundamentals",
    questions: [
      {
        questionText: "Which scheduling algorithm gives the shortest average waiting time?",
        options: [
          { text: "FCFS" },
          { text: "SJF", isCorrect: true },
          { text: "Round Robin" },
          { text: "Priority Scheduling" },
        ],
        explanation: "Shortest Job First (SJF) scheduling algorithm provides the minimum average waiting time.",
      },
      {
        questionText: "What is a deadlock in operating systems?",
        options: [
          { text: "When a process runs indefinitely" },
          { text: "When processes wait for each other indefinitely", isCorrect: true },
          { text: "When a process crashes" },
          { text: "When memory is full" },
        ],
        explanation: "Deadlock occurs when processes are blocked forever, waiting for each other to release resources.",
      },
    ],
  },
  {
    subjectSlug: "database-management",
    title: "SQL Basics",
    slug: "sql-basics",
    questions: [
      {
        questionText: "Which SQL command is used to remove a table?",
        options: [
          { text: "DELETE" },
          { text: "DROP", isCorrect: true },
          { text: "REMOVE" },
          { text: "TRUNCATE" },
        ],
        explanation: "DROP command removes the entire table structure and data from the database.",
      },
      {
        questionText: "What does ACID stand for in database transactions?",
        options: [
          { text: "Atomicity, Consistency, Isolation, Durability", isCorrect: true },
          { text: "Accuracy, Consistency, Integrity, Durability" },
          { text: "Atomicity, Concurrency, Isolation, Durability" },
          { text: "Accuracy, Concurrency, Integrity, Durability" },
        ],
        explanation: "ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability.",
      },
    ],
  },
  {
    subjectSlug: "data-structures",
    title: "Arrays & Linked Lists",
    slug: "arrays-linked-lists",
    questions: [
      {
        questionText: "What is the time complexity of accessing an element in an array?",
        options: [
          { text: "O(1)", isCorrect: true },
          { text: "O(n)" },
          { text: "O(log n)" },
          { text: "O(n²)" },
        ],
        explanation: "Array elements can be accessed in constant time O(1) using their index.",
      },
      {
        questionText: "Which data structure uses LIFO principle?",
        options: [
          { text: "Queue" },
          { text: "Stack", isCorrect: true },
          { text: "Array" },
          { text: "Linked List" },
        ],
        explanation: "Stack follows Last In First Out (LIFO) principle - the last element added is the first to be removed.",
      },
    ],
  },
  {
    subjectSlug: "computer-networks",
    title: "Network Basics",
    slug: "network-basics",
    questions: [
      {
        questionText: "Which layer of OSI model handles routing?",
        options: [
          { text: "Data Link Layer" },
          { text: "Network Layer", isCorrect: true },
          { text: "Transport Layer" },
          { text: "Session Layer" },
        ],
        explanation: "The Network Layer (Layer 3) is responsible for routing packets between different networks.",
      },
      {
        questionText: "What is the default port for HTTPS?",
        options: [
          { text: "80" },
          { text: "443", isCorrect: true },
          { text: "21" },
          { text: "25" },
        ],
        explanation: "HTTPS uses port 443 by default, while HTTP uses port 80.",
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔗 MongoDB connected for seeding...");

    // Problem sets and problems data
    const problemsToSeed = [
      {
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",
        topic: "Arrays",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          }
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists."
        ],
        testCases: [
          { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
          { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
          { input: "[3,3]\n6", expectedOutput: "[0,1]" }
        ]
      },
      {
        title: "Reverse Linked List",
        slug: "reverse-linked-list",
        difficulty: "Easy",
        topic: "Linked Lists",
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        examples: [
          {
            input: "head = [1,2,3,4,5]",
            output: "[5,4,3,2,1]"
          }
        ],
        constraints: [
          "The number of nodes in the list is the range [0, 5000].",
          "-5000 <= Node.val <= 5000"
        ],
        testCases: [
          { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" },
          { input: "[1,2]", expectedOutput: "[2,1]" },
          { input: "[]", expectedOutput: "[]" }
        ]
      },
      {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        difficulty: "Easy",
        topic: "Stack",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
        examples: [
          {
            input: 's = "()"',
            output: "true"
          },
          {
            input: 's = "()[]{}"',
            output: "true"
          },
          {
            input: 's = "(]"',
            output: "false"
          }
        ],
        constraints: [
          "1 <= s.length <= 10^4",
          "s consists of parentheses only '()[]{}'."
        ],
        testCases: [
          { input: "()", expectedOutput: "true" },
          { input: "()[]{}", expectedOutput: "true" },
          { input: "(]", expectedOutput: "false" }
        ]
      },
      {
        title: "Binary Search",
        slug: "binary-search",
        difficulty: "Easy",
        topic: "Binary Search",
        description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
        examples: [
          {
            input: "nums = [-1,0,3,5,9,12], target = 9",
            output: "4",
            explanation: "9 exists in nums and its index is 4"
          }
        ],
        constraints: [
          "1 <= nums.length <= 10^4",
          "-10^4 < nums[i], target < 10^4",
          "All the integers in nums are unique.",
          "nums is sorted in ascending order."
        ],
        testCases: [
          { input: "[-1,0,3,5,9,12]\n9", expectedOutput: "4" },
          { input: "[-1,0,3,5,9,12]\n2", expectedOutput: "-1" }
        ]
      },
      {
        title: "Maximum Subarray",
        slug: "maximum-subarray",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        examples: [
          {
            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            output: "6",
            explanation: "[4,-1,2,1] has the largest sum = 6."
          }
        ],
        constraints: [
          "1 <= nums.length <= 10^5",
          "-10^4 <= nums[i] <= 10^4"
        ],
        testCases: [
          { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
          { input: "[1]", expectedOutput: "1" },
          { input: "[5,4,-1,7,8]", expectedOutput: "23" }
        ]
      }
    ];

    const problemSetsToSeed = [
      {
        title: "Beginner's Problem Set",
        slug: "beginners-problem-set",
        description: "Perfect for those starting their coding journey. Covers basic data structures and algorithms.",
        author: "CodeAndChill Team",
        problems: [] // Will be populated with problem IDs
      },
      {
        title: "Array Mastery",
        slug: "array-mastery",
        description: "Master array manipulation techniques with these carefully selected problems.",
        author: "CodeAndChill Team",
        problems: [] // Will be populated with problem IDs
      },
      {
        title: "Interview Prep Essentials",
        slug: "interview-prep-essentials",
        description: "Most commonly asked problems in technical interviews at top companies.",
        author: "CodeAndChill Team",
        problems: [] // Will be populated with problem IDs
      }
    ];

    // Clear existing data
    await Promise.all([
      Course.deleteMany({}),
      GeneralCourse.deleteMany({}),
      Subject.deleteMany({}),
      Quiz.deleteMany({}),
      Problem.deleteMany({}),
      ProblemSet.deleteMany({}),
      LearningPath.deleteMany({}),
    ]);
    console.log("🧹 Cleared existing data");

    // Seed courses
    await Course.insertMany(coursesToSeed);
    console.log("✅ CS Courses seeded");

    // Seed general courses
    await GeneralCourse.insertMany(generalCoursesToSeed);
    console.log("✅ General courses seeded");

    // Seed subjects
    const createdSubjects = await Subject.insertMany(subjectsToSeed);
    const subjectMap = new Map(createdSubjects.map((s) => [s.slug, s._id]));
    console.log("✅ Subjects seeded");

    // Seed quizzes
    for (const quiz of quizzesToSeed) {
      const subjectId = subjectMap.get(quiz.subjectSlug);
      await Quiz.create({ ...quiz, subject: subjectId });
    }
    console.log("✅ Quizzes seeded");

    // Seed problems
    const createdProblems = await Problem.insertMany(problemsToSeed);
    console.log("✅ Problems seeded");

    // Seed problem sets with problem references
    const problemSetsWithProblems = problemSetsToSeed.map((set, index) => {
      if (index === 0) { // Beginner's set
        set.problems = [createdProblems[0]._id, createdProblems[1]._id, createdProblems[2]._id];
      } else if (index === 1) { // Array mastery
        set.problems = [createdProblems[0]._id, createdProblems[4]._id];
      } else { // Interview prep
        set.problems = [createdProblems[0]._id, createdProblems[1]._id, createdProblems[4]._id];
      }
      return set;
    });

    await ProblemSet.insertMany(problemSetsWithProblems);
    console.log("✅ Problem sets seeded");

    // Seed skill tests
    await seedSkillTests();

    // Seed contests
    await seedContests();

    // Seed learning paths (modular approach with real content)
    await seedLearningPathsModular();

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };