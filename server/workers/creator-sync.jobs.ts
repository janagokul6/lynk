import { creatorSyncPayloadSchema, jobNames } from "@lynk/shared";
import { ensureQueue, work } from "../lib/queue.js";
import { logger } from "../utils/logger.js";
import { syncCreator } from "../modules/creators/creators.service.js";

export async function registerCreatorSyncWorker(): Promise<void> {
  await ensureQueue(jobNames.creatorSync);
  await work(jobNames.creatorSync, async (jobs) => {
    for (const job of jobs) {
      const parsed = creatorSyncPayloadSchema.safeParse(job.data);
      if (!parsed.success) {
        logger.warn("invalid creator.sync payload", { data: job.data });
        continue;
      }
      const row = await syncCreator(parsed.data);
      logger.info("creator.sync completed", {
        platform: parsed.data.platform,
        externalId: parsed.data.externalId,
        creatorId: row?.id ?? null,
      });
    }
  });
}
