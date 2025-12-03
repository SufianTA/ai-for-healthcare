"""Seed the SurgiTrack database with initial tasks, standards, and error types."""
from sqlalchemy.orm import Session

from .db import Base, engine, SessionLocal
from . import models

TASKS = [
    {
        "name": "Instrument Tie",
        "slug": "instrument-tie",
        "category": "suturing",
        "description": "Practice instrument ties with even throws and stable needle angles.",
        "standard": {"target_time_seconds": 180, "max_minor_errors": 2, "max_major_errors": 0},
    },
    {
        "name": "One-Handed Knot",
        "slug": "one-handed-knot",
        "category": "suturing",
        "description": "Fundamental knot using single-hand technique and precise wrist turns.",
        "standard": {"target_time_seconds": 210, "max_minor_errors": 2, "max_major_errors": 0},
    },
    {
        "name": "Two-Handed Knot",
        "slug": "two-handed-knot",
        "category": "suturing",
        "description": "Alternate hands to form secure square knots with minimal slack.",
        "standard": {"target_time_seconds": 200, "max_minor_errors": 2, "max_major_errors": 0},
    },
    {
        "name": "Running Suture",
        "slug": "running-suture",
        "category": "suturing",
        "description": "Continuous suture with consistent bites and tension control.",
        "standard": {"target_time_seconds": 240, "max_minor_errors": 3, "max_major_errors": 0},
    },
    {
        "name": "Figure Eight",
        "slug": "figure-eight",
        "category": "suturing",
        "description": "Secure figure-eight stitch for hemostasis and reinforcement.",
        "standard": {"target_time_seconds": 210, "max_minor_errors": 2, "max_major_errors": 0},
    },
    {
        "name": "Vertical Mattress",
        "slug": "vertical-mattress",
        "category": "suturing",
        "description": "Deep and superficial bites to optimize eversion and skin approximation.",
        "standard": {"target_time_seconds": 240, "max_minor_errors": 2, "max_major_errors": 1},
    },
    {
        "name": "Horizontal Mattress",
        "slug": "horizontal-mattress",
        "category": "suturing",
        "description": "Wide bites to relieve tension around the wound edge.",
        "standard": {"target_time_seconds": 240, "max_minor_errors": 2, "max_major_errors": 1},
    },
    {
        "name": "Deep Dermal",
        "slug": "deep-dermal",
        "category": "suturing",
        "description": "Buried stitch maintaining dermal alignment without surface knots.",
        "standard": {"target_time_seconds": 300, "max_minor_errors": 3, "max_major_errors": 1},
    },
    {
        "name": "Donati",
        "slug": "donati",
        "category": "suturing",
        "description": "Far-far/near-near pattern for high-tension closures.",
        "standard": {"target_time_seconds": 300, "max_minor_errors": 3, "max_major_errors": 1},
    },
    {
        "name": "Subcuticular",
        "slug": "subcuticular",
        "category": "suturing",
        "description": "Running intradermal stitch for cosmetically sensitive closures.",
        "standard": {"target_time_seconds": 270, "max_minor_errors": 2, "max_major_errors": 0},
    },
    {
        "name": "Peg Transfer",
        "slug": "peg-transfer",
        "category": "fundamentals",
        "description": "Transfer pegs bimanually with smooth hand-offs and no drops.",
        "standard": {"target_time_seconds": 180, "max_minor_errors": 1, "max_major_errors": 0},
    },
    {
        "name": "Laparoscopic Knot",
        "slug": "laparoscopic-knot",
        "category": "laparoscopic",
        "description": "Two-instrument laparoscopic knot tying with camera awareness.",
        "standard": {"target_time_seconds": 240, "max_minor_errors": 2, "max_major_errors": 0},
    },
]

ERROR_TYPES = [
    {"name": "Needle handling error", "severity": "minor", "description": "Re-gripping or poor angle"},
    {"name": "Suture frayed", "severity": "minor", "description": "Suture damage during passes"},
    {"name": "Dropped instrument", "severity": "major", "description": "Instrument slip or drop"},
    {"name": "Tissue damage", "severity": "major", "description": "Visible tearing or crush injury"},
    {"name": "Critical bleed", "severity": "critical", "description": "Uncontrolled bleeding event"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        for task_data in TASKS:
            task = db.query(models.Task).filter(models.Task.slug == task_data["slug"]).first()
            if not task:
                task = models.Task(
                    name=task_data["name"],
                    slug=task_data["slug"],
                    category=task_data.get("category"),
                    description=task_data.get("description"),
                )
                db.add(task)
                db.flush()
            else:
                task.name = task_data["name"]
                task.category = task_data.get("category")
                task.description = task_data.get("description")

            standard_data = task_data.get("standard", {})
            standard = (
                db.query(models.TaskStandard)
                .filter(models.TaskStandard.task_id == task.id, models.TaskStandard.level == "PGY1")
                .first()
            )
            if not standard:
                db.add(
                    models.TaskStandard(
                        task_id=task.id,
                        level="PGY1",
                        target_time_seconds=standard_data.get("target_time_seconds", 240),
                        max_minor_errors=standard_data.get("max_minor_errors", 2),
                        max_major_errors=standard_data.get("max_major_errors", 0),
                        consecutive_required=1,
                        objective_criteria={"notes": "Baseline standard"},
                    )
                )
            else:
                standard.target_time_seconds = standard_data.get("target_time_seconds", standard.target_time_seconds)
                standard.max_minor_errors = standard_data.get("max_minor_errors", standard.max_minor_errors)
                standard.max_major_errors = standard_data.get("max_major_errors", standard.max_major_errors)

        if not db.query(models.ErrorType).count():
            for err in ERROR_TYPES:
                db.add(models.ErrorType(**err))

        db.commit()
        print("Seed complete")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
