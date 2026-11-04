import { z } from "zod";

export const campaignStatusSchema = z.enum(["draft", "live", "completed"]);
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;
