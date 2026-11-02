import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:43124"),
  NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL: z
    .string()
    .url()
    .default("http://127.0.0.1:43126/copilotkit"),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL: process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL,
});
