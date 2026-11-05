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

Set `RESEND_API_KEY` and `MAIL_FROM`, or `SMTP_URL` and `MAIL_FROM`. With neither, the subject is logged. Message bodies are logged only outside production, where they are also kept in memory for `GET /api/dev/mailbox`. That route returns 404 when `NODE_ENV` is `production`. Invite and application emails are capped by `RATE_LIMIT_MAIL_MAX` (default 20 per window).

## Agent memory

The Mastra process stores threads in Postgres (`DATABASE_URL`, schema `mastra`) through `@mastra/pg`.
