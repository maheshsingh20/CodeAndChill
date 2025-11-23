# Testing Learning Path Features

## Prerequisites
1. Backend server running on port 3001
2. Frontend running on port 5173
3. User logged in
4. At least one learning path with courses in database

## Test Steps

### 1. View Learning Path
- Navigate to `/learning-paths/:pathId`
- Should see: Hero section, stats, course list, milestones

### 2. Enroll in Path
- Click "Enroll Now" button
- Should see: Progress bar, enrollment confirmation

### 3. Access Course Content
- Click on first course in list
- Should see: Course player with lessons
- Content types: video, text, quiz

### 4. Track Progress
- Play through lessons
- Progress bar should update
- Time tracking should increment

### 5. Post Discussion
- Go to Discussion tab
- Type a comment
- Click "Post Comment"
- Should see: New discussion appears

### 6. View Analytics
- Go to Analytics tab
- Should see: Progress stats, streak, time invested

### 7. Check Achievements
- Go to Achievements tab
- Should see: Unlocked/locked badges
- Complete actions to unlock more

### 8. Bookmark Path
- Click bookmark icon in header
- Icon should fill/unfill

### 9. Complete Path
- Complete all courses
- Should see: Certificate button
- Click to view certificate

## Common Issues

### Issue: "Not enrolled" error
**Fix**: Make sure to enroll first

### Issue: No course content
**Fix**: Ensure courses have modules/topics/subtopics in database

### Issue: Discussions not loading
**Fix**: Check backend logs for errors

### Issue: Achievements not unlocking
**Fix**: Progress must be saved first, then check achievements

## API Endpoints to Test

```bash
# Get learning path
curl http://localhost:3001/api/learning-paths/:pathId

# Get discussions
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/learning-paths/:pathId/discussions

# Get achievements
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/learning-paths/:pathId/achievements

# Get streak
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/learning-paths/user/streak
```
