# Lynk — locked technical decisions

Locked 2026-10-30. Change only via explicit decision, not drive-by refactors.

| # | Topic | Choice |
| --- | --- | --- |
| 1 | Monorepo | pnpm workspaces (no Turborepo yet) |
| 2 | Shared contracts | `packages/shared` — Zod + types |
| 3 | Quality gates | typecheck + eslint + tests in CI; husky/lint-staged locally |
| 4 | Tests | Vitest + Playwright |
| 5 | Server shape | `modules/<domain>/` + `policies/` role guards |
| 6 | Comments | almost none; JSDoc only on public shared APIs |
| 7 | Roles | Better Auth + `role`: `brand \| influencer \| admin` |
| 8 | Social | Google for login; Connect YouTube/Instagram for data |
| 9 | Sessions | cookie sessions + credentials |
| 10 | Creators | Postgres sync via pg-boss; APIs only in workers |
| 11 | Match/search | Postgres + pgvector |
| 12 | Files | Cloudflare R2 (S3 API) |
| 13 | Realtime | Socket.IO deferred |
| 14 | Payments | schema-ready only (Stripe Connect / Razorpay later) |
| 15 | Env | Zod on server + typed public client env |
| 16 | API client | Axios + TanStack Query per domain |
| 17 | UI | keep custom `components/ui` |
| 18 | Brand | Lynk (not Influence.AI) |

## Execution waves

1. **Wave 0** — monorepo, shared package, lint/type/test/CI, policies, Socket defer, rebrand, env typing
2. **Wave 1** — roles + guards, Google login wiring, Connect YT/IG token storage
3. **Wave 2** — creator tables, pg-boss sync jobs, pgvector matching primitives
4. **Wave 3** — R2 uploads, payments schema, messaging when needed

## Agentic rails (locked)

| Concern | Choice |
| --- | --- |
| Agent entry | `GET/POST /api/tools` — Zod-described tools, session or `x-agent-key` |
| Jobs | Named payloads in `@lynk/shared` (`jobNames`, `creatorSyncPayloadSchema`) |
| Events | `server/lib/events.ts` domain bus for sync/tool hooks |
| Embeddings | Local deterministic vectors now; swap provider behind `embedText` later |
| Agentic UI | **CopilotKit** over **AG-UI** protocol |
| Agent runtime | **Mastra** (TypeScript); no LangChain / LangGraph |
| Model adapter | AI SDK providers (`@ai-sdk/openai` / Anthropic) via Mastra |
| Domain boundary | Agents call Lynk HTTP tools/services only — never reimplement campaigns/match |
| Long work | Existing **pg-boss** workers |
| Product UX | Signed-in brand and influencer homes are chat-first (`/brand/home`, `/influencer/home`) with a dashboard toggle. `user.plan` is `free` or `pro` (default free) and gates the wide side-by-side layout. `/agent` remains the brand chat shell. Billing is later. |

### Slice plan

1. **Slice 1 (now)** — `packages/agent` brand agent + CopilotKit chat + `creators.match` generative results
2. **Slice 2** — campaign draft + ROI tools in Mastra workflows
3. **Slice 3** — influencer agent allowlist + more generative surfaces

Chat-first homes (`/brand/home`, `/influencer/home`), the influencer agent, shortlist, ROI estimate, and campaign draft/publish confirmation shipped on top of Slice 1. Conversation threads are not persisted yet.
