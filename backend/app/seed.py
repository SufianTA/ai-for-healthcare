"""Seed the SurgiTrack database with initial tasks, standards, and error types."""
from sqlalchemy.orm import Session

from .db import Base, engine, SessionLocal
from . import models

TASKS = [
    {
        "name": "Palm Needle Driver",
        "slug": "palm-needle-driver",
        "category": "Open skills",
        "description": "Grasp the 5mm colored segment on thin rubber tubing using a palmed needle driver with three full clicks, repeated five times.",
        "standard": {
            "target_time_seconds": 7,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 60 - time - 10(sum of errors); cutoff 60 seconds (score floored at 0).",
                "errors": [
                    "Fail to close with 3 full clicks",
                    "Fail to grasp any portion of the colored segment",
                    "Drop needle driver",
                    "Slip fingers into needle driver finger rings during grasp",
                ],
                "proficiency_score": 53,
                "proficiency_time_seconds": 7,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Knot-tying, No Tension, Two-handed",
        "slug": "knot-no-tension-two-handed",
        "category": "Open skills",
        "description": "Tie a 2-0 silk ligature around a 5mm colored segment on thick tubing using two hands; three square knots starting with ends uncrossed.",
        "standard": {
            "target_time_seconds": 10,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 60 - time - 10(sum of errors); cutoff 60 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error (mm outside colored segment)",
                    "Gap/air knot distance (mm)",
                    "Slippage > 3mm or disruption",
                    "Ligature breakage",
                ],
                "proficiency_score": 50,
                "proficiency_time_seconds": 10,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Knot-tying, No Tension, One-handed",
        "slug": "knot-no-tension-one-handed",
        "category": "Open skills",
        "description": "One-handed technique to place three square knots with a 2-0 silk ligature around the colored segment on thick tubing.",
        "standard": {
            "target_time_seconds": 10,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 60 - time - 10(sum of errors); cutoff 60 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error (mm outside colored segment)",
                    "Gap/air knot distance (mm)",
                    "Slippage > 3mm or disruption",
                    "Ligature breakage",
                ],
                "proficiency_score": 50,
                "proficiency_time_seconds": 10,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Knot-tying, Under Tension, Two-handed, Surgeon's Knot",
        "slug": "knot-tension-two-handed-surgeons",
        "category": "Open skills",
        "description": "Approximate thick double rubber tubing with a surgeon's knot followed by two square throws using two hands.",
        "standard": {
            "target_time_seconds": 13,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 60 - time - 10(sum of errors); cutoff 60 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error per tubing piece (mm outside colored segment)",
                    "Gap between tubing segments (mm)",
                    "Slippage > 3mm or disruption",
                    "Ligature breakage",
                ],
                "proficiency_score": 47,
                "proficiency_time_seconds": 13,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Knot-tying, Under Tension, Two-handed, Slip Knot",
        "slug": "knot-tension-two-handed-slip",
        "category": "Open skills",
        "description": "Approximate thick double rubber tubing using two slip-knot throws then two square throws, two-handed technique.",
        "standard": {
            "target_time_seconds": 15,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 60 - time - 10(sum of errors); cutoff 60 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error per tubing piece (mm outside colored segment)",
                    "Gap between tubing segments (mm)",
                    "Slippage > 3mm or disruption",
                    "Ligature breakage",
                ],
                "proficiency_score": 45,
                "proficiency_time_seconds": 15,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Knot-tying, Under Tension, One-handed, Slip Knot",
        "slug": "knot-tension-one-handed-slip",
        "category": "Open skills",
        "description": "One-handed slip knot (two throws) followed by two square throws to approximate thick double rubber tubing.",
        "standard": {
            "target_time_seconds": 15,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 60 - time - 10(sum of errors); cutoff 60 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error per tubing piece (mm outside colored segment)",
                    "Gap between tubing segments (mm)",
                    "Slippage > 3mm or disruption",
                    "Ligature breakage",
                ],
                "proficiency_score": 45,
                "proficiency_time_seconds": 15,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Suturing, Interrupted, Simple",
        "slug": "suturing-interrupted-simple",
        "category": "Open skills",
        "description": "3-0 polysorb on tapered needle in the FLS model; palmed needle driver, load in the wound, and instrument tie (surgeon's knot then two squares).",
        "standard": {
            "target_time_seconds": 18,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 120 - time - 10(sum of errors); cutoff 120 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error (sum of mm outside targets)",
                    "Gap between targets (mm; <2mm = no error)",
                    "Slippage > 3mm or disruption",
                    "Ligature breakage",
                    "Palming finger placement during tissue bite",
                    "Loading outside the wound",
                ],
                "proficiency_score": 102,
                "proficiency_time_seconds": 18,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Suturing, Interrupted, Horizontal Mattress",
        "slug": "suturing-interrupted-horizontal-mattress",
        "category": "Open skills",
        "description": "Horizontal mattress stitch on the FLS model with palmed driver and in-wound loading; surgeon's knot then two squares.",
        "standard": {
            "target_time_seconds": 31,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 120 - time - 10(sum of errors); cutoff 120 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error (sum of mm outside targets)",
                    "Gap between targets (mm; <2mm = no error)",
                    "Slippage > 3mm or disruption",
                    "Ligature breakage",
                    "Palming finger placement during tissue bite",
                    "Loading outside the wound",
                ],
                "proficiency_score": 89,
                "proficiency_time_seconds": 31,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Suturing, Interrupted, Vertical Mattress",
        "slug": "suturing-interrupted-vertical-mattress",
        "category": "Open skills",
        "description": "Vertical mattress stitch on the FLS model with palmed driver and in-wound loading; surgeon's knot then two squares.",
        "standard": {
            "target_time_seconds": 31,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 120 - time - 10(sum of errors); cutoff 120 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error (sum of mm outside targets)",
                    "Gap between targets (mm; <2mm = no error)",
                    "Slippage > 3mm or disruption",
                    "Ligature breakage",
                    "Palming finger placement during tissue bite",
                    "Loading outside the wound",
                ],
                "proficiency_score": 89,
                "proficiency_time_seconds": 31,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Suturing, Running, Simple",
        "slug": "suturing-running-simple",
        "category": "Open skills",
        "description": "Running simple skin closure on a 10cm incision with 3-0 nylon, including four corner knots and <1cm tails.",
        "standard": {
            "target_time_seconds": 165,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 600 - time - 10(sum of errors); cutoff 600 seconds (score floored at 0).",
                "errors": [
                    "Accuracy error (sum of mm outside targets)",
                    "Tissue gap at each target (mm)",
                    "Slippage > 3mm or disruption (two knots tested)",
                    "Ligature breakage",
                    "Palming finger placement during tissue bites",
                    "Loading outside the wound",
                    "Tails cut >1cm",
                ],
                "proficiency_score": 435,
                "proficiency_time_seconds": 165,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Suturing, Running, Subcuticular",
        "slug": "suturing-running-subcuticular",
        "category": "Open skills",
        "description": "Subcuticular running closure over a 10cm incision with 3-0 nylon, Aberdeen finish and flush tails.",
        "standard": {
            "target_time_seconds": 204,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 600 - time - 10(sum of errors); cutoff 600 seconds (score floored at 0).",
                "errors": [
                    "Tissue gap at each 1cm interval (mm)",
                    "Ligature breakage",
                    "Palming finger placement during tissue bites",
                    "Loading outside the wound",
                    "Tails not flush",
                ],
                "proficiency_score": 396,
                "proficiency_time_seconds": 204,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Suturing, Interrupted, Subcuticular",
        "slug": "suturing-interrupted-subcuticular",
        "category": "Open skills",
        "description": "Single buried subcuticular stitch on a 1.5cm incision with surgeon's knot and flush tails.",
        "standard": {
            "target_time_seconds": 33,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "scoring_formula": "Score = 120 - time - 10(sum of errors); cutoff 120 seconds (score floored at 0).",
                "errors": [
                    "Tissue gap (mm)",
                    "Ligature breakage",
                    "Palming finger placement during tissue bites",
                    "Loading outside the wound",
                    "Tails not flush",
                ],
                "proficiency_score": 87,
                "proficiency_time_seconds": 33,
                "training_protocol": "Achieve proficiency score on 2 consecutive repetitions (max 80 reps).",
                "testing_protocol": "1 repetition for pre- and post-test.",
            },
        },
    },
    {
        "name": "Peg Transfer",
        "slug": "laparoscopic-peg-transfer",
        "category": "Laparoscopic skills",
        "description": "FLS peg transfer with no pegs dropped out of view; proficiency requires smooth bimanual transfers.",
        "standard": {
            "target_time_seconds": 48,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Peg not transferred", "Peg dropped out of field"],
                "proficiency_score": 48,
                "proficiency_time_seconds": 48,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions and 10 additional reinforcement reps (max 80).",
                "testing_protocol": "Proficiency score expected on assessment reps.",
            },
        },
    },
    {
        "name": "Pattern Cut",
        "slug": "laparoscopic-pattern-cut",
        "category": "Laparoscopic skills",
        "description": "FLS pattern cut completed within 2mm of the line on either side.",
        "standard": {
            "target_time_seconds": 98,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Any portion outside 2mm accuracy window"],
                "proficiency_score": 98,
                "proficiency_time_seconds": 98,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions (max 80).",
                "testing_protocol": "Proficiency score expected on assessment reps.",
            },
        },
    },
    {
        "name": "Endoloop",
        "slug": "laparoscopic-endoloop",
        "category": "Laparoscopic skills",
        "description": "Place an endoloop with up to 1mm accuracy error and no slippage.",
        "standard": {
            "target_time_seconds": 53,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Accuracy outside 1mm", "Any knot security slippage"],
                "proficiency_score": 53,
                "proficiency_time_seconds": 53,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions (max 80).",
                "testing_protocol": "Proficiency score expected on assessment reps.",
            },
        },
    },
    {
        "name": "Extracorporeal Suture",
        "slug": "laparoscopic-extracorporeal-suture",
        "category": "Laparoscopic skills",
        "description": "Extracorporeal knot tying with up to 1mm accuracy error and no slippage.",
        "standard": {
            "target_time_seconds": 136,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Accuracy outside 1mm", "Any knot security slippage"],
                "proficiency_score": 136,
                "proficiency_time_seconds": 136,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions (max 80).",
                "testing_protocol": "Proficiency score expected on assessment reps.",
            },
        },
    },
    {
        "name": "Intracorporeal Suture",
        "slug": "laparoscopic-intracorporeal-suture",
        "category": "Laparoscopic skills",
        "description": "Intracorporeal knot tying with up to 1mm accuracy error and no slippage.",
        "standard": {
            "target_time_seconds": 112,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Accuracy outside 1mm", "Any knot security slippage"],
                "proficiency_score": 112,
                "proficiency_time_seconds": 112,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions and 10 additional reinforcement reps (max 80).",
                "testing_protocol": "Proficiency score expected on assessment reps.",
            },
        },
    },
    {
        "name": "Bean Drop",
        "slug": "laparoscopic-bean-drop",
        "category": "Laparoscopic skills",
        "description": "Timed bean drop drill with a 24 second proficiency benchmark.",
        "standard": {
            "target_time_seconds": 24,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Incomplete bean transfer"],
                "proficiency_score": 24,
                "proficiency_time_seconds": 24,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions (max 80); testing requires proficiency on 2 of 3 reps.",
                "testing_protocol": "Proficiency score required on 2 of 3 attempts.",
            },
        },
    },
    {
        "name": "Running String",
        "slug": "laparoscopic-running-string",
        "category": "Laparoscopic skills",
        "description": "Timed running string drill with a 28 second proficiency target.",
        "standard": {
            "target_time_seconds": 28,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Incomplete string run"],
                "proficiency_score": 28,
                "proficiency_time_seconds": 28,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions (max 80); testing requires proficiency on 2 of 3 reps.",
                "testing_protocol": "Proficiency score required on 2 of 3 attempts.",
            },
        },
    },
    {
        "name": "Zero Degree Camera Navigation",
        "slug": "laparoscopic-zero-degree-navigation",
        "category": "Laparoscopic skills",
        "description": "Zero-degree camera navigation task with a 28 second proficiency target.",
        "standard": {
            "target_time_seconds": 28,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Navigation target missed"],
                "proficiency_score": 28,
                "proficiency_time_seconds": 28,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions (max 80); testing requires proficiency on 2 of 3 reps.",
                "testing_protocol": "Proficiency score required on 2 of 3 attempts.",
            },
        },
    },
    {
        "name": "Thirty Degree Camera Navigation",
        "slug": "laparoscopic-thirty-degree-navigation",
        "category": "Laparoscopic skills",
        "description": "Thirty-degree camera navigation task with a 28 second proficiency target.",
        "standard": {
            "target_time_seconds": 28,
            "max_minor_errors": 0,
            "max_major_errors": 0,
            "consecutive_required": 2,
            "objective_criteria": {
                "errors": ["Navigation target missed"],
                "proficiency_score": 28,
                "proficiency_time_seconds": 28,
                "training_protocol": "Achieve proficiency on 2 consecutive repetitions (max 80); testing requires proficiency on 2 of 3 reps.",
                "testing_protocol": "Proficiency score required on 2 of 3 attempts.",
            },
        },
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
                        consecutive_required=standard_data.get("consecutive_required", 1),
                        objective_criteria=standard_data.get(
                            "objective_criteria", {"notes": "Baseline standard"}
                        ),
                    )
                )
            else:
                standard.target_time_seconds = standard_data.get("target_time_seconds", standard.target_time_seconds)
                standard.max_minor_errors = standard_data.get("max_minor_errors", standard.max_minor_errors)
                standard.max_major_errors = standard_data.get("max_major_errors", standard.max_major_errors)
                standard.consecutive_required = standard_data.get(
                    "consecutive_required", standard.consecutive_required
                )
                standard.objective_criteria = standard_data.get(
                    "objective_criteria", standard.objective_criteria
                )

        if not db.query(models.ErrorType).count():
            for err in ERROR_TYPES:
                db.add(models.ErrorType(**err))

        db.commit()
        print("Seed complete")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
