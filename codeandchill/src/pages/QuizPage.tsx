import React from 'react';
import { QuizSystem } from '@/components/quiz/QuizSystem';
import { useUser } from '@/contexts/UserContext';
import { useActivityTracking } from '@/hooks/useActivityTracking';

export const QuizPage: React.FC = () => {
  const { recordActivity } = useUser();

  // Track quiz taking activity
  useActivityTracking('quiz_taking', { quizId: 'quiz-1' });

  // Mock quiz data
  const quizData = {
    id: 'quiz-1',
    title: 'JavaScript Fundamentals Quiz',
    timeLimit: 30, // 30 minutes
    questions: [
      {
        id: 'q1',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: [
          'var myVariable;',
          'variable myVariable;',
          'v myVariable;',
          'declare myVariable;'
        ],
        correctAnswer: 0,
        explanation: 'The "var" keyword is used to declare variables in JavaScript. ES6 also introduced "let" and "const" for variable declaration.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Which of the following is NOT a JavaScript data type?',
        options: [
          'String',
          'Boolean',
          'Float',
          'Number'
        ],
        correctAnswer: 2,
        explanation: 'JavaScript does not have a specific "Float" data type. Numbers in JavaScript are represented by the "Number" type, which can handle both integers and floating-point numbers.',
        points: 10
      },
      {
        id: 'q3',
        question: 'What does the "===" operator do in JavaScript?',
        options: [
          'Assigns a value to a variable',
          'Compares values without type checking',
          'Compares values with strict type checking',
          'Performs mathematical addition'
        ],
        correctAnswer: 2,
        explanation: 'The "===" operator performs strict equality comparison, checking both value and type. It does not perform type coercion like the "==" operator.',
        points: 15
      },
      {
        id: 'q4',
        question: 'Which method is used to add an element to the end of an array?',
        options: [
          'push()',
          'pop()',
          'shift()',
          'unshift()'
        ],
        correctAnswer: 0,
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
        points: 10
      },
      {
        id: 'q5',
        question: 'What is the output of: console.log(typeof null)?',
        options: [
          '"null"',
          '"undefined"',
          '"object"',
          '"boolean"'
        ],
        correctAnswer: 2,
        explanation: 'This is a well-known quirk in JavaScript. The typeof operator returns "object" for null, even though null is a primitive value. This is considered a bug in the language but is maintained for backward compatibility.',
        points: 15
      },
      {
        id: 'q6',
        question: 'Which of the following creates a function in JavaScript?',
        options: [
          'function myFunc() {}',
          'create myFunc() {}',
          'def myFunc() {}',
          'func myFunc() {}'
        ],
        correctAnswer: 0,
        explanation: 'Functions in JavaScript are declared using the "function" keyword followed by the function name and parentheses.',
        points: 10
      },
      {
        id: 'q7',
        question: 'What is closure in JavaScript?',
        options: [
          'A way to close the browser window',
          'A function that has access to variables in its outer scope',
          'A method to end a loop',
          'A way to close a file'
        ],
        correctAnswer: 1,
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This is a powerful feature in JavaScript.',
        points: 20
      },
      {
        id: 'q8',
        question: 'Which event occurs when the user clicks on an HTML element?',
        options: [
          'onchange',
          'onclick',
          'onmouseclick',
          'onselect'
        ],
        correctAnswer: 1,
        explanation: 'The "onclick" event occurs when a user clicks on an HTML element. It is one of the most commonly used events in web development.',
        points: 10
      }
    ]
  };

  const handleQuizComplete = async (results: any) => {
    console.log('Quiz completed:', results);

    // Record quiz completion activity
    try {
      await recordActivity('quiz_completed');
      console.log('Quiz completion recorded! Stats updated.');
    } catch (error) {
      console.error('Failed to record quiz completion:', error);
    }

    alert(`Quiz completed! Score: ${results.score}/${results.totalPoints} (${((results.score / results.totalPoints) * 100).toFixed(1)}%)`);
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <QuizSystem
        quizId={quizData.id}
        title={quizData.title}
        questions={quizData.questions}
        timeLimit={quizData.timeLimit}
        onComplete={handleQuizComplete}
      />
    </div>
  );
};