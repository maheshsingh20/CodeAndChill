# Real-Time Chat System

## Overview
A complete real-time chat system built with WebSocket (Socket.IO) that allows users to communicate with each other instantly.

## Features

### ✅ Real-Time Messaging
- Instant message delivery using WebSocket
- Message read receipts
- Typing indicators
- Online/offline status

### ✅ User Interface
- Modern gradient design matching the project theme
- Chat list with unread message counts
- Search users to start new conversations
- Message history with timestamps
- Responsive design for all devices

### ✅ Backend Features
- WebSocket server with Socket.IO
- MongoDB storage for chat history
- User authentication with JWT
- Online user tracking
- Message persistence

## Technical Stack

### Backend
- **WebSocket**: Socket.IO for real-time communication
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **API**: RESTful endpoints for chat operations

### Frontend
- **WebSocket Client**: socket.io-client
- **UI**: React with Tailwind CSS
- **State Management**: React hooks
- **Animations**: Framer Motion

## API Endpoints

### HTTP Endpoints
- `GET /api/chat/chats` - Get all chats for current user
- `POST /api/chat/chats/direct` - Create or get direct chat with another user
- `GET /api/chat/chats/:chatId` - Get chat by ID with messages
- `GET /api/chat/users/search?query=` - Search users to start chat
- `GET /api/chat/users/online` - Get list of online users
- `DELETE /api/chat/chats/:chatId` - Delete a chat

### WebSocket Events

#### Client → Server
- `authenticate` - Authenticate user with JWT token
- `chat:join` - Join a chat room
- `chat:leave` - Leave a chat room
- `message:send` - Send a message
- `message:read` - Mark messages as read
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

#### Server → Client
- `message:new` - New message received
- `message:read` - Messages marked as read
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `user:online` - User came online
- `user:offline` - User went offline

## Usage

### Accessing Chat
1. **From Navigation Bar**: Click "Chat" in the main navigation
2. **From Quick Access**: Click "Chat" card on the homepage
3. **Direct URL**: Navigate to `/chat`

### Starting a Conversation
1. Use the search box to find users by name or email
2. Click on a user from search results
3. Start typing your message

### Features in Chat
- **Send Messages**: Type and press Enter or click Send button
- **View Online Status**: Green dot indicates online users
- **Typing Indicators**: See when others are typing
- **Read Receipts**: Messages marked as read automatically
- **Delete Chats**: Click trash icon to delete conversations

## Database Schema

### Chat Model
```typescript
{
  participants: ObjectId[],
  participantDetails: [{
    userId: ObjectId,
    name: string,
    avatar?: string,
    lastSeen?: Date,
    isOnline?: boolean
  }],
  messages: [{
    senderId: ObjectId,
    senderName: string,
    senderAvatar?: string,
    content: string,
    timestamp: Date,
    read: boolean,
    type: 'text' | 'image' | 'file',
    fileUrl?: string,
    fileName?: string
  }],
  lastMessage?: string,
  lastMessageTime?: Date,
  unreadCount: Map<string, number>,
  isGroup: boolean,
  groupName?: string,
  groupAvatar?: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Files Created/Modified

### Backend
- `Backend/server/src/models/Chat.ts` - Chat and message models
- `Backend/server/src/services/chatService.ts` - WebSocket service
- `Backend/server/src/routes/chat.ts` - HTTP API routes
- `Backend/server/src/server.ts` - WebSocket initialization
- `Backend/server/src/routes/index.ts` - Route registration

### Frontend
- `codeandchill/src/pages/ChatPage.tsx` - Main chat interface
- `codeandchill/src/services/chatService.ts` - WebSocket client service
- `codeandchill/src/pages/index.ts` - Page exports
- `codeandchill/src/App.tsx` - Route configuration
- `codeandchill/src/components/dashboard/Navbar.tsx` - Navigation link
- `codeandchill/src/components/dashboard/QuickAccessSection.tsx` - Quick access card

## Configuration

### Environment Variables
No additional environment variables required. Uses existing:
- `JWT_SECRET` - For authentication
- `MONGODB_URI` - For database connection

### Ports
- Backend: `http://localhost:3001`
- WebSocket: Same port as backend (Socket.IO)
- Frontend: `http://localhost:5173`

## Security Features
- JWT authentication for all operations
- User authorization checks
- Participant validation
- Secure WebSocket connections
- XSS protection with content sanitization

## Future Enhancements
- [ ] Group chats
- [ ] File/image sharing
- [ ] Voice messages
- [ ] Video calls
- [ ] Message reactions
- [ ] Message editing/deletion
- [ ] Chat encryption
- [ ] Push notifications
- [ ] Message search
- [ ] Chat archiving

## Testing
1. Open two browser windows/tabs
2. Login with different users
3. Search for each other
4. Start chatting
5. Test typing indicators, online status, and real-time messaging

## Troubleshooting

### WebSocket Connection Issues
- Check if backend is running on port 3001
- Verify JWT token is valid
- Check browser console for errors
- Ensure CORS is properly configured

### Messages Not Sending
- Verify user is authenticated
- Check if chat room is joined
- Ensure WebSocket connection is active
- Check backend logs for errors

### Online Status Not Updating
- Verify WebSocket connection
- Check if authentication was successful
- Ensure user events are being emitted

## Support
For issues or questions, check the backend logs and browser console for detailed error messages.
