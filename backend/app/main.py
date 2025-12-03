from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from .routes import auth, tasks, attempts, error_types, leaderboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SurgiTrack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(attempts.router, prefix="/attempts", tags=["attempts"])
app.include_router(error_types.router, prefix="/error-types", tags=["error-types"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["leaderboard"])


@app.get("/")
def root():
    return {"status": "ok"}
