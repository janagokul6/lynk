# Engineering rails

Read this before adding features. Prefer structure over comments.

## Layout

```
packages/shared   Zod schemas + shared types (only cross-app contracts)
client            Next.js App Router
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
- External social APIs (YouTube/Meta) run in workers, not request handlers (except thin authenticated proxies if unavoidable).

## Quality

```bash
pnpm check          # typecheck + lint + unit tests
pnpm test:e2e       # Playwright (needs client)
```

CI runs `pnpm check`. Pre-commit runs lint-staged (eslint on staged TS).

Client ESLint starts from `eslint-config-next` with a few legacy UI rules relaxed. Tighten those in focused PRs — do not widen the baseline.

## UI

Reuse `client/src/components/ui/*`. Match existing patterns; do not introduce a second component library.
