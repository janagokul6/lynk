import { ensureQueue, work } from "../lib/queue.js";
import { logger } from "../utils/logger.js";

export const CREATOR_SYNC_JOB = "creator.sync";

export async function registerCreatorSyncWorker(): Promise<void> {
  await ensureQueue(CREATOR_SYNC_JOB);
  await work<{ platform: "youtube" | "instagram"; externalId: string }>(
    CREATOR_SYNC_JOB,
    async (jobs) => {
      for (const job of jobs) {
        logger.info("creator sync job received", {
          platform: job.data.platform,
          externalId: job.data.externalId,
        });
      }
    }
  );
}
