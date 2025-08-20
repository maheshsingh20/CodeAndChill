import mongoose, { Schema, Document, Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

/* =========================
   Models (Subject, Quiz, Result)
   ========================= */

interface ISubject extends Document {
  name: string;
  slug: string;
  description: string;
}

const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, unique: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
});

const Subject = mongoose.model<ISubject>("Subject", SubjectSchema);

interface IOption {
  text: string;
  isCorrect: boolean;
}

interface IQuestion {
  questionText: string;
  options: IOption[];
  explanation?: string;
}

interface IQuiz extends Document {
  title: string;
  slug: string;
  subject: Types.ObjectId; // ref Subject
  questions: IQuestion[];
}

const OptionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: {
    type: [OptionSchema],
    validate: [
      (opts: IOption[]) => opts.length >= 2,
      "Each question must have at least 2 options.",
    ],
  },
  explanation: { type: String },
});

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
    index: true,
  },
  questions: {
    type: [QuestionSchema],
    validate: [
      (qs: IQuestion[]) => qs.length >= 1,
      "A quiz must have at least 1 question.",
    ],
  },
});

const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);

interface IResult extends Document {
  user: string;
  quizSlug: string;
  subjectSlug: string;
  score: number;
  total: number;
  answers: { question: string; selected: string; isCorrect: boolean }[];
}

const ResultSchema = new Schema<IResult>({
  user: { type: String, required: true },
  quizSlug: { type: String, required: true, index: true },
  subjectSlug: { type: String, required: true, index: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: [
    {
      question: { type: String, required: true },
      selected: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

const Result = mongoose.model<IResult>("Result", ResultSchema);

/* =========================
   Seed Data
   ========================= */

type SeedQuiz = {
  subjectSlug: string;
  title: string;
  slug: string;
  questions: IQuestion[];
};

const subjectsToSeed: Array<Pick<ISubject, "name" | "slug" | "description">> = [
  {
    name: "JavaScript",
    slug: "javascript",
    description:
      "Test your knowledge of core JS concepts, from variables to advanced asynchronous programming.",
  },
  {
    name: "Python",
    slug: "python",
    description:
      "Challenge yourself with questions on Python syntax, data structures, and popular libraries.",
  },
  {
    name: "Data Structures & Algorithms",
    slug: "dsa",
    description:
      "Assess your understanding of fundamental data structures and algorithmic techniques.",
  },
  {
    name: "Computer Networks",
    slug: "computer-networks",
    description:
      "Explore the layers of the internet, protocols, and how devices communicate.",
  },
];

const quizzesToSeed: SeedQuiz[] = [
  /* ---------- JavaScript ---------- */
  {
    subjectSlug: "javascript",
    title: "Variables & Data Types",
    slug: "js-variables",
    questions: [
      {
        questionText: "Which keyword declares a block-scoped variable?",
        options: [
          { text: "var", isCorrect: false },
          { text: "let", isCorrect: true },
          { text: "function", isCorrect: false },
          { text: "static", isCorrect: false },
        ],
        explanation: "let and const are block-scoped; var is function-scoped.",
      },
      {
        questionText: "What is the result of typeof null?",
        options: [
          { text: "object", isCorrect: true },
          { text: "null", isCorrect: false },
          { text: "undefined", isCorrect: false },
          { text: "number", isCorrect: false },
        ],
        explanation: "A long-standing JS quirk: typeof null === 'object'.",
      },
      {
        questionText: "Which values are falsy?",
        options: [
          { text: "0", isCorrect: false },
          { text: "'' (empty string)", isCorrect: true },
          { text: "[]", isCorrect: false },
          { text: "{}", isCorrect: false },
        ],
        explanation:
          "Falsy: 0, NaN, '', null, undefined, false. Arrays/objects are truthy.",
      },
      {
        questionText: "Template literals are enclosed by which characters?",
        options: [
          { text: "Backticks (``)", isCorrect: true },
          { text: "Single quotes ('')", isCorrect: false },
          { text: 'Double quotes ("")', isCorrect: false },
          { text: "Angle brackets (<>)", isCorrect: false },
        ],
        explanation: "Use backticks for interpolation and multi-line strings.",
      },
      {
        questionText: "Reassigning a const variable is:",
        options: [
          { text: "Allowed", isCorrect: false },
          { text: "Not allowed", isCorrect: true },
          { text: "Allowed only in strict mode", isCorrect: false },
          { text: "Allowed for numbers only", isCorrect: false },
        ],
        explanation: "const bindings cannot be reassigned.",
      },
    ],
  },
  {
    subjectSlug: "javascript",
    title: "Functions & Scope",
    slug: "js-functions-scope",
    questions: [
      {
        questionText: "A function expression example is:",
        options: [
          { text: "function foo() {}", isCorrect: false },
          { text: "const foo = function() {}", isCorrect: true },
          { text: "function = foo() {}", isCorrect: false },
          { text: "func foo() {}", isCorrect: false },
        ],
        explanation:
          "Functions can be assigned to variables (function expressions).",
      },
      {
        questionText: "What best describes a closure?",
        options: [
          { text: "A function calling itself", isCorrect: false },
          { text: "Function + its lexical environment", isCorrect: true },
          { text: "A private class method", isCorrect: false },
          { text: "A synchronous callback", isCorrect: false },
        ],
        explanation:
          "Closures capture variables from the scope in which they were created.",
      },
      {
        questionText: "Arrow functions differ by:",
        options: [
          { text: "Having their own 'this'", isCorrect: false },
          { text: "Lexically binding 'this'", isCorrect: true },
          {
            text: "Being hoisted like function declarations",
            isCorrect: false,
          },
          { text: "Always returning undefined", isCorrect: false },
        ],
        explanation:
          "Arrow functions capture 'this' from the surrounding scope; they are not hoisted like declarations.",
      },
      {
        questionText: "Default parameters are written as:",
        options: [
          { text: "function f(a = 1) {}", isCorrect: true },
          { text: "function f(a : 1) {}", isCorrect: false },
          { text: "function f(a == 1) {}", isCorrect: false },
          { text: "function f(a ?? 1) {}", isCorrect: false },
        ],
        explanation:
          "Use = in parameter list to assign default values if undefined.",
      },
      {
        questionText: "Block scope is created by:",
        options: [
          { text: "if/for/while blocks with let/const", isCorrect: true },
          { text: "function with var", isCorrect: false },
          { text: "try...catch only", isCorrect: false },
          { text: "switch only", isCorrect: false },
        ],
        explanation: "Any {} block + let/const produces block scope.",
      },
    ],
  },
  {
    subjectSlug: "javascript",
    title: "Async & Promises",
    slug: "js-async-promises",
    questions: [
      {
        questionText: "A Promise can be in how many states?",
        options: [
          { text: "Two", isCorrect: false },
          { text: "Three", isCorrect: true },
          { text: "Four", isCorrect: false },
          { text: "One", isCorrect: false },
        ],
        explanation: "pending → fulfilled or rejected.",
      },
      {
        questionText: "Which method handles errors in Promises?",
        options: [
          { text: ".then(onFulfilled, onRejected)", isCorrect: false },
          { text: ".catch()", isCorrect: true },
          { text: ".finally()", isCorrect: false },
          { text: ".error()", isCorrect: false },
        ],
        explanation: "Use .catch for rejections.",
      },
      {
        questionText: "async/await is syntactic sugar over:",
        options: [
          { text: "Generators", isCorrect: false },
          { text: "Promises", isCorrect: true },
          { text: "Callbacks", isCorrect: false },
          { text: "Observables", isCorrect: false },
        ],
        explanation: "It makes Promise-based code look synchronous.",
      },
      {
        questionText: "Promise.all([]) resolves when:",
        options: [
          { text: "Any one resolves", isCorrect: false },
          { text: "All resolve", isCorrect: true },
          { text: "First rejects", isCorrect: false },
          { text: "Timer fires", isCorrect: false },
        ],
        explanation: "It rejects if any input promise rejects.",
      },
      {
        questionText: "await can be used:",
        options: [
          { text: "Only inside async functions", isCorrect: true },
          { text: "Anywhere in JS", isCorrect: false },
          { text: "Only in top-level of modules", isCorrect: false },
          { text: "In constructors", isCorrect: false },
        ],
        explanation:
          "await requires an async function (except top-level await in modules).",
      },
    ],
  },

  /* ---------- Python ---------- */
  {
    subjectSlug: "python",
    title: "Python Basics",
    slug: "py-basics",
    questions: [
      {
        questionText: "Which keyword defines a function?",
        options: [
          { text: "function", isCorrect: false },
          { text: "def", isCorrect: true },
          { text: "fn", isCorrect: false },
          { text: "lambda only", isCorrect: false },
        ],
        explanation:
          "Use 'def' to define functions; 'lambda' defines anonymous functions.",
      },
      {
        questionText: "What does PEP 8 refer to?",
        options: [
          { text: "Style guide for Python code", isCorrect: true },
          { text: "Python compiler", isCorrect: false },
          { text: "Standard library index", isCorrect: false },
          { text: "Package manager", isCorrect: false },
        ],
        explanation: "PEP 8 is Python’s official style guide.",
      },
      {
        questionText: "Which is mutable?",
        options: [
          { text: "tuple", isCorrect: false },
          { text: "list", isCorrect: true },
          { text: "str", isCorrect: false },
          { text: "frozenset", isCorrect: false },
        ],
        explanation:
          "Lists are mutable; tuples/strings/frozensets are immutable.",
      },
      {
        questionText: "Floor division operator is:",
        options: [
          { text: "//", isCorrect: true },
          { text: "/", isCorrect: false },
          { text: "%", isCorrect: false },
          { text: "**", isCorrect: false },
        ],
        explanation: "// performs floor division.",
      },
      {
        questionText: "type([]) returns:",
        options: [
          { text: "<class 'list'>", isCorrect: true },
          { text: "<class 'tuple'>", isCorrect: false },
          { text: "<class 'dict'>", isCorrect: false },
          { text: "<class 'array'>", isCorrect: false },
        ],
        explanation: "[] is a list literal.",
      },
    ],
  },
  {
    subjectSlug: "python",
    title: "Data Structures",
    slug: "py-data-structures",
    questions: [
      {
        questionText: "Best average-time lookup structure?",
        options: [
          { text: "list", isCorrect: false },
          { text: "dict", isCorrect: true },
          { text: "tuple", isCorrect: false },
          { text: "set with duplicates", isCorrect: false },
        ],
        explanation: "dict offers average O(1) lookup by key.",
      },
      {
        questionText: "Set literals use:",
        options: [
          { text: "{}", isCorrect: false },
          { text: "{1, 2, 3}", isCorrect: true },
          { text: "[]", isCorrect: false },
          { text: "()", isCorrect: false },
        ],
        explanation: "Curly braces with elements define a set.",
      },
      {
        questionText: "Which creates a shallow copy of a list 'a'?",
        options: [
          { text: "a2 = a", isCorrect: false },
          { text: "a2 = a[:]", isCorrect: true },
          { text: "a2 = copy.deepcopy(a)", isCorrect: false },
          { text: "a2 = (a)", isCorrect: false },
        ],
        explanation: "Slicing with [:] produces a shallow copy.",
      },
      {
        questionText: "List comprehension format:",
        options: [
          { text: "[x for x in iterable]", isCorrect: true },
          { text: "(x for x in iterable)", isCorrect: false },
          { text: "{x for x in iterable}", isCorrect: false },
          { text: "lambda x: x", isCorrect: false },
        ],
        explanation:
          "Square brackets denote list comps; parentheses → generator.",
      },
      {
        questionText: "dict keys must be:",
        options: [
          { text: "hashable (immutable)", isCorrect: true },
          { text: "lists", isCorrect: false },
          { text: "dicts", isCorrect: false },
          { text: "bytearray", isCorrect: false },
        ],
        explanation: "Keys must be hashable: numbers, strings, tuples, etc.",
      },
    ],
  },
  {
    subjectSlug: "python",
    title: "OOP & Modules",
    slug: "py-oop-modules",
    questions: [
      {
        questionText: "Which creates a class?",
        options: [
          { text: "class MyClass:", isCorrect: true },
          { text: "def class MyClass:", isCorrect: false },
          { text: "new class MyClass:", isCorrect: false },
          { text: "struct MyClass:", isCorrect: false },
        ],
        explanation: "Use 'class' keyword.",
      },
      {
        questionText: "Dunder method for string rep:",
        options: [
          { text: "__init__", isCorrect: false },
          { text: "__repr__", isCorrect: true },
          { text: "__len__", isCorrect: false },
          { text: "__iter__", isCorrect: false },
        ],
        explanation: "__repr__ returns official string representation.",
      },
      {
        questionText: "Import a specific function:",
        options: [
          { text: "import module.function", isCorrect: false },
          { text: "from module import function", isCorrect: true },
          { text: "include module.function", isCorrect: false },
          { text: "using module.function", isCorrect: false },
        ],
        explanation: "Use 'from module import name'.",
      },
      {
        questionText: "Inheritance syntax:",
        options: [
          { text: "class B(A):", isCorrect: true },
          { text: "class B <- A:", isCorrect: false },
          { text: "class B extends A:", isCorrect: false },
          { text: "class B : A {}", isCorrect: false },
        ],
        explanation: "Parent class in parentheses.",
      },
      {
        questionText: "Virtual environment tool:",
        options: [
          { text: "venv", isCorrect: true },
          { text: "npm", isCorrect: false },
          { text: "pipx only", isCorrect: false },
          { text: "cargo", isCorrect: false },
        ],
        explanation: "venv creates isolated Python environments.",
      },
    ],
  },

  /* ---------- DSA ---------- */
  {
    subjectSlug: "dsa",
    title: "Arrays & Strings",
    slug: "dsa-arrays-strings",
    questions: [
      {
        questionText: "Access by index in array is:",
        options: [
          { text: "O(1)", isCorrect: true },
          { text: "O(n)", isCorrect: false },
          { text: "O(log n)", isCorrect: false },
          { text: "O(n log n)", isCorrect: false },
        ],
        explanation: "Direct addressing → constant time.",
      },
      {
        questionText: "Reverse a string efficiently uses:",
        options: [
          { text: "Two-pointer technique", isCorrect: true },
          { text: "Stack only", isCorrect: false },
          { text: "Priority queue", isCorrect: false },
          { text: "DFS", isCorrect: false },
        ],
        explanation: "Two pointers swap from both ends.",
      },
      {
        questionText: "Find first non-repeating char:",
        options: [
          { text: "Hash map (counts)", isCorrect: true },
          { text: "Binary search", isCorrect: false },
          { text: "Union-Find", isCorrect: false },
          { text: "Topological sort", isCorrect: false },
        ],
        explanation: "Count chars then scan string.",
      },
      {
        questionText: "Kadane’s algorithm solves:",
        options: [
          { text: "Maximum subarray sum", isCorrect: true },
          { text: "Longest common subsequence", isCorrect: false },
          { text: "Shortest path", isCorrect: false },
          { text: "Matrix multiplication", isCorrect: false },
        ],
        explanation: "Linear-time DP for max subarray.",
      },
      {
        questionText: "Anagram check uses:",
        options: [
          { text: "Sorted strings equality", isCorrect: true },
          { text: "BFS", isCorrect: false },
          { text: "Binary heap", isCorrect: false },
          { text: "Segment tree", isCorrect: false },
        ],
        explanation: "Sorting or counting arrays match.",
      },
    ],
  },
  {
    subjectSlug: "dsa",
    title: "Sorting & Searching",
    slug: "dsa-sorting-searching",
    questions: [
      {
        questionText: "Time complexity of Merge Sort:",
        options: [
          { text: "O(n log n)", isCorrect: true },
          { text: "O(n^2)", isCorrect: false },
          { text: "O(log n)", isCorrect: false },
          { text: "O(n)", isCorrect: false },
        ],
        explanation: "Divide and conquer with merges.",
      },
      {
        questionText: "Binary search requires:",
        options: [
          { text: "Sorted array", isCorrect: true },
          { text: "Graph", isCorrect: false },
          { text: "Queue", isCorrect: false },
          { text: "Trie", isCorrect: false },
        ],
        explanation: "Binary search works only on sorted sequences.",
      },
      {
        questionText: "Best-case of Quick Sort:",
        options: [
          { text: "O(n log n)", isCorrect: true },
          { text: "O(n^2)", isCorrect: false },
          { text: "O(n)", isCorrect: false },
          { text: "O(log n)", isCorrect: false },
        ],
        explanation: "Balanced partitions lead to n log n.",
      },
      {
        questionText: "Stable sorting algorithm:",
        options: [
          { text: "Merge Sort", isCorrect: true },
          { text: "Quick Sort (in-place)", isCorrect: false },
          { text: "Heap Sort", isCorrect: false },
          { text: "Selection Sort", isCorrect: false },
        ],
        explanation: "Merge sort preserves equal-key order.",
      },
      {
        questionText: "Interpolation search works best on:",
        options: [
          { text: "Uniformly distributed data", isCorrect: true },
          { text: "Random distribution", isCorrect: false },
          { text: "Graphs only", isCorrect: false },
          { text: "Strings only", isCorrect: false },
        ],
        explanation: "It estimates position by values.",
      },
    ],
  },
  {
    subjectSlug: "dsa",
    title: "Dynamic Programming",
    slug: "dsa-dp",
    questions: [
      {
        questionText: "DP relies on:",
        options: [
          {
            text: "Optimal substructure & overlapping subproblems",
            isCorrect: true,
          },
          { text: "Randomization", isCorrect: false },
          { text: "Greedy choice property only", isCorrect: false },
          { text: "Backtracking only", isCorrect: false },
        ],
        explanation: "DP memoizes/iterates subproblem solutions.",
      },
      {
        questionText: "Fibonacci DP base:",
        options: [
          { text: "dp[0]=0, dp[1]=1", isCorrect: true },
          { text: "dp[0]=1, dp[1]=1", isCorrect: false },
          { text: "dp[1]=0, dp[2]=1", isCorrect: false },
          { text: "No base needed", isCorrect: false },
        ],
        explanation: "Classic DP initialization.",
      },
      {
        questionText: "Knapsack 0/1 typical complexity:",
        options: [
          { text: "O(nW)", isCorrect: true },
          { text: "O(n log n)", isCorrect: false },
          { text: "O(W^n)", isCorrect: false },
          { text: "O(W)", isCorrect: false },
        ],
        explanation: "n items, capacity W dynamic program.",
      },
      {
        questionText: "LCS stands for:",
        options: [
          { text: "Longest Common Subsequence", isCorrect: true },
          { text: "Least Common Substring", isCorrect: false },
          { text: "Largest Common Set", isCorrect: false },
          { text: "Linear Combination Sum", isCorrect: false },
        ],
        explanation: "LCS via 2D DP table.",
      },
      {
        questionText: "Coin change (min coins) approach:",
        options: [
          { text: "Bottom-up DP", isCorrect: true },
          { text: "Only greedy always", isCorrect: false },
          { text: "DFS only", isCorrect: false },
          { text: "Bitmasking only", isCorrect: false },
        ],
        explanation: "Greedy fails for some coin systems; DP works.",
      },
    ],
  },

  /* ---------- Computer Networks ---------- */
  {
    subjectSlug: "computer-networks",
    title: "Network Layers",
    slug: "cn-layers",
    questions: [
      {
        questionText: "OSI has how many layers?",
        options: [
          { text: "7", isCorrect: true },
          { text: "5", isCorrect: false },
          { text: "4", isCorrect: false },
          { text: "8", isCorrect: false },
        ],
        explanation: "Physical → Application (7 layers).",
      },
      {
        questionText: "Routing occurs at which layer?",
        options: [
          { text: "Network", isCorrect: true },
          { text: "Data Link", isCorrect: false },
          { text: "Transport", isCorrect: false },
          { text: "Session", isCorrect: false },
        ],
        explanation: "Routers operate at the Network layer.",
      },
      {
        questionText: "MAC addresses live at:",
        options: [
          { text: "Data Link", isCorrect: true },
          { text: "Network", isCorrect: false },
          { text: "Transport", isCorrect: false },
          { text: "Application", isCorrect: false },
        ],
        explanation: "L2 addressing with MACs.",
      },
      {
        questionText: "Switches primarily operate at:",
        options: [
          { text: "Layer 2", isCorrect: true },
          { text: "Layer 3", isCorrect: false },
          { text: "Layer 1", isCorrect: false },
          { text: "Layer 4", isCorrect: false },
        ],
        explanation: "Switches are Data Link devices (with L3 variants).",
      },
      {
        questionText: "Encapsulation adds:",
        options: [
          { text: "Headers (and sometimes trailers)", isCorrect: true },
          { text: "Only payload", isCorrect: false },
          { text: "Only trailers", isCorrect: false },
          { text: "No metadata", isCorrect: false },
        ],
        explanation: "Each layer encapsulates with its own header.",
      },
    ],
  },
  {
    subjectSlug: "computer-networks",
    title: "TCP/IP & Protocols",
    slug: "cn-tcp-ip",
    questions: [
      {
        questionText: "HTTP typically uses which transport protocol?",
        options: [
          { text: "TCP", isCorrect: true },
          { text: "UDP", isCorrect: false },
          { text: "ICMP", isCorrect: false },
          { text: "ARP", isCorrect: false },
        ],
        explanation: "HTTP relies on reliable TCP.",
      },
      {
        questionText: "DNS over UDP default port:",
        options: [
          { text: "53", isCorrect: true },
          { text: "80", isCorrect: false },
          { text: "443", isCorrect: false },
          { text: "25", isCorrect: false },
        ],
        explanation: "UDP/53; TCP for zone transfers.",
      },
      {
        questionText: "ICMP is used for:",
        options: [
          { text: "Error reporting & diagnostics", isCorrect: true },
          { text: "File transfer", isCorrect: false },
          { text: "Email", isCorrect: false },
          { text: "DNS name resolution", isCorrect: false },
        ],
        explanation: "ping/traceroute rely on ICMP.",
      },
      {
        questionText: "Three-way handshake belongs to:",
        options: [
          { text: "TCP", isCorrect: true },
          { text: "UDP", isCorrect: false },
          { text: "HTTP", isCorrect: false },
          { text: "SMTP", isCorrect: false },
        ],
        explanation: "SYN → SYN-ACK → ACK.",
      },
      {
        questionText: "NAT primarily modifies:",
        options: [
          { text: "IP headers", isCorrect: true },
          { text: "MAC headers", isCorrect: false },
          { text: "TLS payload", isCorrect: false },
          { text: "DHCP leases only", isCorrect: false },
        ],
        explanation: "Network Address Translation alters IP addresses/ports.",
      },
    ],
  },
  {
    subjectSlug: "computer-networks",
    title: "Network Security Basics",
    slug: "cn-security",
    questions: [
      {
        questionText: "HTTPS adds which layer of security?",
        options: [
          { text: "TLS/SSL encryption", isCorrect: true },
          { text: "Plain text headers", isCorrect: false },
          { text: "Only compression", isCorrect: false },
          { text: "No change", isCorrect: false },
        ],
        explanation: "TLS ensures confidentiality, integrity, authenticity.",
      },
      {
        questionText: "Common firewall type:",
        options: [
          { text: "Packet filter", isCorrect: true },
          { text: "Printer", isCorrect: false },
          { text: "Web cache only", isCorrect: false },
          { text: "Load balancer only", isCorrect: false },
        ],
        explanation: "Packet filters inspect headers to allow/deny traffic.",
      },
      {
        questionText: "Symmetric encryption example:",
        options: [
          { text: "AES", isCorrect: true },
          { text: "RSA", isCorrect: false },
          { text: "Diffie-Hellman", isCorrect: false },
          { text: "ECDSA", isCorrect: false },
        ],
        explanation:
          "AES is symmetric; the others are asymmetric/handshake/signature.",
      },
      {
        questionText: "CIA triad stands for:",
        options: [
          { text: "Confidentiality, Integrity, Availability", isCorrect: true },
          { text: "Central, Internet, Access", isCorrect: false },
          { text: "Compute, Integrate, Apply", isCorrect: false },
          { text: "Control, Inspect, Audit", isCorrect: false },
        ],
        explanation: "Core security objectives.",
      },
      {
        questionText: "Phishing primarily targets:",
        options: [
          { text: "Users via social engineering", isCorrect: true },
          { text: "Routers only", isCorrect: false },
          { text: "Switches only", isCorrect: false },
          { text: "Fiber optics only", isCorrect: false },
        ],
        explanation: "Tricking users to divulge secrets.",
      },
    ],
  },
];

/* =========================
   Seed Logic
   ========================= */

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  // Clear in order (to avoid FKs dangling)
  await Result.deleteMany({});
  await Quiz.deleteMany({});
  await Subject.deleteMany({});
  console.log("Cleared old data");

  // Insert subjects
  const subjects = await Subject.insertMany(subjectsToSeed);
  const subMap = new Map<string, Types.ObjectId>();
  subjects.forEach((s) => subMap.set(s.slug, s._id));

  // Build quizzes with subject ObjectIds
  const quizzes = quizzesToSeed.map((q) => {
    const subjectId = subMap.get(q.subjectSlug);
    if (!subjectId)
      throw new Error(`Missing subject for slug ${q.subjectSlug}`);
    // Ensure exactly one correct per question (safety)
    q.questions.forEach((ques, idx) => {
      const correctCount = ques.options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        throw new Error(
          `Quiz ${q.slug} Question ${
            idx + 1
          } must have exactly 1 correct option`
        );
      }
    });
    return {
      title: q.title,
      slug: q.slug,
      subject: subjectId,
      questions: q.questions,
    };
  });

  await Quiz.insertMany(quizzes);
  console.log(
    `Inserted ${subjects.length} subjects and ${quizzes.length} quizzes`
  );

  await mongoose.connection.close();
  console.log("✅ Seeding complete");
}

seed().catch(async (e) => {
  console.error(e);
  await mongoose.connection.close();
  process.exit(1);
});

// Exports (optional if you want to reuse models elsewhere)
export { Subject, Quiz, Result };
