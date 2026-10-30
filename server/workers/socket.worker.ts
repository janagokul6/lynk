import { createServer } from "http";
import { Server } from "socket.io";
import { parentPort, workerData } from "worker_threads";

const port: number = workerData.port;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: true },
});

io.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    console.log(`[Socket.IO worker] Client disconnected: ${reason}`);
  });
});

httpServer.listen(port, () => {
  console.log(`[Socket.IO worker] Listening on port ${port}`);
  parentPort?.postMessage({ type: "ready", port });
});
