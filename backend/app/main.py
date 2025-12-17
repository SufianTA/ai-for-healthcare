import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from .routes import auth, tasks, attempts, error_types, leaderboard
from . import seed

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SurgiTrack API")

# Allow explicit origins (needed when allow_credentials=True).
default_origins = [
    # Local dev
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    # Render deployments (frontend)
    "https://surgitrack-web.onrender.com",
    "https://surgitrack-web-l0vc.onrender.com",
]
env_origins = os.getenv("CORS_ALLOW_ORIGINS")
allow_origins = [o.strip() for o in env_origins.split(",")] if env_origins else default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(attempts.router, prefix="/attempts", tags=["attempts"])
app.include_router(error_types.router, prefix="/error-types", tags=["error-types"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["leaderboard"])


@app.on_event("startup")
def run_seed() -> None:
    # Ensure demo data exists in SQLite even without shell access.
    seed.seed()


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/health")
def health():
    # Lightweight readiness endpoint for Render health checks.
    return {"status": "ok"}
