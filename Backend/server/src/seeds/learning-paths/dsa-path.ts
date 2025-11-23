import { Course } from '../../models/Course';

export const dsaPathData = {
  title: 'Data Structures & Algorithms',
  description: 'Comprehensive guide to DSA concepts, problem-solving techniques, and coding interview preparation. Master the fundamentals that every programmer needs.',
  icon: '🧠',
  difficulty: 'intermediate' as const,
  estimatedDuration: 80,
  prerequisites: ['Basic programming knowledge', 'Mathematical thinking', 'Understanding of variables and loops'],
  tags: ['algorithms', 'data-structures', 'problem-solving', 'interviews', 'coding', 'dsa'],
  isPublic: true,
  enrollmentCount: 2156,
  completionRate: 65,
  averageRating: 4.8,
  totalRatings: 1543
};

export const dsaCourses = [
  {
    courseTitle: 'Arrays and Strings Fundamentals',
    slug: 'arrays-strings-fundamentals',
    modules: [
      {
        title: 'Introduction to Arrays',
        topics: [
          {
            title: 'Array Basics',
            subtopics: [
              {
                id: 'array-intro',
                title: 'What are Arrays?',
                videoUrl: 'https://www.youtube.com/embed/QJNwK2uJyGs',
                content: `<h2>Understanding Arrays</h2>
                <p>An array is a fundamental data structure that stores elements of the same type in contiguous memory locations. Arrays provide constant-time O(1) access to elements using their index.</p>
                
                <h3>Key Characteristics:</h3>
                <ul>
                  <li><strong>Fixed Size:</strong> In most languages, arrays have a fixed size determined at creation</li>
                  <li><strong>Contiguous Memory:</strong> Elements are stored in adjacent memory locations</li>
                  <li><strong>Index-Based Access:</strong> Elements can be accessed directly using their index (0-based)</li>
                  <li><strong>Same Data Type:</strong> All elements must be of the same type</li>
                </ul>
                
                <h3>Time Complexity:</h3>
                <ul>
                  <li>Access: O(1)</li>
                  <li>Search: O(n)</li>
                  <li>Insertion: O(n)</li>
                  <li>Deletion: O(n)</li>
                </ul>`,
                duration: 15,
                codeExamples: [
                  {
                    language: 'javascript',
                    code: `// Creating arrays in JavaScript
const numbers = [1, 2, 3, 4, 5];
const fruits = ['apple', 'banana', 'orange'];

// Accessing elements
console.log(numbers[0]); // 1
console.log(fruits[2]);  // 'orange'

// Array length
console.log(numbers.length); // 5

// Modifying elements
numbers[0] = 10;
console.log(numbers); // [10, 2, 3, 4, 5]`,
                    description: 'Basic array operations in JavaScript'
                  },
                  {
                    language: 'python',
                    code: `# Creating arrays (lists) in Python
numbers = [1, 2, 3, 4, 5]
fruits = ['apple', 'banana', 'orange']

# Accessing elements
print(numbers[0])  # 1
print(fruits[2])   # 'orange'

# Array length
print(len(numbers))  # 5

# Modifying elements
numbers[0] = 10
print(numbers)  # [10, 2, 3, 4, 5]`,
                    description: 'Basic array operations in Python'
                  }
                ],
                quiz: [
                  {
                    question: 'What is the time complexity of accessing an element in an array by index?',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                    correctAnswer: 0
                  },
                  {
                    question: 'In a 0-indexed array of size 5, what is the index of the last element?',
                    options: ['5', '4', '3', '6'],
                    correctAnswer: 1
                  },
                  {
                    question: 'Which of the following is NOT a characteristic of arrays?',
                    options: [
                      'Elements are stored in contiguous memory',
                      'Dynamic size that grows automatically',
                      'Constant time access by index',
                      'All elements must be of the same type'
                    ],
                    correctAnswer: 1
                  },
                  {
                    question: 'What is the time complexity of searching for an element in an unsorted array?',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                    correctAnswer: 2
                  }
                ]
              },
              {
                id: 'array-quiz-1',
                title: 'Arrays Fundamentals Quiz',
                content: `<h2>Test Your Knowledge</h2>
                <p>Let's test what you've learned about arrays! This quiz covers the fundamental concepts of arrays including time complexity, indexing, and basic operations.</p>`,
                duration: 10,
                quiz: [
                  {
                    question: 'If an array has 10 elements, what is the valid index range?',
                    options: ['1 to 10', '0 to 9', '1 to 9', '0 to 10'],
                    correctAnswer: 1
                  },
                  {
                    question: 'What happens when you try to access an index that is out of bounds?',
                    options: [
                      'The array automatically expands',
                      'It returns null or undefined',
                      'It causes an error or exception',
                      'It returns the first element'
                    ],
                    correctAnswer: 2
                  },
                  {
                    question: 'Which operation is most efficient in an array?',
                    options: [
                      'Inserting at the beginning',
                      'Deleting from the middle',
                      'Accessing by index',
                      'Searching for an element'
                    ],
                    correctAnswer: 2
                  },
                  {
                    question: 'In which scenario would you prefer an array over other data structures?',
                    options: [
                      'When you need frequent insertions at the beginning',
                      'When you need random access to elements',
                      'When the size changes frequently',
                      'When you need to store different data types'
                    ],
                    correctAnswer: 1
                  },
                  {
                    question: 'What is the space complexity of an array with n elements?',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                    correctAnswer: 2
                  }
                ]
              },
              {
                id: 'array-operations',
                title: 'Common Array Operations',
                content: `<h2>Essential Array Operations</h2>
                <p>Understanding common array operations is crucial for solving programming problems efficiently.</p>
                
                <h3>1. Traversal</h3>
                <p>Visiting each element in the array sequentially.</p>
                
                <h3>2. Insertion</h3>
                <p>Adding elements at the beginning, middle, or end of an array.</p>
                
                <h3>3. Deletion</h3>
                <p>Removing elements from specific positions.</p>
                
                <h3>4. Searching</h3>
                <p>Finding elements in the array (linear or binary search).</p>
                
                <h3>5. Sorting</h3>
                <p>Arranging elements in ascending or descending order.</p>`,
                duration: 20,
                codeExamples: [
                  {
                    language: 'javascript',
                    code: `// Traversal
const arr = [1, 2, 3, 4, 5];
arr.forEach(num => console.log(num));

// Insertion
arr.push(6);        // Add to end
arr.unshift(0);     // Add to beginning
arr.splice(3, 0, 2.5); // Insert at index 3

// Deletion
arr.pop();          // Remove from end
arr.shift();        // Remove from beginning
arr.splice(2, 1);   // Remove at index 2

// Searching
const index = arr.indexOf(4);
const found = arr.find(num => num > 3);

// Sorting
arr.sort((a, b) => a - b); // Ascending
arr.sort((a, b) => b - a); // Descending`,
                    description: 'Common array operations'
                  }
                ]
              },
              {
                id: 'two-pointer-technique',
                title: 'Two Pointer Technique',
                videoUrl: 'https://www.youtube.com/embed/-gjxg6Pln50',
                content: `<h2>Two Pointer Technique</h2>
                <p>The two-pointer technique is a powerful approach for solving array problems efficiently. It uses two pointers to traverse the array from different positions.</p>
                
                <h3>Common Use Cases:</h3>
                <ul>
                  <li>Finding pairs with a target sum in sorted arrays</li>
                  <li>Removing duplicates from sorted arrays</li>
                  <li>Reversing arrays</li>
                  <li>Partitioning arrays</li>
                  <li>Merging sorted arrays</li>
                </ul>
                
                <h3>Types of Two Pointer:</h3>
                <ol>
                  <li><strong>Opposite Direction:</strong> One pointer starts from beginning, other from end</li>
                  <li><strong>Same Direction:</strong> Both pointers move in the same direction at different speeds</li>
                </ol>`,
                duration: 25,
                codeExamples: [
                  {
                    language: 'javascript',
                    code: `// Two Sum Problem (Sorted Array)
function twoSum(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        const sum = arr[left] + arr[right];
        
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [-1, -1];
}

// Example
const nums = [1, 2, 3, 4, 6];
console.log(twoSum(nums, 6)); // [1, 3]`,
                    description: 'Two pointer technique for finding pairs'
                  },
                  {
                    language: 'javascript',
                    code: `// Remove Duplicates from Sorted Array
function removeDuplicates(arr) {
    if (arr.length === 0) return 0;
    
    let slow = 0;
    
    for (let fast = 1; fast < arr.length; fast++) {
        if (arr[fast] !== arr[slow]) {
            slow++;
            arr[slow] = arr[fast];
        }
    }
    
    return slow + 1;
}

// Example
const nums = [1, 1, 2, 2, 3, 4, 4];
const length = removeDuplicates(nums);
console.log(nums.slice(0, length)); // [1, 2, 3, 4]`,
                    description: 'Removing duplicates using two pointers'
                  }
                ],
                quiz: [
                  {
                    question: 'What is the time complexity of the two-pointer technique for finding a pair with target sum in a sorted array?',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                    correctAnswer: 2
                  },
                  {
                    question: 'In the opposite direction two-pointer technique, where do the pointers start?',
                    options: [
                      'Both at the beginning',
                      'Both at the end',
                      'One at beginning, one at end',
                      'One at middle, one at end'
                    ],
                    correctAnswer: 2
                  },
                  {
                    question: 'Which problem is best solved using the two-pointer technique?',
                    options: [
                      'Finding the maximum element',
                      'Sorting an array',
                      'Finding two numbers that sum to a target',
                      'Calculating array length'
                    ],
                    correctAnswer: 2
                  }
                ]
              },
              {
                id: 'two-pointer-quiz',
                title: 'Two Pointer Technique Quiz',
                content: `<h2>Master the Two Pointer Technique</h2>
                <p>Test your understanding of the two-pointer technique and its applications.</p>`,
                duration: 10,
                quiz: [
                  {
                    question: 'What is the advantage of using two pointers over nested loops?',
                    options: [
                      'Uses less memory',
                      'Reduces time complexity from O(n²) to O(n)',
                      'Makes code shorter',
                      'Works with unsorted arrays'
                    ],
                    correctAnswer: 1
                  },
                  {
                    question: 'For removing duplicates from a sorted array, which type of two-pointer is used?',
                    options: [
                      'Opposite direction',
                      'Same direction (slow and fast)',
                      'Random pointers',
                      'Three pointers'
                    ],
                    correctAnswer: 1
                  },
                  {
                    question: 'In a sorted array [1,2,3,4,6], using two pointers to find sum=6, what would be the answer?',
                    options: [
                      'Indices [0,4]',
                      'Indices [1,3]',
                      'Indices [0,3]',
                      'No solution'
                    ],
                    correctAnswer: 1
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'String Manipulation',
        topics: [
          {
            title: 'String Fundamentals',
            subtopics: [
              {
                id: 'string-basics',
                title: 'Understanding Strings',
                content: `<h2>String Data Structure</h2>
                <p>Strings are sequences of characters. In most programming languages, strings are immutable, meaning they cannot be changed after creation.</p>
                
                <h3>Key Properties:</h3>
                <ul>
                  <li><strong>Immutability:</strong> Strings cannot be modified in place (in most languages)</li>
                  <li><strong>Character Access:</strong> Individual characters can be accessed by index</li>
                  <li><strong>Length:</strong> Strings have a length property</li>
                  <li><strong>Concatenation:</strong> Strings can be combined</li>
                </ul>
                
                <h3>Common Operations:</h3>
                <ul>
                  <li>Substring extraction</li>
                  <li>String reversal</li>
                  <li>Pattern matching</li>
                  <li>Character frequency counting</li>
                </ul>`,
                duration: 15,
                codeExamples: [
                  {
                    language: 'javascript',
                    code: `// String operations
const str = "Hello World";

// Access characters
console.log(str[0]);        // 'H'
console.log(str.charAt(6)); // 'W'

// Length
console.log(str.length);    // 11

// Substring
console.log(str.substring(0, 5));  // 'Hello'
console.log(str.slice(6));         // 'World'

// Case conversion
console.log(str.toLowerCase());    // 'hello world'
console.log(str.toUpperCase());    // 'HELLO WORLD'

// Split and join
const words = str.split(' ');      // ['Hello', 'World']
const joined = words.join('-');    // 'Hello-World'`,
                    description: 'Basic string operations'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Linked Lists and Stacks',
    slug: 'linked-lists-stacks',
    modules: [
      {
        title: 'Linked Lists',
        topics: [
          {
            title: 'Singly Linked Lists',
            subtopics: [
              {
                id: 'linked-list-intro',
                title: 'Introduction to Linked Lists',
                videoUrl: 'https://www.youtube.com/embed/R9PTBwOzceo',
                content: `<h2>Linked List Data Structure</h2>
                <p>A linked list is a linear data structure where elements are stored in nodes. Each node contains data and a reference (pointer) to the next node.</p>
                
                <h3>Advantages over Arrays:</h3>
                <ul>
                  <li>Dynamic size - can grow or shrink at runtime</li>
                  <li>Efficient insertion/deletion at beginning - O(1)</li>
                  <li>No memory wastage</li>
                </ul>
                
                <h3>Disadvantages:</h3>
                <ul>
                  <li>No random access - must traverse from head</li>
                  <li>Extra memory for storing pointers</li>
                  <li>Not cache-friendly</li>
                </ul>
                
                <h3>Time Complexity:</h3>
                <ul>
                  <li>Access: O(n)</li>
                  <li>Search: O(n)</li>
                  <li>Insertion at beginning: O(1)</li>
                  <li>Deletion at beginning: O(1)</li>
                </ul>`,
                duration: 20,
                codeExamples: [
                  {
                    language: 'javascript',
                    code: `// Node class
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

// LinkedList class
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Add node at beginning
    prepend(data) {
        const newNode = new Node(data);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    
    // Add node at end
    append(data) {
        const newNode = new Node(data);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    // Print list
    print() {
        let current = this.head;
        const values = [];
        while (current) {
            values.push(current.data);
            current = current.next;
        }
        console.log(values.join(' -> '));
    }
}

// Usage
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.print(); // 1 -> 2 -> 3`,
                    description: 'Linked list implementation'
                  }
                ],
                quiz: [
                  {
                    question: 'What is the time complexity of inserting a node at the beginning of a linked list?',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                    correctAnswer: 0
                  },
                  {
                    question: 'What does each node in a singly linked list contain?',
                    options: [
                      'Only data',
                      'Data and a pointer to the next node',
                      'Data and pointers to both next and previous nodes',
                      'Only a pointer'
                    ],
                    correctAnswer: 1
                  },
                  {
                    question: 'What is the main disadvantage of linked lists compared to arrays?',
                    options: [
                      'Fixed size',
                      'No random access',
                      'Cannot store different data types',
                      'Slower insertion'
                    ],
                    correctAnswer: 1
                  }
                ]
              },
              {
                id: 'linked-list-quiz',
                title: 'Linked Lists Quiz',
                content: `<h2>Test Your Linked List Knowledge</h2>
                <p>Evaluate your understanding of linked list concepts and operations.</p>`,
                duration: 10,
                quiz: [
                  {
                    question: 'To access the 5th element in a linked list, what must you do?',
                    options: [
                      'Use index 5 directly',
                      'Traverse from head through 4 nodes',
                      'Use a hash table',
                      'Start from the tail'
                    ],
                    correctAnswer: 1
                  },
                  {
                    question: 'What happens if you lose the reference to the head of a linked list?',
                    options: [
                      'Nothing, you can still access all nodes',
                      'You lose access to the entire list',
                      'Only the first node is lost',
                      'The list automatically reorganizes'
                    ],
                    correctAnswer: 1
                  },
                  {
                    question: 'Which operation is more efficient in a linked list than in an array?',
                    options: [
                      'Random access',
                      'Insertion at the beginning',
                      'Binary search',
                      'Accessing the last element'
                    ],
                    correctAnswer: 1
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Trees and Graphs',
    slug: 'trees-graphs',
    modules: [
      {
        title: 'Binary Trees',
        topics: [
          {
            title: 'Tree Fundamentals',
            subtopics: [
              {
                id: 'tree-intro',
                title: 'Introduction to Trees',
                videoUrl: 'https://www.youtube.com/embed/qH6yxkw0u78',
                content: `<h2>Tree Data Structure</h2>
                <p>A tree is a hierarchical data structure consisting of nodes connected by edges. It's a non-linear data structure used to represent hierarchical relationships.</p>
                
                <h3>Tree Terminology:</h3>
                <ul>
                  <li><strong>Root:</strong> The topmost node</li>
                  <li><strong>Parent:</strong> Node with children</li>
                  <li><strong>Child:</strong> Node connected to parent</li>
                  <li><strong>Leaf:</strong> Node with no children</li>
                  <li><strong>Height:</strong> Longest path from root to leaf</li>
                  <li><strong>Depth:</strong> Distance from root to node</li>
                </ul>
                
                <h3>Binary Tree:</h3>
                <p>A tree where each node has at most two children (left and right).</p>`,
                duration: 25,
                codeExamples: [
                  {
                    language: 'javascript',
                    code: `// TreeNode class
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Binary Tree class
class BinaryTree {
    constructor() {
        this.root = null;
    }
    
    // Inorder traversal (Left, Root, Right)
    inorder(node = this.root) {
        if (node) {
            this.inorder(node.left);
            console.log(node.value);
            this.inorder(node.right);
        }
    }
    
    // Preorder traversal (Root, Left, Right)
    preorder(node = this.root) {
        if (node) {
            console.log(node.value);
            this.preorder(node.left);
            this.preorder(node.right);
        }
    }
    
    // Postorder traversal (Left, Right, Root)
    postorder(node = this.root) {
        if (node) {
            this.postorder(node.left);
            this.postorder(node.right);
            console.log(node.value);
        }
    }
}

// Usage
const tree = new BinaryTree();
tree.root = new TreeNode(1);
tree.root.left = new TreeNode(2);
tree.root.right = new TreeNode(3);
tree.root.left.left = new TreeNode(4);
tree.root.left.right = new TreeNode(5);

console.log("Inorder:");
tree.inorder();  // 4 2 5 1 3`,
                    description: 'Binary tree implementation with traversals'
                  }
                ],
                quiz: [
                  {
                    question: 'What is a leaf node in a tree?',
                    options: [
                      'The root node',
                      'A node with no children',
                      'A node with one child',
                      'The parent node'
                    ],
                    correctAnswer: 1
                  },
                  {
                    question: 'In a binary tree, how many children can each node have at most?',
                    options: ['1', '2', '3', 'Unlimited'],
                    correctAnswer: 1
                  },
                  {
                    question: 'Which traversal visits nodes in the order: Left, Root, Right?',
                    options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
                    correctAnswer: 1
                  }
                ]
              },
              {
                id: 'tree-quiz',
                title: 'Binary Trees Quiz',
                content: `<h2>Test Your Tree Knowledge</h2>
                <p>Assess your understanding of tree data structures and traversals.</p>`,
                duration: 10,
                quiz: [
                  {
                    question: 'What is the height of a tree with only one node (the root)?',
                    options: ['0', '1', '2', 'Undefined'],
                    correctAnswer: 0
                  },
                  {
                    question: 'Which traversal is used to create a copy of a tree?',
                    options: ['Inorder', 'Preorder', 'Postorder', 'Any traversal'],
                    correctAnswer: 1
                  },
                  {
                    question: 'In which traversal do we visit the root node last?',
                    options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
                    correctAnswer: 2
                  },
                  {
                    question: 'What is the maximum number of nodes at level 3 in a binary tree?',
                    options: ['3', '4', '7', '8'],
                    correctAnswer: 3
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const dsaMilestones = [
  {
    title: 'Basic Data Structures',
    description: 'Master Arrays, Strings, and fundamental operations',
    order: 1
  },
  {
    title: 'Linear Structures',
    description: 'Learn Linked Lists, Stacks, and Queues',
    order: 2
  },
  {
    title: 'Non-Linear Structures',
    description: 'Understand Trees, Graphs, and their applications',
    order: 3
  },
  {
    title: 'Algorithm Mastery',
    description: 'Master Sorting, Searching, and Dynamic Programming',
    order: 4
  }
];
