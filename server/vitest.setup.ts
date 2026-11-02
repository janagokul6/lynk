import { config } from "dotenv";

config({ path: ".env" });

process.env.DATABASE_URL ??= "postgresql://lynk:lynk@127.0.0.1:5432/lynk";
process.env.BETTER_AUTH_SECRET ??= "lynk-test-better-auth-secret-32chars";
process.env.AGENT_API_KEY ??= "lynk-dev-agent-key-16";
