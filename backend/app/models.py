from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship

from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    attempts = relationship("Attempt", back_populates="user")


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", secondary="team_memberships", backref="teams")


class TeamMembership(Base):
    __tablename__ = "team_memberships"
    __table_args__ = (UniqueConstraint("team_id", "user_id", name="uniq_team_user"),)

    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    standards = relationship("TaskStandard", back_populates="task", cascade="all, delete")
    attempts = relationship("Attempt", back_populates="task")


class TaskStandard(Base):
    __tablename__ = "task_standards"
    __table_args__ = (UniqueConstraint("task_id", "level", name="uniq_task_level"),)

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"))
    level = Column(String, nullable=False)
    target_time_seconds = Column(Integer, nullable=False)
    max_minor_errors = Column(Integer, default=0)
    max_major_errors = Column(Integer, default=0)
    consecutive_required = Column(Integer, default=1)
    objective_criteria = Column(JSON, nullable=True)

    task = relationship("Task", back_populates="standards")
    attempts = relationship("Attempt", back_populates="standard")


class ErrorType(Base):
    __tablename__ = "error_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String, nullable=False)  # minor, major, critical

    attempt_errors = relationship("AttemptError", back_populates="error_type")


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))
    standard_id = Column(Integer, ForeignKey("task_standards.id", ondelete="SET NULL"))
    started_at = Column(DateTime, nullable=False)
    ended_at = Column(DateTime, nullable=False)
    time_seconds = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    proficiency = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="attempts")
    task = relationship("Task", back_populates="attempts")
    standard = relationship("TaskStandard", back_populates="attempts")
    errors = relationship("AttemptError", back_populates="attempt", cascade="all, delete-orphan")
    videos = relationship("Video", back_populates="attempt", cascade="all, delete-orphan")


class AttemptError(Base):
    __tablename__ = "attempt_errors"

    id = Column(Integer, primary_key=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id", ondelete="CASCADE"))
    error_type_id = Column(Integer, ForeignKey("error_types.id"))

    attempt = relationship("Attempt", back_populates="errors")
    error_type = relationship("ErrorType", back_populates="attempt_errors")


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id", ondelete="CASCADE"))
    storage_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    attempt = relationship("Attempt", back_populates="videos")
