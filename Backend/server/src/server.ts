import server from "./app";
import { startContestScheduler } from "./utils/contestScheduler";
import { chatService } from "./services/chatService";

const PORT = process.env.PORT || 3001;

const httpServer = server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  // Initialize WebSocket for chat
  chatService.initialize(httpServer);
  console.log(`💬 WebSocket chat server initialized`);
  
  // Start contest status scheduler
  startContestScheduler();
});