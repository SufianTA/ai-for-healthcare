from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db import get_db

router = APIRouter()


@router.get("/", response_model=list[schemas.ErrorTypeOut])
def list_error_types(db: Session = Depends(get_db)):
    return db.query(models.ErrorType).all()
