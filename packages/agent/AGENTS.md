# @lynk/agent

Mastra brand agent + CopilotKit AG-UI runtime for Lynk.

- Entry: `src/mastra/index.ts` (port **43126**, route `/copilotkit`)
- Domain tools call Lynk `POST /api/tools/:name` via `src/lynk-client.ts` (`x-agent-key`)
- Do not reimplement match/campaign logic here — extend server `modules/tools` first
- Set `OPENAI_API_KEY` for live LLM; without it the runtime still starts
