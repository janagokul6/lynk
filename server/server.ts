import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { startQueue, stopQueue } from "./lib/queue.js";
import { logger } from "./utils/logger.js";
import { registerCreatorSyncWorker } from "./workers/creator-sync.jobs.js";

async function main(): Promise<void> {
  await startQueue();
  logger.info("pg-boss queue started");
  await registerCreatorSyncWorker();

  app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
    logger.info(`OpenAPI docs: http://localhost:${env.PORT}/api-docs`);
  });
}

main().catch((err) => {
  logger.error("Failed to start server", { error: err });
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down");
  await stopQueue();
  process.exit(0);
});
