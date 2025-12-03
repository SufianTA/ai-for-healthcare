# SurgiTrack Monorepo

This repository contains a deployable FastAPI backend, a polished Next.js front end, and a ready-to-build
Expo mobile client. Use it to track surgical training attempts, score them against standards, and review
progress via dashboards and leaderboards.

## Repository structure

```
backend/        # FastAPI service with Postgres/SQLite support
web/            # Next.js app that consumes the API
mobile/         # Expo app with login, dashboard, tasks, attempts, leaderboard
vr/             # Unity/VR integration placeholder
infra/          # Deployment notes
README.md       # This guide
```

## Backend (FastAPI + Postgres)

Implements auth, task catalog, error taxonomy, attempt scoring, user summaries, video attachment, and a
global leaderboard.

### Setup

1. (Optional) create a virtual environment.

   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` (or export vars):

   ```bash
   export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/surgitrack
   export JWT_SECRET=change-me
   export JWT_ALGORITHM=HS256
   export JWT_EXPIRE_MINUTES=60
   ```

4. Seed starter data (12 tasks with descriptions/standards and error types):

   ```bash
   python -m app.seed
   ```

5. Run the API:

   ```bash
   uvicorn app.main:app --reload
   ```

   OpenAPI docs: `http://localhost:8000/docs`.

### Key endpoints

* Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
* Tasks: `GET /tasks`, `GET /tasks/{slug}`, `GET /tasks/{task_id}/standards`
* Errors: `GET /error-types`
* Attempts: `POST /attempts`, `GET /attempts/me`, `GET /attempts/me/summary`, `POST /attempts/{id}/video`
* Leaderboard: `GET /leaderboard/global`

### Docker and Compose

* Build/run the API container:

  ```bash
  cd backend
  docker build -t surgitrack-api .
  docker run -p 8000:8000 --env-file .env.example surgitrack-api
  ```

* Bring up Postgres + API together:

  ```bash
  docker-compose up --build
  ```

## Web (Next.js)

Located in `web/`. Provides a refined UI with auth (login/register), task browsing, attempt logging with a
live timer, dashboards, and a global leaderboard.

```bash
cd web
cp .env.example .env.local   # or .env
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to your API host (defaults to `http://localhost:8000`).

### Pages

* `/` – marketing hero + feature highlights
* `/login` and `/register` – account management with token storage
* `/tasks` and `/tasks/[slug]` – catalog plus timer/error checklist and attempt submission
* `/dashboard` – proficiency progress, highlights, and per-task metrics
* `/leaderboard` – top attempts ordered by score/time

## Mobile, VR, Infra directories

These folders mirror the playbook for future work:

* `mobile/` — Expo app with auth, dashboard, tasks, attempts, and leaderboard ready to point at your API. Copy `.env.example` to `.env` and configure `EXPO_PUBLIC_API_BASE_URL` (or edit `app.json` `extra.apiBase`), run `npm install`, and `npm start` to develop. Use `eas build -p android` when you are ready for a Play Console upload.
* `vr/` — Unity/VR integration placeholder
* `infra/` — hosting and operations docs

## Roadmap

* Harden auth (refresh tokens, password reset) and tighten CORS origins.
* Replace local file uploads with S3/Cloudflare storage.
* Expand the web UI with richer dashboards and leaderboard filters.
* Add background AI analysis worker for video insights.
