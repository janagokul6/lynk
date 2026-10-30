# Lynk

Influencer–brand connecting platform: AI-assisted discovery, campaigns, marketplace, and ROI tooling.

Synced from [janagokul6/lynk](https://github.com/janagokul6/lynk).

## Stack

| Layer | Tech |
| --- | --- |
| **Client** | Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query, Zustand |
| **Server** | Express, TypeScript, PostgreSQL, Drizzle ORM, Better Auth, Socket.IO, pg-boss |
| **Docs** | OpenAPI + Scalar at `/api-docs` |

## Roles & surfaces

- **Public** — landing, pricing, FAQ, marketplace
- **Brand** — onboarding, discovery, campaigns, applications, shortlist, ROI calculator, messages
- **Influencer** — dashboard, profile, media kit, wallet
- **Admin** — verification queue, user management, fraud control

## Quick start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or `docker compose` under `server/`)

### Database

```bash
cd server
# with Docker:
docker compose up -d

# or local Postgres with user/db `lynk` / password `lynk`
cp .env.example .env   # set DATABASE_URL + BETTER_AUTH_SECRET
npm install
npm run db:push        # or db:migrate
```

### API

```bash
cd server
npm run dev
# default http://localhost:3000 — OpenAPI at /api-docs
```

### Web app

```bash
cd client
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev
```

## Repo layout

```
client/   Next.js frontend
server/   Express API, Drizzle schema, workers
```

## API highlights

- `GET /api/health`
- `POST /api/auth/*` — Better Auth
- `GET /api/me` — session
- `/api/discovery`, `/api/campaigns`, `/api/marketplace`
