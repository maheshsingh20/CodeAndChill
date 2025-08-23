import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/codeandchill";

// --- Schema Definitions ---
const TestCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
});
const ExampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
});
const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  examples: [ExampleSchema],
  constraints: [String],
  testCases: [TestCaseSchema],
});
const Problem = mongoose.model("Problem", ProblemSchema);

const ProblemSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  problems: [{ type: Schema.Types.ObjectId, ref: "Problem" }],
  problemsCount: { type: Number, required: true },
});
const ProblemSet = mongoose.model("ProblemSet", ProblemSetSchema);

// --- The Complete Problem Data ---
const problemSetsToSeed = [
  {
    author: "Striver",
    name: "Striver's SDE Sheet",
    slug: "strivers-sde-sheet",
    description:
      "A curated list of essential problems to master Data Structures and Algorithms for interviews.",
    problems: [
      {
        title: "Set Matrix Zeroes",
        slug: "set-matrix-zeroes",
        difficulty: "Medium",
        topic: "Arrays",
        description:
          "Given an m x n integer matrix, if an element is 0, set its entire row and column to 0's. You must do it in-place.",
        examples: [
          {
            input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
            output: "[[1,0,1],[0,0,0],[1,0,1]]",
            explanation:
              "The element at (1,1) is 0, so the 2nd row and 2nd column are set to 0.",
          },
        ],
        constraints: [
          "m == matrix.length",
          "n == matrix[0].length",
          "1 <= m, n <= 200",
          "matrix[i][j] is an integer.",
        ],
        testCases: [
          {
            input: "[[1,1,1],[1,0,1],[1,1,1]]",
            expectedOutput: "[[1,0,1],[0,0,0],[1,0,1]]",
          },
        ],
      },
      {
        title: "Pascal's Triangle",
        slug: "pascals-triangle",
        difficulty: "Easy",
        topic: "Arrays",
        description:
          "Given an integer numRows, return the first numRows of Pascal's triangle. In Pascal's triangle, each number is the sum of the two numbers directly above it.",
        examples: [
          {
            input: "numRows = 5",
            output: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
          },
        ],
        constraints: ["1 <= numRows <= 30"],
        testCases: [
          {
            input: "5",
            expectedOutput: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
          },
        ],
      },
      {
        title: "Next Permutation",
        slug: "next-permutation",
        difficulty: "Medium",
        topic: "Arrays",
        description:
          "Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers.",
        examples: [{ input: "nums = [1,2,3]", output: "[1,3,2]" }],
        constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 100"],
        testCases: [{ input: "[1,2,3]", expectedOutput: "[1,3,2]" }],
      },
      {
        title: "Kadane's Algorithm",
        slug: "kadanes-algorithm",
        difficulty: "Medium",
        topic: "Arrays",
        description:
          "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        examples: [
          {
            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            output: "6",
            explanation: "The subarray [4,-1,2,1] has the largest sum = 6.",
          },
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        testCases: [{ input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" }],
      },
      {
        title: "Sort an array of 0's, 1's and 2's",
        slug: "sort-colors",
        difficulty: "Medium",
        topic: "Arrays",
        description:
          "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.",
        examples: [{ input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }],
        constraints: [
          "n == nums.length",
          "1 <= n <= 300",
          "nums[i] is 0, 1, or 2.",
        ],
        testCases: [{ input: "[2,0,1]", expectedOutput: "[0,1,2]" }],
      },
      {
        title: "Stock Buy and Sell",
        slug: "stock-buy-sell",
        difficulty: "Easy",
        topic: "Arrays",
        description:
          "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
        examples: [
          {
            input: "prices = [7,1,5,3,6,4]",
            output: "5",
            explanation:
              "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
          },
        ],
        constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        testCases: [{ input: "[7,1,5,3,6,4]", expectedOutput: "5" }],
      },
      {
        title: "Rotate Image",
        slug: "rotate-image",
        difficulty: "Medium",
        topic: "Arrays",
        description:
          "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.",
        examples: [
          {
            input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
            output: "[[7,4,1],[8,5,2],[9,6,3]]",
          },
        ],
        constraints: [
          "matrix.length == n",
          "matrix[i].length == n",
          "1 <= n <= 20",
        ],
        testCases: [
          { input: "[[1,2],[3,4]]", expectedOutput: "[[3,1],[4,2]]" },
        ],
      },
      {
        title: "Merge Overlapping Subintervals",
        slug: "merge-intervals",
        difficulty: "Medium",
        topic: "Arrays",
        description:
          "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        examples: [
          {
            input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
            output: "[[1,6],[8,10],[15,18]]",
          },
        ],
        constraints: [
          "1 <= intervals.length <= 10^4",
          "intervals[i].length == 2",
        ],
        testCases: [{ input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]" }],
      },
      {
        title: "Merge Two Sorted Arrays",
        slug: "merge-sorted-arrays",
        difficulty: "Easy",
        topic: "Arrays",
        description:
          "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order.",
        examples: [
          {
            input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
            output: "[1,2,2,3,5,6]",
          },
        ],
        constraints: ["nums1.length == m + n", "nums2.length == n"],
        testCases: [
          {
            input: "[1,2,3,0,0,0]\n3\n[2,5,6]\n3",
            expectedOutput: "[1,2,2,3,5,6]",
          },
        ],
      },
      {
        title: "Find the duplicate in an array of N+1 integers",
        slug: "find-duplicate",
        difficulty: "Medium",
        topic: "Arrays",
        description:
          "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number.",
        examples: [{ input: "nums = [1,3,4,2,2]", output: "2" }],
        constraints: [
          "1 <= n <= 10^5",
          "You must solve the problem without modifying the array nums and uses only constant extra space.",
        ],
        testCases: [{ input: "[3,1,3,4,2]", expectedOutput: "3" }],
      },
    ],
  },
  {
    author: "GeeksForGeeks",
    name: "GFG 450 DSA Sheet",
    slug: "gfg-450-sheet",
    description:
      "A comprehensive list of 450 problems curated by GeeksForGeeks to master DSA.",
    problems: [
      {
        title: "Reverse the array",
        slug: "gfg-reverse-array",
        difficulty: "Easy",
        topic: "Arrays",
        description: "Write a program to reverse an array or string.",
        examples: [{ input: "arr[] = {1, 2, 3}", output: "{3, 2, 1}" }],
        constraints: ["1 <= N <= 1000"],
        testCases: [{ input: "1 2 3 4 5", expectedOutput: "5 4 3 2 1" }],
      },
      {
        title: "Find the maximum and minimum element",
        slug: "gfg-max-min",
        difficulty: "Easy",
        topic: "Arrays",
        description:
          "Find the maximum and minimum element in an array with minimum number of comparisons.",
        examples: [
          { input: "arr[] = {3, 5, 4, 1, 9}", output: "Min: 1, Max: 9" },
        ],
        constraints: ["1 <= N <= 10^5"],
        testCases: [{ input: "3 5 4 1 9", expectedOutput: "1 9" }],
      },
      {
        title: "Find Kth max and min element",
        slug: "gfg-kth-max-min",
        difficulty: "Medium",
        topic: "Arrays",
        description:
          "Given an array and a number K, find the Kth smallest element in the given array. It is given that all array elements are distinct.",
        examples: [
          { input: "arr[] = {7, 10, 4, 3, 20, 15}, K = 3", output: "7" },
        ],
        constraints: ["1 <= K <= N <= 10^5"],
        testCases: [{ input: "7 10 4 3 20 15\n3", expectedOutput: "7" }],
      },
      {
        title: "Move all negative elements to one side",
        slug: "gfg-move-negatives",
        difficulty: "Easy",
        topic: "Arrays",
        description:
          "Move all negative numbers to the beginning and positive numbers to the end of the array with constant extra space.",
        examples: [
          {
            input: "arr[] = {-12, 11, -13, -5, 6, -7, 5, -3, -6}",
            output: "[-12, -13, -5, -7, -3, -6, 11, 6, 5]",
          },
        ],
        constraints: ["Order of elements is not important."],
        testCases: [
          {
            input: "-1 2 -3 4 5 6 -7 8 9",
            expectedOutput: "-1 -3 -7 4 5 6 2 8 9",
          },
        ],
      },
      {
        title: "Find Union and Intersection of two arrays",
        slug: "gfg-union-intersection",
        difficulty: "Easy",
        topic: "Arrays",
        description: "Find the union and intersection of two sorted arrays.",
        examples: [
          {
            input: "arr1[] = {1, 3, 4, 5, 7}, arr2[] = {2, 3, 5, 6}",
            output: "Union: {1,2,3,4,5,6,7}, Intersection: {3,5}",
          },
        ],
        constraints: ["1 <= n, m <= 10^5"],
        testCases: [{ input: "1 2 3\n3 4 5", expectedOutput: "1 2 3 4 5\n3" }],
      },
      {
        title: "Spirally traversing a matrix",
        slug: "gfg-spiral-traversal",
        difficulty: "Medium",
        topic: "Matrix",
        description:
          "Given a matrix of size r*c. Traverse the matrix in spiral form.",
        examples: [
          {
            input: "matrix[][] = {{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}}",
            output: "1 2 3 4 8 12 11 10 9 5 6 7",
          },
        ],
        constraints: ["1 <= r, c <= 100"],
        testCases: [{ input: "1 2\n3 4", expectedOutput: "1 2 4 3" }],
      },
      {
        title: "Search an element in a matrix",
        slug: "gfg-search-matrix",
        difficulty: "Medium",
        topic: "Matrix",
        description:
          "Given a row-wise and column-wise sorted matrix, search for a given element in it.",
        examples: [
          {
            input: "matrix = [[10, 20], [30, 40]], target = 30",
            output: "true",
          },
        ],
        constraints: [
          "Integers in each row are sorted in ascending from left to right.",
        ],
        testCases: [
          { input: "1 3 5\n10 11 16\n23 30 34\n11", expectedOutput: "true" },
        ],
      },
      {
        title: "Median in a row-wise sorted Matrix",
        slug: "gfg-median-matrix",
        difficulty: "Hard",
        topic: "Matrix",
        description: "Find the median of a row-wise sorted matrix of size R*C.",
        examples: [
          { input: "M = [[1, 3, 5], [2, 6, 9], [3, 6, 9]]", output: "5" },
        ],
        constraints: ["1<= R,C <=150"],
        testCases: [{ input: "1 2 3\n4 5 6\n7 8 9", expectedOutput: "5" }],
      },
      {
        title: "Row with max 1s",
        slug: "gfg-row-max-1s",
        difficulty: "Medium",
        topic: "Matrix",
        description:
          "Given a boolean 2D array of n x m dimensions, find the row with the maximum number of 1s.",
        examples: [
          { input: "Arr[][] = {{0, 1, 1, 1}, {0, 0, 1, 1}}", output: "0" },
        ],
        constraints: ["1 <= n, m <= 10^3"],
        testCases: [{ input: "0 0 1\n1 1 1", expectedOutput: "1" }],
      },
      {
        title: "Check whether a String is Palindrome or not",
        slug: "gfg-palindrome-string",
        difficulty: "Easy",
        topic: "Strings",
        description: "Given a string S, check if it is palindrome or not.",
        examples: [{ input: "S = 'abba'", output: "Yes" }],
        constraints: ["1 <= S.length <= 10^5"],
        testCases: [{ input: "racecar", expectedOutput: "Yes" }],
      },
    ],
  },
  {
    author: "Community",
    name: "TLE Eliminators",
    slug: "tle-eliminators",
    description:
      "A collection of challenging problems focused on time complexity and optimization.",
    problems: [
      {
        title: "Trapping Rain Water",
        slug: "trapping-rain-water",
        difficulty: "Hard",
        topic: "Arrays",
        description:
          "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
        examples: [
          { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
        ],
        constraints: ["1 <= n <= 2 * 10^4"],
        testCases: [{ input: "0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" }],
      },
      {
        title: "Median of Two Sorted Arrays",
        slug: "median-two-sorted",
        difficulty: "Hard",
        topic: "Arrays",
        description:
          "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        examples: [{ input: "nums1 = [1, 3], nums2 = [2]", output: "2.0" }],
        constraints: [
          "nums1.length == m",
          "nums2.length == n",
          "0 <= m, n <= 1000",
        ],
        testCases: [{ input: "1 3\n2", expectedOutput: "2.0" }],
      },
      {
        title: "Largest Rectangle in Histogram",
        slug: "largest-rectangle-histogram",
        difficulty: "Hard",
        topic: "Arrays",
        description:
          "Given an array of integers heights representing the histogram's bar height, return the area of the largest rectangle in the histogram.",
        examples: [{ input: "[2,1,5,6,2,3]", output: "10" }],
        constraints: ["1 <= heights.length <= 10^5"],
        testCases: [{ input: "2 1 5 6 2 3", expectedOutput: "10" }],
      },
      {
        title: "Sliding Window Maximum",
        slug: "sliding-window-maximum",
        difficulty: "Hard",
        topic: "Arrays",
        description:
          "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.",
        examples: [
          {
            input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
            output: "[3,3,5,5,6,7]",
          },
        ],
        constraints: ["1 <= nums.length <= 10^5"],
        testCases: [
          { input: "1 3 -1 -3 5 3 6 7\n3", expectedOutput: "[3,3,5,5,6,7]" },
        ],
      },
      {
        title: "First Missing Positive",
        slug: "first-missing-positive",
        difficulty: "Hard",
        topic: "Arrays",
        description:
          "Given an unsorted integer array nums, return the smallest missing positive integer.",
        examples: [{ input: "[3,4,-1,1]", output: "2" }],
        constraints: ["1 <= nums.length <= 5 * 10^5"],
        testCases: [{ input: "7 8 9 11 12", expectedOutput: "1" }],
      },
      {
        title: "Reverse Nodes in k-Group",
        slug: "reverse-nodes-k-group",
        difficulty: "Hard",
        topic: "Linked List",
        description:
          "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
        examples: [
          { input: "head = [1,2,3,4,5], k = 2", output: "[2,1,4,3,5]" },
        ],
        constraints: ["The number of nodes in the list is n."],
        testCases: [{ input: "1 2 3 4 5\n3", expectedOutput: "3 2 1 4 5" }],
      },
      {
        title: "Merge k Sorted Lists",
        slug: "merge-k-sorted-lists",
        difficulty: "Hard",
        topic: "Linked List",
        description:
          "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        examples: [
          {
            input: "lists = [[1,4,5],[1,3,4],[2,6]]",
            output: "[1,1,2,3,4,4,5,6]",
          },
        ],
        constraints: ["k == lists.length"],
        testCases: [{ input: "[[1,2],[3,4]]", expectedOutput: "[1,2,3,4]" }],
      },
      {
        title: "LRU Cache",
        slug: "lru-cache",
        difficulty: "Medium",
        topic: "Design",
        description:
          "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
        examples: [
          { input: "LRUCache(2); put(1,1); put(2,2); get(1);", output: "1" },
        ],
        constraints: ["1 <= capacity <= 3000"],
        testCases: [],
      },
      {
        title: "Word Break II",
        slug: "word-break-2",
        difficulty: "Hard",
        topic: "DP",
        description:
          "Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word.",
        examples: [
          {
            input: "s = 'catsanddog', dict = ['cat','cats','and','sand','dog']",
            output: "['cats and dog', 'cat sand dog']",
          },
        ],
        constraints: ["1 <= s.length <= 20"],
        testCases: [],
      },
      {
        title: "Regular Expression Matching",
        slug: "regex-matching",
        difficulty: "Hard",
        topic: "DP",
        description:
          "Implement regular expression matching with support for '.' and '*'. '.' Matches any single character. '*' Matches zero or more of the preceding element.",
        examples: [{ input: "s = 'aa', p = 'a*'", output: "true" }],
        constraints: ["1 <= s.length <= 20"],
        testCases: [{ input: "aab\nc*a*b", expectedOutput: "true" }],
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for full problem set seeding...");
    await Problem.deleteMany({});
    await ProblemSet.deleteMany({});
    console.log("Cleared existing problems and problem sets.");
    for (const set of problemSetsToSeed) {
      const createdProblems = await Problem.insertMany(set.problems);
      console.log(
        `- Inserted ${createdProblems.length} problems for ${set.name}`
      );
      const problemIds = createdProblems.map((p) => p._id);
      const newProblemSet = new ProblemSet({
        title: set.name,
        slug: set.slug,
        author: set.author,
        description: set.description,
        problems: problemIds,
        problemsCount: problemIds.length,
      });
      await newProblemSet.save();
      console.log(`- Created problem set: ${set.name}`);
    }
    console.log("✅ All problem sets and problems seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
