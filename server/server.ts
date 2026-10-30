import "dotenv/config";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import app from "./app.js";
import { env } from "./config/env.js";
import { startQueue, stopQueue } from "./lib/queue.js";
import { logger } from "./utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getSocketWorkerPath(): string {
  const nextToServer = join(__dirname, "workers", "socket.worker.js");
  if (existsSync(nextToServer)) return nextToServer;
  return join(process.cwd(), "dist", "workers", "socket.worker.js");
}

let socketWorker: Worker | null = null;

async function main(): Promise<void> {
  await startQueue();
  logger.info("pg-boss queue started");

  app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
    logger.info(`OpenAPI docs: http://localhost:${env.PORT}/api-docs`);

    const workerPath = getSocketWorkerPath();
    if (!existsSync(workerPath)) {
      logger.warn(`Socket.IO worker script not found at ${workerPath} (run build first)`);
      return;
    }
    socketWorker = new Worker(workerPath, {
      workerData: { port: env.SOCKET_IO_PORT },
    });
    socketWorker.on("message", (msg: { type: string; port?: number }) => {
      if (msg.type === "ready" && msg.port != null) {
        logger.info(`Socket.IO worker listening on port ${msg.port}`);
      }
    });
    socketWorker.on("error", (err) => {
      logger.error("Socket.IO worker error", { error: err });
    });
    socketWorker.on("exit", (code) => {
      if (code !== 0) logger.warn(`Socket.IO worker exited with code ${code}`);
    });
  });
}

main().catch((err) => {
  logger.error("Failed to start server", { error: err });
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down");
  if (socketWorker) {
    await socketWorker.terminate();
    socketWorker = null;
  }
  await stopQueue();
  process.exit(0);
});
