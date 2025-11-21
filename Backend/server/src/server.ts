import server from "./app";
import { startContestScheduler } from "./utils/contestScheduler";

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 WebSocket server ready for collaborative coding`);
  
  // Start contest status scheduler
  startContestScheduler();
});