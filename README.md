# Lynk

Influencer–brand platform with campaigns, discovery/matching, connections, and an AG-UI brand agent.

## Docs

- [`docs/DECISIONS.md`](docs/DECISIONS.md) — locked stack choices
- [`docs/ENGINEERING.md`](docs/ENGINEERING.md) — module layout + quality rails

## Apps

```
packages/shared   Zod contracts (roles, jobs, tools, match)
packages/agent    Mastra brand agent + CopilotKit AG-UI route (port 43126)
client            Next.js (port 43123) — chat at /agent
server            Express API (port 43124)
```

## Run

```bash
pnpm install
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
cp packages/agent/.env.example packages/agent/.env
# set OPENAI_API_KEY in packages/agent/.env (live chat)
# AGENT_API_KEY must match between server/.env and packages/agent/.env

pnpm db:push
pnpm --filter @lynk/server seed

# all three (or run the filters separately)
pnpm dev
# pnpm dev:server   # :43124
# pnpm dev:agent    # :43126 Mastra + /copilotkit
# pnpm dev:client   # :43123
```

Open [http://127.0.0.1:43123/agent](http://127.0.0.1:43123/agent).

## Quality

```bash
pnpm check      # typecheck + lint + unit tests
pnpm test:e2e   # Playwright
```

## API map

| Area | Routes |
| --- | --- |
| Auth | Better Auth `/api/auth/*`, `GET /api/me`, `PATCH /api/me/role` |
| Discovery | `GET /api/discovery/suggestions`, `GET /api/discovery/search` |
| Creators | `GET /api/creators/match`, `POST /api/creators/sync` |
| Connections | `GET/POST /api/connections`, `DELETE /api/connections/:platform` |
| Storage | `POST /api/storage/sign` (+ local upload fallback or R2) |
| Tools (agents) | `GET /api/tools`, `POST /api/tools/:name` (`x-agent-key` or session) |
| AG-UI | Mastra `/copilotkit` (CopilotKit runtime) |

## Agentic stack

- **UI:** CopilotKit (AG-UI protocol) at `/agent`
- **Runtime:** Mastra brand agent in `packages/agent`
- **Domain:** tools call existing Lynk `/api/tools` (no duplicated business logic)
