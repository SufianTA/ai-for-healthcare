from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db import get_db

router = APIRouter()


@router.get("/global", response_model=list[schemas.LeaderboardEntry])
def global_leaderboard(db: Session = Depends(get_db)):
    """Return top attempts across all users and tasks.

    Results are ordered by score (desc) then time (asc) and capped to the
    fastest/best-scoring attempt per user per task to keep the table concise.
    """

    attempts = (
        db.query(models.Attempt)
        .join(models.User)
        .join(models.Task)
        .order_by(models.Attempt.score.desc(), models.Attempt.time_seconds.asc())
        .all()
    )

    seen_pairs: set[tuple[int, int]] = set()
    leaderboard: list[schemas.LeaderboardEntry] = []

    for attempt in attempts:
        pair = (attempt.user_id, attempt.task_id)
        if pair in seen_pairs:
            continue
        seen_pairs.add(pair)

        leaderboard.append(
            schemas.LeaderboardEntry(
                user_id=attempt.user_id,
                user_email=attempt.user.email,
                task_id=attempt.task_id,
                task_name=attempt.task.name,
                score=attempt.score,
                time_seconds=attempt.time_seconds,
            )
        )

        if len(leaderboard) >= 50:
            break

    return leaderboard

