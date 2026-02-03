import EngineeringCourse from "../models/EngineeringCourse";

export const seedEngineeringCourses = async () => {
  try {
    console.log("🌱 Seeding ALL 7 engineering courses with COMPLETE data...");

    // Clear existing courses
    await EngineeringCourse.deleteMany({});
    console.log("🧹 Cleared existing engineering courses");

    const engineeringCoursesData = [
      // 1. DATA STRUCTURES & ALGORITHMS
      {
        id: "dsa",
        title: "Data Structures & Algorithms",
        description:
          "Master fundamental data structures and algorithms essential for programming interviews and efficient coding.",
        difficulty: "intermediate" as const,
        duration: "60 hours",
        totalLessons: 35,
        estimatedHours: 60,
        category: "Computer Science",
        tags: [
          "algorithms",
          "data-structures",
          "programming",
          "interviews",
          "problem-solving",
        ],
        prerequisites: [
          "Basic programming knowledge",
          "Understanding of loops and functions",
          "Mathematical thinking",
        ],
        learningOutcomes: [
          "Master fundamental data structures (arrays, linked lists, stacks, queues)",
          "Understand and implement sorting and searching algorithms",
          "Analyze time and space complexity using Big O notation",
          "Solve coding interview problems efficiently",
          "Apply algorithmic thinking to real-world problems",
        ],
        modules: [
          {
            id: "module-1",
            title: "Arrays and Strings",
            description:
              "Learn fundamental array and string operations and algorithms",
            order: 1,
            lessons: [
              {
                id: "lesson-1-1",
                title: "Introduction to Arrays",
                description:
                  "Understanding array data structure and basic operations",
                content: `# Introduction to Arrays

Arrays are fundamental data structures that store elements in contiguous memory locations.

## Key Concepts:
- Fixed Size: Arrays have predetermined size
- Index-based Access: Elements accessed using indices
- Contiguous Memory: Elements stored adjacently

## Time Complexities:
- Access: O(1)
- Search: O(n)
- Insertion: O(n)
- Deletion: O(n)

## Applications:
- Storing homogeneous data
- Mathematical operations
- Implementing other data structures`,
                duration: 45,
                order: 1,
                codeExamples: [
                  {
                    language: "javascript",
                    code: "let numbers = [1, 2, 3, 4, 5];\nconsole.log(numbers[0]); // 1\nnumbers.push(6); // Add to end\nnumbers[2] = 10; // Update element",
                    description: "Basic array operations in JavaScript",
                  },
                  {
                    language: "python",
                    code: "numbers = [1, 2, 3, 4, 5]\nprint(numbers[0])  # 1\nnumbers.append(6)  # Add to end\nnumbers[2] = 10    # Update element",
                    description: "Basic array operations in Python",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the time complexity of accessing an element in an array by index?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                    correctAnswer: 0,
                    explanation:
                      "Array access by index is O(1) due to contiguous memory allocation.",
                  },
                ],
              },
              {
                id: "lesson-1-2",
                title: "Array Operations",
                description:
                  "Common array operations and their implementations",
                content: `# Array Operations

Learn essential array operations including insertion, deletion, and searching.

## Operations:
- Insertion at beginning, middle, end
- Deletion from any position
- Linear and binary search
- Array traversal techniques

## Insertion Complexities:
- At beginning: O(n) - requires shifting
- At end: O(1) - if space available
- At middle: O(n) - requires shifting

## Deletion Complexities:
- From beginning: O(n) - requires shifting
- From end: O(1) - simple removal
- From middle: O(n) - requires shifting`,
                duration: 50,
                order: 2,
                codeExamples: [
                  {
                    language: "python",
                    code: "arr = [1, 2, 3, 4, 5]\narr.insert(0, 0)  # Insert at beginning\narr.append(6)     # Insert at end\narr.insert(3, 99) # Insert at position 3\nprint(arr)        # [0, 1, 2, 99, 3, 4, 5, 6]",
                    description: "Array insertion operations in Python",
                  },
                  {
                    language: "java",
                    code: "int[] arr = {1, 2, 3, 4, 5};\n// Java arrays have fixed size\n// Use ArrayList for dynamic operations\nArrayList<Integer> list = new ArrayList<>();\nlist.add(1); list.add(2); list.add(3);\nlist.add(0, 0); // Insert at beginning",
                    description: "Array operations in Java using ArrayList",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the time complexity of inserting an element at the beginning of an array?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                    correctAnswer: 2,
                    explanation:
                      "Inserting at the beginning requires shifting all existing elements, making it O(n).",
                  },
                ],
              },
              {
                id: "lesson-1-3",
                title: "String Manipulation",
                description: "Working with strings and string algorithms",
                content: `# String Manipulation

Strings are arrays of characters with special properties and operations.

## Common Operations:
- Concatenation and substring
- Pattern matching and searching
- String reversal and rotation
- Palindrome checking
- Case conversion

## String Algorithms:
- KMP (Knuth-Morris-Pratt) for pattern matching
- Rabin-Karp for multiple pattern search
- Boyer-Moore for efficient text search
- Z-algorithm for pattern matching

## Important Notes:
- Strings are immutable in many languages
- String operations can be expensive
- StringBuilder/StringBuffer for efficient concatenation`,
                duration: 40,
                order: 3,
                codeExamples: [
                  {
                    language: "java",
                    code: 'String str = "Hello World";\nString reversed = new StringBuilder(str).reverse().toString();\nSystem.out.println(reversed); // dlroW olleH\n\n// Check palindrome\nboolean isPalindrome = str.equals(new StringBuilder(str).reverse().toString());',
                    description: "String reversal and palindrome check in Java",
                  },
                  {
                    language: "python",
                    code: 'text = "Hello World"\nreversed_text = text[::-1]  # dlroW olleH\n\n# Check palindrome\ndef is_palindrome(s):\n    return s == s[::-1]\n\nprint(is_palindrome("racecar"))  # True',
                    description: "String operations in Python",
                  },
                ],
                quiz: [
                  {
                    question:
                      "Which algorithm is most efficient for finding multiple occurrences of a pattern in text?",
                    options: [
                      "Naive approach",
                      "KMP algorithm",
                      "Rabin-Karp algorithm",
                      "Boyer-Moore algorithm",
                    ],
                    correctAnswer: 1,
                    explanation:
                      "KMP algorithm is most efficient for finding multiple pattern occurrences with O(n+m) complexity.",
                  },
                ],
              },
              {
                id: "lesson-1-4",
                title: "Two Pointer Technique",
                description:
                  "Master the two-pointer technique for array problems",
                content: `# Two Pointer Technique

Efficient approach for solving array and string problems using two pointers.

## Applications:
- Finding pairs with target sum
- Removing duplicates from sorted arrays
- Palindrome verification
- Array reversal
- Finding triplets
- Container with most water

## Types:
1. **Opposite Direction**: Start from both ends, move towards center
2. **Same Direction**: Both pointers move in same direction at different speeds
3. **Sliding Window**: Maintain a window of elements

## Advantages:
- Reduces time complexity from O(n²) to O(n)
- Space efficient - O(1) extra space
- Simple to implement and understand`,
                duration: 55,
                order: 4,
                codeExamples: [
                  {
                    language: "cpp",
                    code: "// Two Sum using two pointers (sorted array)\nvector<int> twoSum(vector<int>& nums, int target) {\n    int left = 0, right = nums.size() - 1;\n    while (left < right) {\n        int sum = nums[left] + nums[right];\n        if (sum == target) return {left, right};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return {};\n}",
                    description:
                      "Two pointer technique for Two Sum problem in C++",
                  },
                  {
                    language: "python",
                    code: "# Remove duplicates from sorted array\ndef remove_duplicates(nums):\n    if not nums:\n        return 0\n    \n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    \n    return slow + 1",
                    description:
                      "Two pointer technique for removing duplicates in Python",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the main advantage of the two-pointer technique?",
                    options: [
                      "Reduces space complexity",
                      "Reduces time complexity",
                      "Easier to implement",
                      "Works on unsorted arrays",
                    ],
                    correctAnswer: 1,
                    explanation:
                      "Two-pointer technique typically reduces time complexity from O(n²) to O(n) for many problems.",
                  },
                ],
              },
              {
                id: "lesson-1-5",
                title: "Sliding Window Technique",
                description:
                  "Learn sliding window approach for subarray problems",
                content: `# Sliding Window Technique

Technique for solving problems involving subarrays or substrings efficiently.

## Types:
1. **Fixed Size Window**: Window size remains constant
2. **Variable Size Window**: Window size changes based on conditions

## Applications:
- Maximum sum subarray of size k
- Longest substring without repeating characters
- Minimum window substring
- Find all anagrams in a string

## Template:
1. Expand window by moving right pointer
2. Contract window by moving left pointer when condition violated
3. Update result when valid window found

## Time Complexity: O(n) - each element visited at most twice`,
                duration: 50,
                order: 5,
                codeExamples: [
                  {
                    language: "python",
                    code: "# Maximum sum subarray of size k\ndef max_sum_subarray(arr, k):\n    if len(arr) < k:\n        return -1\n    \n    # Calculate sum of first window\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n    \n    # Slide the window\n    for i in range(len(arr) - k):\n        window_sum = window_sum - arr[i] + arr[i + k]\n        max_sum = max(max_sum, window_sum)\n    \n    return max_sum",
                    description: "Fixed size sliding window in Python",
                  },
                ],
                quiz: [],
              },
            ],
          },
          {
            id: "module-2",
            title: "Linked Lists",
            description:
              "Understanding linked list data structures and operations",
            order: 2,
            lessons: [
              {
                id: "lesson-2-1",
                title: "Singly Linked Lists",
                description:
                  "Introduction to singly linked lists and basic operations",
                content: `# Singly Linked Lists

Linear data structure where elements are stored in nodes, each containing data and a reference to the next node.

## Structure:
- **Node**: Contains data and pointer to next node
- **Head**: Reference to the first node
- **Tail**: Last node (points to null)

## Advantages:
- Dynamic size - can grow/shrink during runtime
- Efficient insertion/deletion at beginning - O(1)
- Memory efficient - allocates memory as needed
- No memory waste

## Disadvantages:
- No random access - must traverse from head
- Extra memory for storing pointers
- Not cache-friendly due to non-contiguous memory
- Cannot traverse backwards`,
                duration: 50,
                order: 1,
                codeExamples: [
                  {
                    language: "python",
                    code: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n# Create linked list: 1 -> 2 -> 3\nhead = ListNode(1)\nhead.next = ListNode(2)\nhead.next.next = ListNode(3)\n\n# Traverse and print\ncurrent = head\nwhile current:\n    print(current.val)\n    current = current.next",
                    description: "Singly linked list implementation in Python",
                  },
                  {
                    language: "java",
                    code: "class ListNode {\n    int val;\n    ListNode next;\n    \n    ListNode(int val) {\n        this.val = val;\n        this.next = null;\n    }\n}\n\n// Insert at beginning\npublic ListNode insertAtHead(ListNode head, int val) {\n    ListNode newNode = new ListNode(val);\n    newNode.next = head;\n    return newNode;\n}",
                    description: "Singly linked list in Java with insertion",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the time complexity of inserting a node at the beginning of a singly linked list?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                    correctAnswer: 0,
                    explanation:
                      "Insertion at the beginning only requires updating the head pointer, making it O(1).",
                  },
                ],
              },
              {
                id: "lesson-2-2",
                title: "Doubly Linked Lists",
                description:
                  "Understanding doubly linked lists with bidirectional traversal",
                content: `# Doubly Linked Lists

Each node contains data and two pointers: one to the next node and one to the previous node.

## Structure:
- **Node**: Contains data, next pointer, and previous pointer
- **Head**: Reference to first node
- **Tail**: Reference to last node

## Advantages:
- Bidirectional traversal
- Easier deletion when node reference is given
- Can traverse backwards efficiently
- Better for certain algorithms (like LRU cache)

## Disadvantages:
- Extra memory for previous pointer
- More complex implementation
- Slightly more overhead for operations`,
                duration: 45,
                order: 2,
                codeExamples: [
                  {
                    language: "java",
                    code: "class DoublyListNode {\n    int val;\n    DoublyListNode next;\n    DoublyListNode prev;\n    \n    DoublyListNode(int val) {\n        this.val = val;\n        this.next = null;\n        this.prev = null;\n    }\n}\n\n// Insert at beginning\npublic DoublyListNode insertAtHead(DoublyListNode head, int val) {\n    DoublyListNode newNode = new DoublyListNode(val);\n    if (head != null) {\n        head.prev = newNode;\n        newNode.next = head;\n    }\n    return newNode;\n}",
                    description:
                      "Doubly linked list node and insertion in Java",
                  },
                ],
                quiz: [],
              },
              {
                id: "lesson-2-3",
                title: "Circular Linked Lists",
                description:
                  "Circular linked lists where last node points to first",
                content: `# Circular Linked Lists

Last node points back to the first node, forming a circle. Can be singly or doubly circular.

## Applications:
- Round-robin scheduling in operating systems
- Music playlist (continuous loop)
- Browser history navigation
- Game turn management
- Implementing circular buffers

## Advantages:
- Can traverse entire list from any node
- Useful for cyclic operations
- No null pointers (except empty list)
- Efficient for round-robin algorithms

## Disadvantages:
- Risk of infinite loops if not handled carefully
- Slightly more complex termination conditions
- Detection of end requires special handling`,
                duration: 40,
                order: 3,
                codeExamples: [
                  {
                    language: "cpp",
                    code: "struct CircularNode {\n    int data;\n    CircularNode* next;\n    \n    CircularNode(int val) : data(val), next(nullptr) {}\n};\n\n// Insert in circular list\nCircularNode* insert(CircularNode* head, int val) {\n    CircularNode* newNode = new CircularNode(val);\n    \n    if (!head) {\n        newNode->next = newNode; // Points to itself\n        return newNode;\n    }\n    \n    // Find last node\n    CircularNode* temp = head;\n    while (temp->next != head) {\n        temp = temp->next;\n    }\n    \n    temp->next = newNode;\n    newNode->next = head;\n    return head;\n}",
                    description: "Circular linked list implementation in C++",
                  },
                ],
                quiz: [],
              },
              {
                id: "lesson-2-4",
                title: "Advanced Linked List Operations",
                description:
                  "Advanced operations and algorithms for linked lists",
                content: `# Advanced Linked List Operations

## Common Operations:
1. **Reversing**: Iterative and recursive approaches
2. **Cycle Detection**: Floyd's cycle detection algorithm
3. **Finding Middle**: Slow and fast pointer technique
4. **Merging**: Merge two sorted linked lists
5. **Removing Duplicates**: From sorted and unsorted lists

## Floyd's Cycle Detection (Tortoise and Hare):
- Use two pointers: slow (moves 1 step) and fast (moves 2 steps)
- If there's a cycle, fast will eventually meet slow
- Time: O(n), Space: O(1)

## Finding Middle Element:
- Use slow and fast pointers
- When fast reaches end, slow is at middle
- Works for both even and odd length lists`,
                duration: 60,
                order: 4,
                codeExamples: [
                  {
                    language: "python",
                    code: "# Reverse linked list iteratively\ndef reverse_list(head):\n    prev = None\n    current = head\n    \n    while current:\n        next_temp = current.next\n        current.next = prev\n        prev = current\n        current = next_temp\n    \n    return prev\n\n# Detect cycle using Floyd's algorithm\ndef has_cycle(head):\n    if not head or not head.next:\n        return False\n    \n    slow = head\n    fast = head.next\n    \n    while fast and fast.next:\n        if slow == fast:\n            return True\n        slow = slow.next\n        fast = fast.next.next\n    \n    return False",
                    description: "Advanced linked list operations in Python",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the time complexity of Floyd's cycle detection algorithm?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                    correctAnswer: 2,
                    explanation:
                      "Floyd's algorithm uses two pointers and visits each node at most once, making it O(n).",
                  },
                ],
              },
            ],
          },
          {
            id: "module-3",
            title: "Stacks and Queues",
            description:
              "Learn stack and queue data structures and their applications",
            order: 3,
            lessons: [
              {
                id: "lesson-3-1",
                title: "Stack Data Structure",
                description:
                  "Understanding LIFO principle and stack operations",
                content: `# Stack Data Structure

Linear data structure that follows Last In First Out (LIFO) principle.

## Operations:
- **Push**: Add element to top - O(1)
- **Pop**: Remove element from top - O(1)
- **Peek/Top**: View top element without removing - O(1)
- **isEmpty**: Check if stack is empty - O(1)

## Applications:
- Function call management (call stack)
- Expression evaluation and syntax parsing
- Undo operations in applications
- Browser history (back button)
- Balanced parentheses checking
- Depth-First Search (DFS)

## Implementation:
- Array-based: Fixed size, simple implementation
- Linked list-based: Dynamic size, more memory overhead`,
                duration: 45,
                order: 1,
                codeExamples: [
                  {
                    language: "python",
                    code: "class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.append(item)\n    \n    def pop(self):\n        if not self.is_empty():\n            return self.items.pop()\n        return None\n    \n    def peek(self):\n        if not self.is_empty():\n            return self.items[-1]\n        return None\n    \n    def is_empty(self):\n        return len(self.items) == 0\n\n# Usage\nstack = Stack()\nstack.push(1)\nstack.push(2)\nprint(stack.pop())  # 2",
                    description: "Stack implementation using Python list",
                  },
                ],
                quiz: [
                  {
                    question: "Which principle does a stack follow?",
                    options: [
                      "FIFO",
                      "LIFO",
                      "Random Access",
                      "Priority Based",
                    ],
                    correctAnswer: 1,
                    explanation:
                      "Stack follows Last In First Out (LIFO) principle - last element added is first to be removed.",
                  },
                ],
              },
              {
                id: "lesson-3-2",
                title: "Queue Data Structure",
                description:
                  "Understanding FIFO principle and queue operations",
                content: `# Queue Data Structure

Linear data structure that follows First In First Out (FIFO) principle.

## Operations:
- **Enqueue**: Add element to rear - O(1)
- **Dequeue**: Remove element from front - O(1)
- **Front**: View front element - O(1)
- **Rear**: View rear element - O(1)
- **isEmpty**: Check if queue is empty - O(1)

## Types:
1. **Simple Queue**: Basic FIFO queue
2. **Circular Queue**: Rear connects to front when full
3. **Priority Queue**: Elements have priorities
4. **Double-ended Queue (Deque)**: Insert/delete from both ends

## Applications:
- Process scheduling in operating systems
- Breadth-First Search (BFS)
- Handling requests in web servers
- Print job management
- Buffer for data streams`,
                duration: 50,
                order: 2,
                codeExamples: [
                  {
                    language: "java",
                    code: "import java.util.*;\n\n// Using built-in Queue\nQueue<Integer> queue = new LinkedList<>();\nqueue.offer(1);  // Enqueue\nqueue.offer(2);\nqueue.offer(3);\n\nSystem.out.println(queue.poll()); // Dequeue: 1\nSystem.out.println(queue.peek()); // Front: 2\n\n// Custom implementation using array\nclass ArrayQueue {\n    private int[] arr;\n    private int front, rear, size, capacity;\n    \n    public ArrayQueue(int capacity) {\n        this.capacity = capacity;\n        this.arr = new int[capacity];\n        this.front = 0;\n        this.rear = -1;\n        this.size = 0;\n    }\n    \n    public void enqueue(int item) {\n        if (size == capacity) return; // Full\n        rear = (rear + 1) % capacity;\n        arr[rear] = item;\n        size++;\n    }\n}",
                    description: "Queue implementation in Java",
                  },
                ],
                quiz: [],
              },
            ],
          },
          {
            id: "module-4",
            title: "Trees and Binary Search Trees",
            description: "Understanding tree structures and BST operations",
            order: 4,
            lessons: [
              {
                id: "lesson-4-1",
                title: "Binary Trees",
                description:
                  "Introduction to binary tree structure and traversals",
                content: `# Binary Trees

Hierarchical data structure where each node has at most two children (left and right).

## Terminology:
- **Root**: Top node of the tree
- **Leaf**: Node with no children
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to a node
- **Level**: All nodes at same depth

## Types:
1. **Full Binary Tree**: Every node has 0 or 2 children
2. **Complete Binary Tree**: All levels filled except possibly last
3. **Perfect Binary Tree**: All internal nodes have 2 children, all leaves at same level
4. **Balanced Binary Tree**: Height difference between subtrees ≤ 1

## Traversals:
- **Inorder**: Left → Root → Right
- **Preorder**: Root → Left → Right  
- **Postorder**: Left → Right → Root
- **Level Order**: Breadth-first traversal`,
                duration: 55,
                order: 1,
                codeExamples: [
                  {
                    language: "python",
                    code: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n# Tree traversals\ndef inorder(root):\n    if root:\n        inorder(root.left)\n        print(root.val)\n        inorder(root.right)\n\ndef preorder(root):\n    if root:\n        print(root.val)\n        preorder(root.left)\n        preorder(root.right)\n\ndef postorder(root):\n    if root:\n        postorder(root.left)\n        postorder(root.right)\n        print(root.val)",
                    description: "Binary tree traversals in Python",
                  },
                ],
                quiz: [],
              },
            ],
          },
        ],
        isActive: true,
        createdBy: "system",
      },

      // 2. DATABASE MANAGEMENT SYSTEMS
      {
        id: "dbms",
        title: "Database Management Systems",
        description:
          "Learn database design, SQL, normalization, and advanced database concepts for modern applications.",
        difficulty: "intermediate" as const,
        duration: "45 hours",
        totalLessons: 28,
        estimatedHours: 45,
        category: "Computer Science",
        tags: ["database", "sql", "normalization", "rdbms", "data-modeling"],
        prerequisites: [
          "Basic understanding of data organization",
          "Logical thinking",
          "Basic mathematics",
        ],
        learningOutcomes: [
          "Design efficient database schemas",
          "Write complex SQL queries for data manipulation",
          "Understand normalization principles and apply them",
          "Implement database transactions and ensure ACID properties",
          "Optimize database performance and indexing",
        ],
        modules: [
          {
            id: "module-1",
            title: "Database Fundamentals",
            description: "Introduction to database concepts and models",
            order: 1,
            lessons: [
              {
                id: "lesson-1-1",
                title: "Introduction to DBMS",
                description:
                  "Understanding database management systems and their importance",
                content: `# Introduction to DBMS

Database Management System (DBMS) is software for creating and managing databases.

## Functions:
- Data storage and retrieval
- Data integrity and security
- Concurrent access control
- Backup and recovery
- Query processing and optimization

## Types of DBMS:
1. **Relational DBMS**: MySQL, PostgreSQL, Oracle, SQL Server
2. **NoSQL DBMS**: MongoDB, Cassandra, Redis
3. **Graph DBMS**: Neo4j, Amazon Neptune
4. **Object-Oriented DBMS**: ObjectDB, Versant

## Advantages:
- Data independence
- Efficient data access
- Data integrity and security
- Concurrent access control
- Reduced application development time
- Backup and recovery services`,
                duration: 50,
                order: 1,
                codeExamples: [
                  {
                    language: "sql",
                    code: "CREATE DATABASE company_db;\nUSE company_db;\n\nCREATE TABLE employees (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100) NOT NULL,\n    department VARCHAR(50),\n    salary DECIMAL(10,2),\n    hire_date DATE\n);\n\nINSERT INTO employees (name, department, salary, hire_date)\nVALUES ('John Doe', 'Engineering', 75000.00, '2023-01-15');",
                    description:
                      "Basic database and table creation with sample data",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the primary advantage of using a DBMS over file systems?",
                    options: [
                      "Faster access",
                      "Data independence",
                      "Less storage space",
                      "Simpler programming",
                    ],
                    correctAnswer: 1,
                    explanation:
                      "Data independence allows applications to be isolated from changes in data storage structure.",
                  },
                ],
              },
            ],
          },
        ],
        isActive: true,
        createdBy: "system",
      },
      // 3. OPERATING SYSTEMS
      {
        id: "operating-systems",
        title: "Operating Systems",
        description:
          "Comprehensive study of operating system concepts including process management, memory management, and file systems.",
        difficulty: "intermediate" as const,
        duration: "50 hours",
        totalLessons: 32,
        estimatedHours: 50,
        category: "Computer Science",
        tags: [
          "operating-systems",
          "process-management",
          "memory-management",
          "file-systems",
          "concurrency",
        ],
        prerequisites: [
          "Basic computer architecture knowledge",
          "Understanding of programming concepts",
          "Basic knowledge of computer hardware",
        ],
        learningOutcomes: [
          "Understand operating system structure and components",
          "Master process and thread management concepts",
          "Learn memory management techniques and virtual memory",
          "Understand file system organization and implementation",
          "Apply synchronization mechanisms for concurrent processes",
        ],
        modules: [
          {
            id: "module-1",
            title: "Introduction to Operating Systems",
            description:
              "Fundamental concepts and overview of operating systems",
            order: 1,
            lessons: [
              {
                id: "lesson-1-1",
                title: "What is an Operating System?",
                description:
                  "Definition, goals, and functions of operating systems",
                content: `# What is an Operating System?

An Operating System is system software that manages computer hardware and software resources and provides common services for computer programs.

## Main Goals:
1. **Resource Management**: Efficiently manage CPU, memory, I/O devices
2. **Process Management**: Create, schedule, and terminate processes
3. **Memory Management**: Allocate and deallocate memory
4. **File System Management**: Organize and access files
5. **Security and Protection**: Protect system resources

## Functions:
- **Process Management**: Creating, scheduling, terminating processes
- **Memory Management**: Allocation and deallocation of memory
- **File Management**: Organizing and accessing files
- **Device Management**: Controlling I/O devices
- **Security**: Protecting system resources
- **User Interface**: Providing interaction methods (CLI/GUI)

## Types of Operating Systems:
1. **Batch OS**: Jobs processed in batches without user interaction
2. **Time-Sharing OS**: Multiple users can use system simultaneously
3. **Distributed OS**: Manages group of independent computers
4. **Real-time OS**: Provides immediate response to inputs
5. **Network OS**: Manages network resources`,
                duration: 45,
                order: 1,
                codeExamples: [
                  {
                    language: "c",
                    code: '#include <stdio.h>\n#include <unistd.h>\n#include <sys/types.h>\n\nint main() {\n    pid_t pid = getpid();  // Get process ID\n    printf("Current Process ID: %d\\n", pid);\n    \n    pid_t ppid = getppid(); // Get parent process ID\n    printf("Parent Process ID: %d\\n", ppid);\n    \n    return 0;\n}',
                    description:
                      "Basic system calls to get process information in C",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the primary function of an operating system?",
                    options: [
                      "Run applications",
                      "Manage system resources",
                      "Provide internet access",
                      "Store data",
                    ],
                    correctAnswer: 1,
                    explanation:
                      "The primary function of an OS is to manage system resources including CPU, memory, and I/O devices.",
                  },
                ],
              },
            ],
          },
        ],
        isActive: true,
        createdBy: "system",
      },

      // 4. COMPUTER NETWORKS
      {
        id: "computer-networks",
        title: "Computer Networks",
        description:
          "Learn networking fundamentals, protocols, and network architecture for modern communication systems.",
        difficulty: "intermediate" as const,
        duration: "40 hours",
        totalLessons: 30,
        estimatedHours: 40,
        category: "Computer Science",
        tags: [
          "networking",
          "protocols",
          "tcp-ip",
          "osi-model",
          "network-security",
        ],
        prerequisites: [
          "Basic computer knowledge",
          "Understanding of digital communication",
          "Basic mathematics",
        ],
        learningOutcomes: [
          "Understand network topologies and architectures",
          "Master TCP/IP protocol suite and OSI model",
          "Learn routing and switching concepts",
          "Implement network security measures",
          "Design and troubleshoot network systems",
        ],
        modules: [
          {
            id: "module-1",
            title: "Network Fundamentals",
            description: "Basic concepts of computer networking",
            order: 1,
            lessons: [
              {
                id: "lesson-1-1",
                title: "Introduction to Computer Networks",
                description:
                  "What are computer networks and why do we need them?",
                content: `# Introduction to Computer Networks

A computer network is a collection of interconnected devices that can communicate and share resources.

## Why Networks?
- **Data Sharing**: Share files, databases, and information
- **Resource Sharing**: Share printers, storage, applications
- **Communication**: Email, messaging, video calls
- **Distributed Processing**: Distribute computational tasks
- **Reliability**: Backup and redundancy

## Network Components:
1. **Nodes**: Computers, servers, routers, switches
2. **Links**: Physical or wireless connections
3. **Protocols**: Rules for communication
4. **Network Software**: Operating systems, applications
5. **Network Hardware**: Cables, routers, switches, hubs

## Types by Size:
- **PAN (Personal Area Network)**: 1-10 meters
- **LAN (Local Area Network)**: Up to few kilometers
- **MAN (Metropolitan Area Network)**: City-wide
- **WAN (Wide Area Network)**: Country or continent-wide

## Types by Topology:
- **Bus**: All devices connected to single cable
- **Star**: All devices connected to central hub
- **Ring**: Devices connected in circular fashion
- **Mesh**: Every device connected to every other device
- **Tree**: Hierarchical structure`,
                duration: 50,
                order: 1,
                codeExamples: [
                  {
                    language: "python",
                    code: 'import socket\n\n# Simple client-server communication\n# Server code\nserver_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\nserver_socket.bind((\'localhost\', 8080))\nserver_socket.listen(1)\n\nprint("Server listening on port 8080")\nconn, addr = server_socket.accept()\nprint(f"Connection from {addr}")\n\ndata = conn.recv(1024)\nprint(f"Received: {data.decode()}")\n\nconn.send(b"Hello from server!")\nconn.close()',
                    description: "Basic socket programming in Python",
                  },
                ],
                quiz: [
                  {
                    question:
                      "Which network type covers the largest geographical area?",
                    options: ["PAN", "LAN", "MAN", "WAN"],
                    correctAnswer: 3,
                    explanation:
                      "WAN (Wide Area Network) covers the largest area, spanning countries or continents.",
                  },
                ],
              },
            ],
          },
        ],
        isActive: true,
        createdBy: "system",
      },

      // 5. SOFTWARE ENGINEERING
      {
        id: "software-engineering",
        title: "Software Engineering",
        description:
          "Learn software development methodologies, design patterns, and best practices for building scalable applications.",
        difficulty: "intermediate" as const,
        duration: "55 hours",
        totalLessons: 35,
        estimatedHours: 55,
        category: "Computer Science",
        tags: [
          "software-engineering",
          "design-patterns",
          "sdlc",
          "agile",
          "testing",
        ],
        prerequisites: [
          "Programming experience in any language",
          "Basic understanding of algorithms",
          "Problem-solving skills",
        ],
        learningOutcomes: [
          "Understand software development life cycle (SDLC)",
          "Apply design patterns and architectural principles",
          "Master agile development methodologies",
          "Implement testing strategies and quality assurance",
          "Design scalable and maintainable software systems",
        ],
        modules: [
          {
            id: "module-1",
            title: "Software Development Life Cycle",
            description:
              "Understanding the phases and methodologies of software development",
            order: 1,
            lessons: [
              {
                id: "lesson-1-1",
                title: "Introduction to Software Engineering",
                description:
                  "What is software engineering and why is it important?",
                content: `# Introduction to Software Engineering

Software Engineering is the systematic approach to the design, development, and maintenance of software systems.

## Why Software Engineering?
- **Complexity Management**: Handle large, complex systems
- **Quality Assurance**: Ensure reliable, maintainable software
- **Cost Control**: Manage development costs and timelines
- **Team Collaboration**: Enable effective teamwork
- **Risk Management**: Identify and mitigate project risks

## Software Engineering Principles:
1. **Modularity**: Break system into manageable modules
2. **Abstraction**: Hide implementation details
3. **Encapsulation**: Bundle data and methods together
4. **Hierarchy**: Organize components in hierarchical structure
5. **Separation of Concerns**: Each module handles specific functionality

## Software Development Life Cycle (SDLC) Phases:
1. **Requirements Analysis**: Understand what needs to be built
2. **System Design**: Plan the system architecture
3. **Implementation**: Write the actual code
4. **Testing**: Verify system works correctly
5. **Deployment**: Release system to users
6. **Maintenance**: Ongoing support and updates

## SDLC Models:
- **Waterfall**: Sequential phases
- **Agile**: Iterative and incremental
- **Spiral**: Risk-driven approach
- **V-Model**: Verification and validation focus`,
                duration: 50,
                order: 1,
                codeExamples: [
                  {
                    language: "python",
                    code: '# Example of good software engineering practices\nclass UserManager:\n    """Handles user-related operations following SOLID principles"""\n    \n    def __init__(self, database):\n        self._database = database\n    \n    def create_user(self, user_data):\n        """Create a new user with validation"""\n        if not self._validate_user_data(user_data):\n            raise ValueError("Invalid user data")\n        \n        return self._database.save_user(user_data)\n    \n    def _validate_user_data(self, user_data):\n        """Private method for user data validation"""\n        required_fields = [\'name\', \'email\', \'password\']\n        return all(field in user_data for field in required_fields)\n\n# Usage with dependency injection\ndatabase = DatabaseConnection()\nuser_manager = UserManager(database)\nuser = user_manager.create_user({\n    \'name\': \'John Doe\',\n    \'email\': \'john@example.com\',\n    \'password\': \'secure123\'\n})',
                    description:
                      "Example showing modularity, encapsulation, and separation of concerns",
                  },
                ],
                quiz: [
                  {
                    question:
                      "Which SDLC phase comes immediately after Requirements Analysis?",
                    options: [
                      "Implementation",
                      "Testing",
                      "System Design",
                      "Deployment",
                    ],
                    correctAnswer: 2,
                    explanation:
                      "System Design follows Requirements Analysis, where the system architecture is planned based on requirements.",
                  },
                ],
              },
            ],
          },
        ],
        isActive: true,
        createdBy: "system",
      },
      // 6. WEB DEVELOPMENT
      {
        id: "web-development",
        title: "Full-Stack Web Development",
        description:
          "Complete guide to modern web development covering frontend, backend, and deployment technologies.",
        difficulty: "beginner" as const,
        duration: "70 hours",
        totalLessons: 42,
        estimatedHours: 70,
        category: "Web Development",
        tags: [
          "html",
          "css",
          "javascript",
          "react",
          "nodejs",
          "mongodb",
          "full-stack",
        ],
        prerequisites: [
          "Basic computer skills",
          "Logical thinking",
          "No prior programming experience required",
        ],
        learningOutcomes: [
          "Build responsive websites using HTML, CSS, and JavaScript",
          "Create dynamic web applications with React",
          "Develop backend APIs using Node.js and Express",
          "Work with databases and implement CRUD operations",
          "Deploy applications to cloud platforms",
        ],
        modules: [
          {
            id: "module-1",
            title: "Frontend Fundamentals",
            description: "HTML, CSS, and JavaScript basics for web development",
            order: 1,
            lessons: [
              {
                id: "lesson-1-1",
                title: "HTML Fundamentals",
                description: "Structure and semantics of web pages",
                content: `# HTML Fundamentals

HTML (HyperText Markup Language) is the standard markup language for creating web pages.

## HTML Structure:
- **Elements**: Building blocks of HTML (tags)
- **Attributes**: Additional information about elements
- **Nesting**: Elements can contain other elements
- **Semantic HTML**: Using meaningful tags for content

## Essential HTML Elements:
- **Document Structure**: html, head, body
- **Text Content**: h1-h6, p, span, div
- **Lists**: ul, ol, li
- **Links**: a (anchor)
- **Images**: img
- **Forms**: form, input, textarea, button
- **Tables**: table, tr, td, th

## HTML5 Semantic Elements:
- **header**: Page or section header
- **nav**: Navigation links
- **main**: Main content area
- **article**: Independent content
- **section**: Thematic grouping
- **aside**: Sidebar content
- **footer**: Page or section footer

## Best Practices:
- Use semantic HTML for better accessibility
- Always include alt text for images
- Proper nesting and indentation
- Validate HTML markup`,
                duration: 45,
                order: 1,
                codeExamples: [
                  {
                    language: "html",
                    code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My First Web Page</title>\n</head>\n<body>\n    <header>\n        <h1>Welcome to My Website</h1>\n        <nav>\n            <ul>\n                <li><a href="#home">Home</a></li>\n                <li><a href="#about">About</a></li>\n                <li><a href="#contact">Contact</a></li>\n            </ul>\n        </nav>\n    </header>\n    \n    <main>\n        <article>\n            <h2>About Web Development</h2>\n            <p>Web development is the process of creating websites and web applications.</p>\n            <img src="web-dev.jpg" alt="Web development illustration">\n        </article>\n    </main>\n    \n    <footer>\n        <p>&copy; 2024 My Website. All rights reserved.</p>\n    </footer>\n</body>\n</html>',
                    description:
                      "Complete HTML5 document structure with semantic elements",
                  },
                ],
                quiz: [
                  {
                    question:
                      "Which HTML5 element is used for the main content area of a page?",
                    options: ["<div>", "<section>", "<main>", "<article>"],
                    correctAnswer: 2,
                    explanation:
                      "The <main> element represents the main content area of a document or application.",
                  },
                ],
              },
            ],
          },
        ],
        isActive: true,
        createdBy: "system",
      },

      // 7. .NET DEVELOPMENT
      {
        id: "dotnet-development",
        title: ".NET Development",
        description:
          "Comprehensive guide to .NET development with C#, ASP.NET Core, and Entity Framework for building modern applications.",
        difficulty: "intermediate" as const,
        duration: "65 hours",
        totalLessons: 38,
        estimatedHours: 65,
        category: "Software Development",
        tags: [
          "csharp",
          "dotnet",
          "aspnet-core",
          "entity-framework",
          "web-api",
          "mvc",
        ],
        prerequisites: [
          "Basic programming knowledge",
          "Understanding of OOP concepts",
          "Familiarity with databases",
        ],
        learningOutcomes: [
          "Master C# programming language and .NET fundamentals",
          "Build web APIs using ASP.NET Core",
          "Implement data access with Entity Framework Core",
          "Create MVC web applications",
          "Deploy .NET applications to cloud platforms",
        ],
        modules: [
          {
            id: "module-1",
            title: "C# Fundamentals",
            description: "Core C# programming concepts and .NET basics",
            order: 1,
            lessons: [
              {
                id: "lesson-1-1",
                title: "Introduction to C# and .NET",
                description:
                  "Getting started with C# programming and .NET ecosystem",
                content: `# Introduction to C# and .NET
C# is a modern, object-oriented programming language developed by Microsoft as part of the .NET ecosystem.
## What is .NET?
- **Platform**: Cross-platform development framework
- **Runtime**: Common Language Runtime (CLR)
- **Libraries**: Base Class Library (BCL)
- **Languages**: C#, F#, VB.NET, and more
## .NET Ecosystem:
1. **.NET Framework**: Windows-only, legacy
2. **.NET Core**: Cross-platform, modern
3. **.NET 5+**: Unified platform (current)

## C# Features:
- **Type Safety**: Strong typing system
- **Memory Management**: Automatic garbage collection
- **Object-Oriented**: Classes, inheritance, polymorphism
- **Modern Syntax**: LINQ, async/await, pattern matching
- **Cross-Platform**: Runs on Windows, macOS, Linux

## Development Tools:
- **Visual Studio**: Full-featured IDE
- **Visual Studio Code**: Lightweight editor
- **JetBrains Rider**: Cross-platform IDE
- **.NET CLI**: Command-line interface

## Basic C# Program Structure:
- **Namespace**: Logical grouping of classes
- **Class**: Blueprint for objects
- **Method**: Function within a class
- **Main Method**: Entry point of application`,
                duration: 50,
                order: 1,
                codeExamples: [
                  {
                    language: "csharp",
                    code: 'using System;\n\nnamespace HelloWorld\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Console.WriteLine("Hello, World!");\n            \n            // Variables and data types\n            string name = "John";\n            int age = 25;\n            double salary = 50000.50;\n            bool isEmployed = true;\n            \n            // String interpolation\n            Console.WriteLine($"Name: {name}, Age: {age}");\n            \n            // Conditional statements\n            if (age >= 18)\n            {\n                Console.WriteLine("You are an adult.");\n            }\n            \n            // Loops\n            for (int i = 1; i <= 5; i++)\n            {\n                Console.WriteLine($"Count: {i}");\n            }\n        }\n    }\n}',
                    description:
                      "Basic C# program demonstrating variables, conditionals, and loops",
                  },
                  {
                    language: "csharp",
                    code: '// Object-oriented programming example\npublic class Person\n{\n    // Properties\n    public string Name { get; set; }\n    public int Age { get; set; }\n    \n    // Constructor\n    public Person(string name, int age)\n    {\n        Name = name;\n        Age = age;\n    }\n    \n    // Method\n    public void Introduce()\n    {\n        Console.WriteLine($"Hi, I\'m {Name} and I\'m {Age} years old.");\n    }\n}\n\n// Usage\nclass Program\n{\n    static void Main()\n    {\n        Person person = new Person("Alice", 30);\n        person.Introduce();\n    }\n}',
                    description:
                      "C# class definition with properties, constructor, and methods",
                  },
                ],
                quiz: [
                  {
                    question:
                      "What is the entry point method in a C# console application?",
                    options: ["Start()", "Main()", "Begin()", "Execute()"],
                    correctAnswer: 1,
                    explanation:
                      "The Main() method is the entry point for C# console applications where program execution begins.",
                  },
                ],
              },
              {
                id: "lesson-1-2",
                title: "C# Program Structure & Syntax",
                description:
                  "Understanding how a C# program is organized and written",
                content: `# C# Program Structure & Syntax

Every C# application follows a well-defined structure that helps the compiler understand how to execute the program.

## Key Components of a C# Program

### 1. Using Directives
- Import namespaces
- Allow access to predefined classes and methods

Example:
\`using System;\`

### 2. Namespace
- Logical grouping of related classes
- Prevents naming conflicts

### 3. Class
- Blueprint of objects
- Contains methods and variables

### 4. Main Method
- Entry point of execution
- Program starts here

## Syntax Rules
- Statements end with semicolon (;)
- Code blocks use curly braces {}
- C# is case-sensitive

## Compilation Flow
Source Code → Compiler → MSIL → CLR → Execution`,
                duration: 45,
                order: 2,
                codeExamples: [
                  {
                    language: "csharp",
                    code: 'using System;\n\nnamespace DemoApp\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Console.WriteLine("C# Program Structure");\n        }\n    }\n}',
                    description: "Basic structure of a C# console application",
                  },
                ],
                quiz: [
                  {
                    question:
                      "Which method is mandatory in a C# console program?",
                    options: ["Start()", "Run()", "Main()", "Init()"],
                    correctAnswer: 2,
                    explanation:
                      "Main() is the entry point where execution begins.",
                  },
                ],
              },
              {
                id: "lesson-1-3",
                title: "Variables, Data Types & Type Safety",
                description: "Learn how data is stored and managed in C#",
                content: `# Variables, Data Types & Type Safety

C# is a **strongly typed language**, meaning every variable must have a defined data type.

## Common Data Types

### Value Types
- int
- float
- double
- char
- bool

### Reference Types
- string
- array
- class
- object

## Variable Declaration
Syntax:
\`datatype variableName = value;\`

## Type Safety
- Prevents assigning incorrect data
- Errors caught at compile-time

## Type Conversion
- Implicit conversion (safe)
- Explicit casting (manual)

Example:
\`int x = (int)3.14;\``,
                duration: 55,
                order: 3,
                codeExamples: [
                  {
                    language: "csharp",
                    code: "int age = 21;\ndouble marks = 85.6;\nchar grade = 'A';\nbool isPassed = true;\n\nConsole.WriteLine(age);\nConsole.WriteLine(marks);",
                    description: "Declaring and using different data types",
                  },
                ],
                quiz: [
                  {
                    question: "Which of the following is a value type?",
                    options: ["string", "class", "int", "array"],
                    correctAnswer: 2,
                    explanation:
                      "int is a value type stored directly in memory.",
                  },
                ],
              },
              {
                id: "lesson-1-4",
                title: "Operators & Expressions",
                description: "Perform operations and build expressions in C#",
                content: `# Operators & Expressions

Operators are symbols used to perform operations on variables and values.

## Types of Operators

### Arithmetic
- +, -, *, /, %

### Relational
- ==, !=, >, <, >=, <=

### Logical
- &&, ||, !

### Assignment
- =, +=, -=

## Expressions
Combination of variables, operators, and values that produce a result.

Example:
\`int result = (a + b) * 2;\``,
                duration: 40,
                order: 4,
                codeExamples: [
                  {
                    language: "csharp",
                    code: "int a = 10;\nint b = 5;\n\nConsole.WriteLine(a + b);\nConsole.WriteLine(a > b);\nConsole.WriteLine(a == b);",
                    description: "Using arithmetic and relational operators",
                  },
                ],
                quiz: [
                  {
                    question: "Which operator is used for logical AND?",
                    options: ["&", "&&", "|", "||"],
                    correctAnswer: 1,
                    explanation: "&& is the logical AND operator in C#.",
                  },
                ],
              },
              {
                id: "lesson-1-5",
                title: "Control Flow Statements",
                description: "Control program execution using conditions",
                content: `# Control Flow Statements

Control flow statements allow decision-making in programs.

## if-else Statement
Used to execute code based on a condition.

## switch Statement
Used when multiple conditions depend on a single variable.

## Comparison Rules
- Conditions must evaluate to boolean
- Supports nested logic`,
                duration: 50,
                order: 5,
                codeExamples: [
                  {
                    language: "csharp",
                    code: 'int num = 10;\n\nif (num % 2 == 0)\n{\n    Console.WriteLine("Even Number");\n}\nelse\n{\n    Console.WriteLine("Odd Number");\n}',
                    description: "Using if-else condition",
                  },
                  {
                    language: "csharp",
                    code: 'int day = 2;\n\nswitch (day)\n{\n    case 1: Console.WriteLine("Monday"); break;\n    case 2: Console.WriteLine("Tuesday"); break;\n    default: Console.WriteLine("Invalid Day"); break;\n}',
                    description: "Using switch statement",
                  },
                ],
                quiz: [
                  {
                    question:
                      "Which statement is best for multiple fixed conditions?",
                    options: ["if", "for", "switch", "while"],
                    correctAnswer: 2,
                    explanation:
                      "switch is cleaner and more readable for fixed conditions.",
                  },
                ],
              },
              {
                id: "lesson-1-6",
                title: "Loops in C#",
                description: "Repeat execution using looping statements",
                content: `# Loops in C#

Loops are used to execute a block of code repeatedly.

## Types of Loops

### for Loop
Used when number of iterations is known.

### while Loop
Condition checked before execution.

### do-while Loop
Executes at least once.

## Loop Control
- break
- continue`,
                duration: 45,
                order: 6,
                codeExamples: [
                  {
                    language: "csharp",
                    code: "for (int i = 1; i <= 5; i++)\n{\n    Console.WriteLine(i);\n}",
                    description: "for loop example",
                  },
                  {
                    language: "csharp",
                    code: "int i = 1;\nwhile (i <= 3)\n{\n    Console.WriteLine(i);\n    i++;\n}",
                    description: "while loop example",
                  },
                ],
                quiz: [
                  {
                    question: "Which loop executes at least once?",
                    options: ["for", "while", "do-while", "foreach"],
                    correctAnswer: 2,
                    explanation:
                      "do-while executes once before checking condition.",
                  },
                ],
              },
            ],
          },
        ],
        isActive: true,
        createdBy: "system",
      },
    ];

    // Calculate totalLessons dynamically for each course before insertion
    const coursesWithCorrectTotals = engineeringCoursesData.map(course => {
      const actualTotalLessons = course.modules.reduce(
        (total, module) => total + module.lessons.length,
        0,
      );
      return {
        ...course,
        totalLessons: actualTotalLessons
      };
    });

    // Insert all courses
    const insertedCourses = await EngineeringCourse.insertMany(
      coursesWithCorrectTotals,
    );
    console.log(
      `✅ Successfully seeded ${insertedCourses.length} engineering courses`,
    );

    // Log summary
    insertedCourses.forEach((course) => {
      const totalLessons = course.modules.reduce(
        (total, module) => total + module.lessons.length,
        0,
      );
      console.log(
        `   📚 ${course.title}: ${course.modules.length} modules, ${totalLessons} lessons`,
      );
    });

    return insertedCourses;
  } catch (error) {
    console.error("❌ Error seeding engineering courses:", error);
    throw error;
  }
};
