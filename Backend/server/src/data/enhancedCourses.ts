export const enhancedCoursesData = [
  {
    title: "Operating Systems",
    slug: "operating-systems",
    description:
      "Master the fundamentals of operating systems including process management, memory allocation, file systems, and system calls.",
    tutor: {
      name: "Dr. Sarah Johnson",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    cost: 0,
    estimatedDuration: "8 weeks",
    difficulty: "Intermediate",
    prerequisites: ["Basic Programming", "Computer Architecture"],
    learningOutcomes: [
      "Understand process and thread management",
      "Master memory management techniques",
      "Learn file system operations",
      "Implement system calls and interrupts",
    ],
    modules: [
      {
        title: "Introduction to Operating Systems",
        lessons: [
          {
            title: "What is an Operating System?",
            topics: [
              {
                title: "Definition and Purpose",
                contentType: "text",
                textContent: `An Operating System (OS) is a crucial software component that acts as an intermediary between computer hardware and application programs. It manages system resources, provides services to applications, and creates an environment where users can interact with the computer efficiently.

Key Functions of an Operating System:
• Resource Management: Allocates CPU time, memory, storage, and I/O devices
• Process Management: Creates, schedules, and terminates processes
• Memory Management: Manages RAM allocation and virtual memory
• File System Management: Organizes and controls access to files and directories
• Security and Protection: Ensures system integrity and user data protection
• User Interface: Provides command-line or graphical interfaces for user interaction

The OS serves as a platform that abstracts the complexity of hardware, making it easier for developers to write applications without worrying about low-level hardware details.`,
              },
              {
                title: "Types of Operating Systems",
                contentType: "text",
                textContent: `Operating systems can be classified based on various criteria:

1. Based on User Interface:
   • Command Line Interface (CLI): Text-based interaction (e.g., Linux Terminal)
   • Graphical User Interface (GUI): Visual interaction with windows and icons (e.g., Windows, macOS)

2. Based on Number of Users:
   • Single-user OS: Supports one user at a time (e.g., MS-DOS, early Windows)
   • Multi-user OS: Supports multiple users simultaneously (e.g., Linux, Unix, Windows Server)

3. Based on Number of Tasks:
   • Single-tasking: Executes one program at a time (e.g., MS-DOS)
   • Multi-tasking: Executes multiple programs concurrently (e.g., modern OS)

4. Based on Processing:
   • Batch Processing: Jobs are processed in batches without user interaction
   • Time-sharing: CPU time is shared among multiple users/processes
   • Real-time: Guarantees response within specified time constraints
   • Distributed: Manages resources across multiple networked computers

5. Popular Operating Systems:
   • Windows: User-friendly GUI, widely used in personal computers
   • Linux: Open-source, highly customizable, popular in servers
   • macOS: Apple's OS with elegant design and Unix-based architecture
   • Android/iOS: Mobile operating systems for smartphones and tablets`,
              },
              {
                title: "OS Architecture and Components",
                contentType: "text",
                textContent: `Operating System Architecture consists of several layers and components working together:

Layered Architecture:
1. Hardware Layer: Physical components (CPU, RAM, storage devices)
2. Kernel Layer: Core OS functions (process management, memory management)
3. System Call Interface: Bridge between user programs and kernel
4. System Programs: Utilities and services (file managers, compilers)
5. Application Layer: User applications and programs

Key OS Components:

1. Kernel:
   • The core component that manages system resources
   • Types: Monolithic, Microkernel, Hybrid
   • Handles system calls, interrupts, and hardware communication

2. Process Manager:
   • Creates, schedules, and terminates processes
   • Manages process states and context switching
   • Handles inter-process communication (IPC)

3. Memory Manager:
   • Allocates and deallocates memory
   • Implements virtual memory and paging
   • Manages memory protection and sharing

4. File System Manager:
   • Organizes data storage on secondary storage devices
   • Manages file operations (create, read, write, delete)
   • Implements file permissions and access control

5. I/O Manager:
   • Controls input/output operations
   • Manages device drivers and hardware interfaces
   • Handles buffering and caching for I/O operations

6. Security Manager:
   • Implements authentication and authorization
   • Manages user accounts and permissions
   • Protects system resources from unauthorized access`,
              },
            ],
          },
          {
            title: "System Calls and APIs",
            topics: [
              {
                title: "Understanding System Calls",
                contentType: "text",
                textContent: `System calls are the interface between user programs and the operating system kernel. They provide a way for applications to request services from the OS, such as file operations, process creation, and network communication.

What are System Calls?
• Programming interface to OS services
• Bridge between user space and kernel space
• Mechanism for controlled access to system resources
• Essential for application-OS interaction

Types of System Calls:

1. Process Control:
   • fork(): Create a new process
   • exec(): Execute a program
   • wait(): Wait for process completion
   • exit(): Terminate a process
   • getpid(): Get process ID

2. File Management:
   • open(): Open a file
   • read(): Read from a file
   • write(): Write to a file
   • close(): Close a file
   • lseek(): Move file pointer

3. Device Management:
   • ioctl(): Control I/O devices
   • read(): Read from device
   • write(): Write to device

4. Information Maintenance:
   • getpid(): Get process information
   • alarm(): Set process alarm
   • sleep(): Suspend process execution

5. Communication:
   • pipe(): Create communication pipe
   • shmget(): Get shared memory
   • msgget(): Get message queue

System Call Execution Process:
1. Application makes system call
2. CPU switches to kernel mode
3. Kernel validates parameters
4. Kernel executes requested operation
5. Results returned to application
6. CPU switches back to user mode`,
              },
              {
                title: "API vs System Calls",
                contentType: "text",
                textContent: `Understanding the difference between APIs and System Calls:

Application Programming Interface (API):
• High-level interface for application developers
• Provides abstraction over system calls
• Language-specific implementations
• Easier to use and more portable
• Examples: POSIX API, Win32 API, Java API

System Calls:
• Low-level interface to kernel services
• Direct communication with OS kernel
• Platform and OS specific
• More efficient but complex to use
• Examples: Linux system calls, Windows NT system calls

Relationship between API and System Calls:
• APIs often wrap system calls
• One API call may invoke multiple system calls
• APIs provide error handling and parameter validation
• System calls provide the actual OS functionality

Example - File Reading:
API Level (C library): fopen(), fread(), fclose()`,
              },
            ],
          },
        ],
      },
    ],
  },
];
