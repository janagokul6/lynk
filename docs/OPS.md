# Operations

## Database backup

`scripts/backup-db.sh` writes a custom-format `pg_dump` of `DATABASE_URL`.

```bash
DATABASE_URL=postgresql://lynk:lynk@127.0.0.1:5432/lynk ./scripts/backup-db.sh ./backups
pg_restore --dbname "$DATABASE_URL" --clean --if-exists ./backups/lynk-YYYYMMDDTHHMMSSZ.dump
```

Run it on a schedule from the host that can reach Postgres. The script does not upload the file.

## Errors

Set `SENTRY_DSN` on the API to send unhandled request errors. Leave it unset and the reporter does nothing.

## Mail

Set `RESEND_API_KEY` and `MAIL_FROM`, or `SMTP_URL` and `MAIL_FROM`. With neither, the subject is logged. Message bodies are logged only outside production. `GET /api/dev/mailbox` keeps recent mail in memory only when `NODE_ENV` is not `production` and no mail transport is set, and it answers only requests from the same machine (loopback). Always set `NODE_ENV=production` on deployed servers, because the default is `development`. Invite and application emails are capped by `RATE_LIMIT_MAIL_MAX` (default 20 per window).

## Agent memory

The Mastra process stores threads in Postgres (`DATABASE_URL`, schema `mastra`) through `@mastra/pg`.
