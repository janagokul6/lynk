# Lynk

Influencer–brand connecting platform: discovery, campaigns, marketplace, and ROI tooling.

## Decisions & rails

- Locked stack choices: [`docs/DECISIONS.md`](docs/DECISIONS.md)
- How to add code safely: [`docs/ENGINEERING.md`](docs/ENGINEERING.md)

## Monorepo

```
packages/shared   Zod contracts + shared types
client            Next.js app
server            Express API + Drizzle + Better Auth + pg-boss
```

Package manager: **pnpm workspaces**.

## Quick start

```bash
pnpm install

# Postgres (Docker under server/ or local). Then:
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
pnpm db:push

pnpm dev:server   # default docs: /api-docs
pnpm dev:client   # http://localhost:43123
```

## Quality gates

```bash
pnpm check        # typecheck + lint + unit tests
pnpm test:e2e     # Playwright (client running)
```

CI runs `pnpm check` on every push/PR. Husky + lint-staged run eslint on staged TS files.

## Stack snapshot

| Layer | Choice |
| --- | --- |
| Web | Next.js, React 19, Tailwind 4, TanStack Query, Zustand, Axios |
| API | Express 5, Zod, Better Auth (cookies), Drizzle, Postgres, pg-boss |
| Match | Creator sync jobs + pgvector |
| Files | Cloudflare R2 (S3 API) |
| Pay | Schema-ready; Stripe Connect / Razorpay later |
