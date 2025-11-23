# Learning Paths Seed Structure

## Overview
This folder contains modular seed files for learning paths. Each learning path has its own file with complete course content, making it easy to manage and update.

## Folder Structure
```
learning-paths/
├── index.ts              # Main seeding logic
├── dsa-path.ts          # Data Structures & Algorithms
├── web-dev-path.ts      # Full-Stack Web Development
├── ml-path.ts           # Machine Learning (future)
├── mobile-path.ts       # Mobile Development (future)
└── README.md            # This file
```

## How to Add a New Learning Path

### 1. Create a new file (e.g., `ml-path.ts`)

```typescript
export const mlPathData = {
  title: 'Machine Learning Fundamentals',
  description: 'Your description here',
  icon: '🤖',
  difficulty: 'advanced' as const,
  estimatedDuration: 100,
  prerequisites: ['Python', 'Statistics'],
  tags: ['ml', 'ai', 'python'],
  isPublic: true,
  enrollmentCount: 0,
  completionRate: 0,
  averageRating: 0,
  totalRatings: 0
};

export const mlCourses = [
  {
    courseTitle: 'Course Name',
    slug: 'course-slug',
    modules: [
      {
        title: 'Module Title',
        topics: [
          {
            title: 'Topic Title',
            subtopics: [
              {
                id: 'unique-id',
                title: 'Subtopic Title',
                content: '<h2>HTML Content</h2><p>Your content...</p>',
                duration: 15, // minutes
                videoUrl: 'https://...', // optional
                codeExamples: [
                  {
                    language: 'python',
                    code: '# Your code here',
                    description: 'Code description'
                  }
                ],
                quiz: [
                  {
                    question: 'Your question?',
                    options: ['A', 'B', 'C', 'D'],
                    correctAnswer: 0 // index of correct option
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

export const mlMilestones = [
  {
    title: 'Milestone Title',
    description: 'Milestone description',
    order: 1
  }
];
```

### 2. Import in `index.ts`

```typescript
import { mlPathData, mlCourses, mlMilestones } from './ml-path';

const learningPathSeeds: LearningPathSeed[] = [
  // ... existing paths
  {
    pathData: mlPathData,
    courses: mlCourses,
    milestones: mlMilestones
  }
];
```

### 3. Run the seed command

```bash
npm run seed
```

## Content Types

### Text Content
Use HTML in the `content` field:
```typescript
content: `<h2>Title</h2>
<p>Paragraph text...</p>
<ul>
  <li>List item</li>
</ul>`
```

### Video Content
Add `videoUrl` field:
```typescript
{
  id: 'video-lesson',
  title: 'Video Tutorial',
  content: '<p>Video description</p>',
  videoUrl: 'https://www.youtube.com/embed/VIDEO_ID',
  duration: 30
}
```

### Code Examples
Add multiple code examples in different languages:
```typescript
codeExamples: [
  {
    language: 'javascript',
    code: 'const example = "code";',
    description: 'JavaScript example'
  },
  {
    language: 'python',
    code: 'example = "code"',
    description: 'Python example'
  }
]
```

### Quizzes
Add interactive quizzes:
```typescript
quiz: [
  {
    question: 'What is the time complexity?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctAnswer: 1 // index 1 = 'O(n)'
  }
]
```

## Best Practices

### Content Guidelines
1. **Be Comprehensive**: Cover topics thoroughly with examples
2. **Use Real Code**: Provide working code examples
3. **Add Quizzes**: Include questions to test understanding
4. **Estimate Duration**: Set realistic time estimates
5. **Progressive Difficulty**: Start easy, increase complexity

### Code Examples
- Use proper syntax highlighting
- Add comments to explain code
- Provide multiple language examples when relevant
- Keep examples concise and focused

### HTML Content
- Use semantic HTML tags
- Keep formatting consistent
- Use headings (h2, h3) for structure
- Add lists for better readability

## Current Learning Paths

### 1. Data Structures & Algorithms (dsa-path.ts)
**Status**: ✅ Complete with real content

**Courses**:
1. Arrays and Strings Fundamentals
   - Array basics and operations
   - Two-pointer technique
   - String manipulation
   
2. Linked Lists and Stacks
   - Singly linked lists
   - Stack operations
   
3. Trees and Graphs
   - Binary trees
   - Tree traversals

**Content Type**: Text-based with code examples and quizzes

### 2. Full-Stack Web Development (web-dev-path.ts)
**Status**: ⚠️ Placeholder (needs content)

**Courses**:
1. HTML & CSS Fundamentals
2. JavaScript Essentials
3. React Development
4. Node.js Backend

**Content Type**: To be added

## Dynamic Content Rendering

The CoursePlayer component automatically handles different content types:

### Text Lessons
```typescript
if (currentLessonData.type === 'text') {
  // Renders HTML content with code examples
}
```

### Video Lessons
```typescript
if (currentLessonData.type === 'video' && currentLessonData.videoUrl) {
  // Renders video player
}
```

### Quiz Lessons
```typescript
if (currentLessonData.type === 'quiz' && currentLessonData.quiz) {
  // Renders interactive quiz
}
```

## Database Schema

### Course Model
```typescript
{
  courseTitle: string,
  slug: string,
  modules: [
    {
      title: string,
      topics: [
        {
          title: string,
          subtopics: [
            {
              id: string,
              title: string,
              content: string,
              duration?: number,
              videoUrl?: string,
              codeExamples?: Array,
              quiz?: Array,
              resources?: Array
            }
          ]
        }
      ]
    }
  ]
}
```

## Testing

After adding new content:

1. **Run Seed**:
   ```bash
   npm run seed
   ```

2. **Check Database**:
   - Verify courses are created
   - Check learning path references
   - Validate content structure

3. **Test Frontend**:
   - Navigate to learning path
   - Enroll in path
   - Open course player
   - Verify content renders correctly

## Troubleshooting

### Course Not Showing
- Check if course slug is unique
- Verify course is linked to learning path
- Check console for errors

### Content Not Rendering
- Validate HTML syntax
- Check for missing fields
- Verify content type detection

### Video Not Playing
- Ensure videoUrl is valid
- Use embed URLs (not watch URLs)
- Check CORS settings

## Future Enhancements

- [ ] Add more learning paths
- [ ] Include video content
- [ ] Add interactive coding exercises
- [ ] Implement progress tracking per subtopic
- [ ] Add downloadable resources
- [ ] Include project-based learning
- [ ] Add peer review system
- [ ] Implement spaced repetition for quizzes

## Contributing

When adding new content:
1. Follow the existing structure
2. Use meaningful IDs and slugs
3. Add comprehensive descriptions
4. Include code examples
5. Add quizzes for assessment
6. Test thoroughly before committing
