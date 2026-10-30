# Lynk Backend

Production-ready Express + TypeScript backend with PostgreSQL, Drizzle, Better Auth, OpenAPI docs, Winston logging, pg-boss queues, and PostgreSQL-backed caching.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Auth**: Better Auth (email/password, sessions)
- **Validation**: Zod
- **API Docs**: OpenAPI 3.x + Scalar
- **Logging**: Winston
- **Queue**: pg-boss
- **Security**: helmet, express-rate-limit

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values. Required:
   - `DATABASE_URL` – PostgreSQL connection string
   - `BETTER_AUTH_SECRET` – At least 32 characters (e.g. `openssl rand -base64 32`)

3. **Database migrations**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

   For development, you can use `npm run db:push` to sync schema without migration files.

4. **Run development server**

   ```bash
   npm run dev
   ```

## Scripts

| Script              | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start dev server with tsx watch |
| `npm run build`     | Compile TypeScript              |
| `npm run start`     | Run compiled server             |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate`  | Apply migrations             |
| `npm run db:studio`   | Open Drizzle Studio         |
| `npm run db:push`     | Push schema (dev sync)       |

## API

- **Health**: `GET /api/health`
- **Session**: `GET /api/me` (requires auth)
- **Auth**: `POST /api/auth/*` (Better Auth handlers)
- **Docs**: `GET /api-docs`

## Project Structure

```
lynk/server/
├── config/       # Env, OpenAPI
├── db/           # Drizzle schema
├── drizzle/      # Generated migrations
├── lib/          # DB client, auth, cache, queue
├── middleware/   # Error, logger, validate, rateLimit
├── modules/      # Health, auth
├── types/
├── utils/        # Logger
├── app.ts
├── server.ts
├── openapi.yaml
├── package.json
└── tsconfig.json
```
