# Engineering rails

Read this before adding features. Prefer structure over comments.

## Layout

```
packages/shared   Zod schemas + shared types (only cross-app contracts)
packages/agent    Mastra agents + Lynk tool wrappers (AG-UI via CopilotKit route)
client            Next.js App Router + CopilotKit chat (`/agent`)
server
  modules/<domain>/   routes → controller → service → validation
  policies/           authz guards (requireSession, requireRole)
  lib/                infra (db, auth, queue, cache, storage)
  workers/            background jobs only (no HTTP)
```

## Rules

- New domain = new `modules/<name>/` with the four files above (skip empty ones).
- Validation lives in Zod (`packages/shared` if client needs it too; else module validation).
- Authorization only via `policies/*` — never ad-hoc role checks in controllers.
- No AI-style filler comments. Name things clearly instead.
- Do not add dependencies without a decision note if they replace a locked choice.
- Socket.IO stays off the boot path until messaging is in scope.
- External social APIs (YouTube/Meta) run in providers + workers; HTTP handlers call services only.
- Agent-facing capabilities go through `modules/tools` with `requireAgentOrSession` (session cookie or `x-agent-key`).
- New LLM/agent behavior lives in `packages/agent` (Mastra on port 43126). UI chat lives under `client` with CopilotKit (`/agent`).
- Generative UI for tools belongs next to the chat surface (`client/src/components/agent/*`), not inside Mastra.
- Prefer extending an existing module over adding a new top-level folder.

## Quality

```bash
pnpm check          # typecheck + lint + unit tests
pnpm test:e2e       # Playwright (needs client)
```

CI runs `pnpm check`. Pre-commit runs lint-staged (eslint on staged TS).

Client ESLint starts from `eslint-config-next` with a few legacy UI rules relaxed. Tighten those in focused PRs — do not widen the baseline.

## UI

Reuse `client/src/components/ui/*`. Match existing patterns; do not introduce a second component library.
