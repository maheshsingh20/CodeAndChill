import SkillTest from '../models/SkillTest';

export const seedSkillTests = async () => {
  try {
    // Clear existing skill tests
    await SkillTest.deleteMany({});

    const skillTests = [
      {
        skillName: 'JavaScript',
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, objects, and ES6 features.',
        difficulty: 'Beginner',
        duration: 30,
        passingScore: 70,
        questions: [
          {
            id: 'js_1',
            question: 'What is the correct way to declare a variable in JavaScript?',
            type: 'multiple_choice',
            options: ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
            correctAnswer: 0,
            explanation: 'The "var" keyword is used to declare variables in JavaScript. ES6 also introduced "let" and "const".',
            points: 10
          },
          {
            id: 'js_2',
            question: 'Which of the following is NOT a JavaScript data type?',
            type: 'multiple_choice',
            options: ['String', 'Boolean', 'Float', 'Number'],
            correctAnswer: 2,
            explanation: 'JavaScript does not have a specific "Float" data type. Numbers are represented by the "Number" type.',
            points: 10
          },
          {
            id: 'js_3',
            question: 'What does the "===" operator do?',
            type: 'multiple_choice',
            options: [
              'Assigns a value',
              'Compares values without type checking',
              'Compares values with strict type checking',
              'Performs addition'
            ],
            correctAnswer: 2,
            explanation: 'The "===" operator performs strict equality comparison, checking both value and type.',
            points: 15
          },
          {
            id: 'js_4',
            question: 'JavaScript is a statically typed language.',
            type: 'true_false',
            correctAnswer: false,
            explanation: 'JavaScript is a dynamically typed language, meaning variable types are determined at runtime.',
            points: 10
          },
          {
            id: 'js_5',
            question: 'Write a function that returns the sum of two numbers:',
            type: 'code',
            codeTemplate: 'function sum(a, b) {\n  // Your code here\n}',
            correctAnswer: 'function sum(a, b) {\n  return a + b;\n}',
            explanation: 'The function should use the return statement to return the sum of parameters a and b.',
            points: 20
          }
        ],
        tags: ['programming', 'web-development', 'frontend'],
        isActive: true
      },
      {
        skillName: 'React',
        title: 'React Fundamentals',
        description: 'Test your understanding of React components, hooks, state management, and lifecycle methods.',
        difficulty: 'Intermediate',
        duration: 45,
        passingScore: 75,
        questions: [
          {
            id: 'react_1',
            question: 'What is JSX?',
            type: 'multiple_choice',
            options: [
              'A JavaScript library',
              'A syntax extension for JavaScript',
              'A CSS framework',
              'A database query language'
            ],
            correctAnswer: 1,
            explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.',
            points: 10
          },
          {
            id: 'react_2',
            question: 'Which hook is used for managing state in functional components?',
            type: 'multiple_choice',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 1,
            explanation: 'useState is the primary hook for managing local state in functional components.',
            points: 15
          },
          {
            id: 'react_3',
            question: 'React components must return a single parent element.',
            type: 'true_false',
            correctAnswer: false,
            explanation: 'React components can return multiple elements using React.Fragment or the <> syntax.',
            points: 10
          },
          {
            id: 'react_4',
            question: 'Create a simple React component that displays "Hello World":',
            type: 'code',
            codeTemplate: 'function HelloWorld() {\n  // Your code here\n}',
            correctAnswer: 'function HelloWorld() {\n  return <div>Hello World</div>;\n}',
            explanation: 'A React component should return JSX that renders the desired content.',
            points: 20
          }
        ],
        tags: ['react', 'frontend', 'javascript', 'web-development'],
        isActive: true
      },
      {
        skillName: 'Python',
        title: 'Python Programming Basics',
        description: 'Evaluate your Python programming skills including syntax, data structures, and basic algorithms.',
        difficulty: 'Beginner',
        duration: 35,
        passingScore: 70,
        questions: [
          {
            id: 'py_1',
            question: 'Which of the following is the correct way to create a list in Python?',
            type: 'multiple_choice',
            options: ['list = []', 'list = ()', 'list = {}', 'list = ""'],
            correctAnswer: 0,
            explanation: 'Square brackets [] are used to create lists in Python.',
            points: 10
          },
          {
            id: 'py_2',
            question: 'What is the output of: print(type([]))?',
            type: 'multiple_choice',
            options: ['<class \'array\'>', '<class \'list\'>', '<class \'tuple\'>', '<class \'dict\'>'],
            correctAnswer: 1,
            explanation: 'Empty square brackets create a list object, so type([]) returns <class \'list\'>.',
            points: 15
          },
          {
            id: 'py_3',
            question: 'Python is case-sensitive.',
            type: 'true_false',
            correctAnswer: true,
            explanation: 'Python is case-sensitive, meaning "Variable" and "variable" are different identifiers.',
            points: 10
          },
          {
            id: 'py_4',
            question: 'Write a function that returns the length of a list:',
            type: 'code',
            codeTemplate: 'def get_length(my_list):\n    # Your code here',
            correctAnswer: 'def get_length(my_list):\n    return len(my_list)',
            explanation: 'The len() function returns the number of items in a list.',
            points: 20
          }
        ],
        tags: ['python', 'programming', 'backend'],
        isActive: true
      },
      {
        skillName: 'Node.js',
        title: 'Node.js Backend Development',
        description: 'Test your knowledge of Node.js, Express.js, and backend development concepts.',
        difficulty: 'Intermediate',
        duration: 40,
        passingScore: 75,
        questions: [
          {
            id: 'node_1',
            question: 'What is Node.js?',
            type: 'multiple_choice',
            options: [
              'A JavaScript framework',
              'A JavaScript runtime built on Chrome\'s V8 engine',
              'A database management system',
              'A CSS preprocessor'
            ],
            correctAnswer: 1,
            explanation: 'Node.js is a JavaScript runtime that allows you to run JavaScript on the server side.',
            points: 10
          },
          {
            id: 'node_2',
            question: 'Which module is used to create HTTP servers in Node.js?',
            type: 'multiple_choice',
            options: ['fs', 'path', 'http', 'url'],
            correctAnswer: 2,
            explanation: 'The "http" module is used to create HTTP servers and clients in Node.js.',
            points: 15
          },
          {
            id: 'node_3',
            question: 'Node.js is single-threaded.',
            type: 'true_false',
            correctAnswer: true,
            explanation: 'Node.js uses a single-threaded event loop, though it uses multiple threads for I/O operations.',
            points: 10
          }
        ],
        tags: ['nodejs', 'backend', 'javascript', 'server'],
        isActive: true
      },
      {
        skillName: 'CSS',
        title: 'CSS Styling and Layout',
        description: 'Assess your CSS skills including selectors, flexbox, grid, and responsive design.',
        difficulty: 'Beginner',
        duration: 25,
        passingScore: 70,
        questions: [
          {
            id: 'css_1',
            question: 'Which CSS property is used to change the text color?',
            type: 'multiple_choice',
            options: ['text-color', 'color', 'font-color', 'text-style'],
            correctAnswer: 1,
            explanation: 'The "color" property is used to set the color of text in CSS.',
            points: 10
          },
          {
            id: 'css_2',
            question: 'What does "CSS" stand for?',
            type: 'multiple_choice',
            options: [
              'Computer Style Sheets',
              'Cascading Style Sheets',
              'Creative Style Sheets',
              'Colorful Style Sheets'
            ],
            correctAnswer: 1,
            explanation: 'CSS stands for Cascading Style Sheets.',
            points: 10
          },
          {
            id: 'css_3',
            question: 'Flexbox is a one-dimensional layout method.',
            type: 'true_false',
            correctAnswer: true,
            explanation: 'Flexbox is designed for one-dimensional layouts (either row or column), while Grid is for two-dimensional layouts.',
            points: 15
          }
        ],
        tags: ['css', 'frontend', 'web-development', 'styling'],
        isActive: true
      }
    ];

    await SkillTest.insertMany(skillTests);
    console.log('✅ Skill tests seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding skill tests:', error);
  }
};