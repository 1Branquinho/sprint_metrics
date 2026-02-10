from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.sprint import Sprint
from app.schemas.sprint import SprintCreate, SprintRead

router = APIRouter(prefix="/sprints", tags=["sprints"])

@router.post("", response_model=SprintRead, status_code=201)
def create_sprint(payload: SprintCreate, db: Session = Depends(get_db)):
    existing = db.get(Sprint, payload.sprint_number)
    if existing is not None:
        raise HTTPException(status_code=409, detail="Sprint already exists")

    sprint = Sprint(**payload.model_dump())
    db.add(sprint)
    db.commit()
    db.refresh(sprint)
    return sprint

@router.get("", response_model=list[SprintRead])
def list_sprints(db: Session = Depends(get_db)):
    return db.query(Sprint).order_by(Sprint.sprint_number.desc()).all()
