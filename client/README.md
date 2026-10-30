# Lynk Client

Next.js frontend with TypeScript, Tailwind CSS, TanStack Query, Zustand, and more.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (variable-based colors)
- Axios, Zod, react-hook-form, TanStack Query, Zustand
- Geist font, lucide-react, react-hot-toast

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Scripts

| Script        | Description          |
| ------------- | -------------------- |
| `npm run dev` | Start dev server     |
| `npm run build` | Build for production |
| `npm run start` | Run production build |

## Project Structure

```
client/
├── src/
│   ├── app/           # App Router pages, layout
│   ├── components/    # UI, forms
│   ├── hooks/         # Custom hooks
│   ├── lib/           # API, utils
│   └── stores/        # Zustand stores
├── public/
└── ...
```

## Environment

- `NEXT_PUBLIC_API_URL` — Backend API URL (default: http://localhost:3000)
