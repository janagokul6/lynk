# Lynk

Influencer–brand platform with campaigns, discovery/matching, connections, and agent-ready tools.

## Docs

- [`docs/DECISIONS.md`](docs/DECISIONS.md) — locked stack choices
- [`docs/ENGINEERING.md`](docs/ENGINEERING.md) — module layout + quality rails

## Apps

```
packages/shared   Zod contracts (roles, jobs, tools, match)
client            Next.js (port 43123)
server            Express API (port 43124)
```

## Run

```bash
pnpm install
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
pnpm db:push
pnpm --filter @lynk/server seed   # sample creators for matching
pnpm dev:server
pnpm dev:client
```

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
| Campaigns / marketplace | existing modules |

## Agentic note

Tools are Zod-described in `@lynk/shared` and invoked via `/api/tools`. Domain events (`creator.synced`, `tool.invoked`, …) live on `server/lib/events.ts` for future agent hooks without rewriting HTTP modules.
