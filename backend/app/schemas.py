from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class ErrorTypeOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    severity: str

    class Config:
        orm_mode = True


class TaskStandardOut(BaseModel):
    id: int
    level: str
    target_time_seconds: int
    max_minor_errors: int
    max_major_errors: int
    consecutive_required: int
    objective_criteria: Optional[dict] = None

    class Config:
        orm_mode = True


class TaskOut(BaseModel):
    id: int
    name: str
    slug: str
    category: Optional[str]
    description: Optional[str]

    class Config:
        orm_mode = True


class AttemptErrorIn(BaseModel):
    error_type_id: int


class AttemptCreate(BaseModel):
    task_id: int
    standard_id: int
    started_at: datetime
    ended_at: datetime
    errors: List[AttemptErrorIn] = []


class AttemptOut(BaseModel):
    id: int
    task_id: int
    standard_id: int
    started_at: datetime
    ended_at: datetime
    time_seconds: int
    score: int
    proficiency: bool
    errors: List[ErrorTypeOut]

    class Config:
        orm_mode = True


class UserTaskSummary(BaseModel):
    task_id: int
    task_name: str
    best_time_seconds: Optional[int]
    best_score: Optional[int]


class UserSummary(BaseModel):
    proficient_tasks: int
    total_tasks: int
    task_details: List[UserTaskSummary] = []


class VideoCreate(BaseModel):
    storage_url: str


class LeaderboardEntry(BaseModel):
    user_id: int
    user_email: str
    task_id: int
    task_name: str
    score: int
    time_seconds: int

    class Config:
        orm_mode = True


class Profile(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
