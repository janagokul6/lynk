# Lynk server

Express 5 API (port 43124). PostgreSQL, Drizzle, Better Auth, pg-boss.

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm --filter @lynk/server dev
```

Docs: `GET /api-docs`. Module layout is in [`docs/ENGINEERING.md`](../docs/ENGINEERING.md).

The `cache`, `payout_account`, and `payment_intent` tables are in the schema for later work. Nothing in the HTTP app reads them yet.
