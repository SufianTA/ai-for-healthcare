from collections import Counter

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db import get_db
from ..security import get_current_user

router = APIRouter()


def score_attempt(time_seconds: int, standard: models.TaskStandard, error_types: list[models.ErrorType]):
    score = 100
    extra_seconds = max(0, time_seconds - standard.target_time_seconds)
    score -= min(40, extra_seconds)

    severity_counts = Counter(err.severity for err in error_types)
    minor_errors = severity_counts.get("minor", 0)
    major_errors = severity_counts.get("major", 0)
    critical_errors = severity_counts.get("critical", 0)

    score -= minor_errors * 5
    score -= major_errors * 15

    if critical_errors > 0:
        score = min(score, 60)
        proficiency = False
    else:
        proficiency = (
            time_seconds <= standard.target_time_seconds
            and minor_errors <= standard.max_minor_errors
            and major_errors <= standard.max_major_errors
        )
    score = max(score, 0)
    return score, proficiency


@router.post("/", response_model=schemas.AttemptOut, status_code=status.HTTP_201_CREATED)
def create_attempt(
    payload: schemas.AttemptCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.Task).filter(models.Task.id == payload.task_id).first()
    standard = db.query(models.TaskStandard).filter(models.TaskStandard.id == payload.standard_id).first()
    if not task or not standard:
        raise HTTPException(status_code=404, detail="Task or standard not found")
    if standard.task_id != task.id:
        raise HTTPException(status_code=400, detail="Standard does not belong to task")

    started_at = payload.started_at
    ended_at = payload.ended_at
    if ended_at <= started_at:
        raise HTTPException(status_code=400, detail="ended_at must be after started_at")

    time_seconds = int((ended_at - started_at).total_seconds())

    error_type_ids = [err.error_type_id for err in payload.errors]
    error_types = (
        db.query(models.ErrorType)
        .filter(models.ErrorType.id.in_(error_type_ids))
        .all()
        if error_type_ids
        else []
    )

    score, proficiency = score_attempt(time_seconds, standard, error_types)

    attempt = models.Attempt(
        user_id=current_user.id,
        task_id=task.id,
        standard_id=standard.id,
        started_at=started_at,
        ended_at=ended_at,
        time_seconds=time_seconds,
        score=score,
        proficiency=proficiency,
    )
    db.add(attempt)
    db.flush()

    for err in error_types:
        db.add(models.AttemptError(attempt_id=attempt.id, error_type_id=err.id))

    db.commit()
    db.refresh(attempt)
    return schemas.AttemptOut(
        id=attempt.id,
        task_id=attempt.task_id,
        standard_id=attempt.standard_id,
        started_at=attempt.started_at,
        ended_at=attempt.ended_at,
        time_seconds=attempt.time_seconds,
        score=attempt.score,
        proficiency=attempt.proficiency,
        errors=error_types,
    )


@router.get("/me", response_model=list[schemas.AttemptOut])
def list_my_attempts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    attempts = db.query(models.Attempt).filter(models.Attempt.user_id == current_user.id).all()
    results = []
    for attempt in attempts:
        errors = [ae.error_type for ae in attempt.errors]
        results.append(
            schemas.AttemptOut(
                id=attempt.id,
                task_id=attempt.task_id,
                standard_id=attempt.standard_id,
                started_at=attempt.started_at,
                ended_at=attempt.ended_at,
                time_seconds=attempt.time_seconds,
                score=attempt.score,
                proficiency=attempt.proficiency,
                errors=errors,
            )
        )
    return results


@router.get("/me/summary", response_model=schemas.UserSummary)
def user_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tasks = db.query(models.Task).all()
    task_details = []
    proficient_tasks = 0

    for task in tasks:
        attempts = (
            db.query(models.Attempt)
            .filter(models.Attempt.user_id == current_user.id, models.Attempt.task_id == task.id)
            .all()
        )
        if attempts:
            best_time = min(a.time_seconds for a in attempts)
            best_score = max(a.score for a in attempts)
            if any(a.proficiency for a in attempts):
                proficient_tasks += 1
        else:
            best_time = None
            best_score = None
        task_details.append(
            schemas.UserTaskSummary(
                task_id=task.id,
                task_name=task.name,
                best_time_seconds=best_time,
                best_score=best_score,
            )
        )

    return schemas.UserSummary(
        proficient_tasks=proficient_tasks,
        total_tasks=len(tasks),
        task_details=task_details,
    )


@router.post("/{attempt_id}/video", status_code=status.HTTP_201_CREATED)
def attach_video(
    attempt_id: int,
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    attempt = (
        db.query(models.Attempt)
        .filter(models.Attempt.id == attempt_id, models.Attempt.user_id == current_user.id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    storage_path = f"videos/{attempt_id}_{file.filename}"
    with open(storage_path, "wb") as f:
        f.write(file.file.read())

    video = models.Video(attempt_id=attempt.id, storage_url=storage_path)
    db.add(video)
    db.commit()
    return {"attempt_id": attempt.id, "video_url": storage_path}
