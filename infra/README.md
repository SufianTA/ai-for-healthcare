# SurgiTrack Infra

This guide walks through hosting the FastAPI backend, Postgres, and Next.js web
app. Use it as a starting point for local Compose runs, hobby cloud hosting, or
production-style deployments.

## 1) Core services

* Backend: FastAPI app in `backend/` (Uvicorn)
* Database: Postgres (or SQLite for quick demos)
* Web: Next.js app in `web/` (Vercel-ready)

### Environment variables

Backends and frontends must agree on API and auth settings.

* Backend (`backend/.env`):
  * `DATABASE_URL=postgresql://postgres:postgres@db:5432/surgitrack`
  * `JWT_SECRET` (generate a strong secret)
  * `JWT_ALGORITHM=HS256`
  * `JWT_EXPIRE_MINUTES=60`
* Web (`web/.env.local`):
  * `NEXT_PUBLIC_API_BASE_URL` (e.g., `http://localhost:8000` or your public API URL)

### Seed initial data

Run once after the database is reachable:

```bash
cd backend
python -m app.seed
```

## 2) Local hosting with Docker Compose

The root `docker-compose.yml` brings up Postgres and the API together.

```bash
docker-compose up --build
```

This publishes the API at `http://localhost:8000`. To add the web UI locally:

```bash
cd web
cp .env.example .env.local
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" >> .env.local
npm install
npm run dev  # visit http://localhost:3000
```

## 3) Cloud hosting options

### Render / Fly.io / Railway (API + Postgres)

* Provision a managed Postgres instance and copy its URL into `DATABASE_URL`.
* Build and run the backend container image (Dockerfile lives in `backend/`). Example Render/Fly command:

  ```bash
  docker build -t surgitrack-api backend
  ```

  Then deploy the image or point the platform to `backend/Dockerfile`.
* Set env vars (`DATABASE_URL`, `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRE_MINUTES`).
* On first deploy, run the seed task as a one-off job:

  ```bash
  python -m app.seed
  ```

### Vercel / Netlify (Next.js web)

* Connect the repo and set `NEXT_PUBLIC_API_BASE_URL` to your public API URL.
* Vercel auto-detects Next.js; Netlify can run `npm install` then `npm run build`.
* For preview environments, point `NEXT_PUBLIC_API_BASE_URL` at a staging API.

## 4) Production hardening checklist

* Add HTTPS in front of the API (Vercel/Render provide TLS by default; otherwise
  terminate TLS at a reverse proxy like Nginx or Traefik).
* Rotate `JWT_SECRET`, restrict `ALLOWED_ORIGINS`/CORS, and enforce strong
  passwords.
* Use managed Postgres with automated backups and monitoring.
* Move file uploads to object storage (S3/Cloudflare R2) and configure a CDN if
  you enable video attachments.
* Add observability: health checks, structured logs, and metrics.
* Run the backend with process managers (Gunicorn/Uvicorn workers) behind a load
  balancer for multi-instance scaling.

## 5) Quick smoke test commands

After deployment, verify the API and web app:

* API health: `curl https://<api-host>/docs` (should return the OpenAPI UI)
* Tasks loaded: `curl https://<api-host>/tasks | head`
* Web UI: visit `https://<web-host>/tasks` and confirm the task list renders.
