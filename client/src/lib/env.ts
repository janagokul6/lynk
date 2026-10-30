import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:43124"),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
