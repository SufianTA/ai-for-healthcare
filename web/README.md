# SurgiTrack Web

A minimal Next.js App Router front end that consumes the SurgiTrack FastAPI backend.

## Getting started

```bash
cd web
cp .env.example .env.local   # or .env
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to point at your FastAPI instance (default `http://localhost:8000`).

## Pages

- `/` — hero card
- `/tasks` — fetches tasks from the API
- `/tasks/[slug]` — client-side timer + attempt submission (requires stored token)
- `/login` — saves access token from `/auth/login` into `localStorage`
- `/dashboard` — renders `/attempts/me/summary` for the logged-in user
