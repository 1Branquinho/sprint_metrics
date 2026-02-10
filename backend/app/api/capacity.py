from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.collaborator_capacity import CollaboratorCapacity
from app.schemas.capacity import CapacityCreate, CapacityRead

router = APIRouter(prefix="/capacities", tags=["capacities"])

@router.post("", response_model=CapacityRead, status_code=201)
def create_capacity(payload: CapacityCreate, db: Session = Depends(get_db)):
    capacity = CollaboratorCapacity(**payload.model_dump())
    db.add(capacity)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Capacity already exists for this sprint and collaborator")
    db.refresh(capacity)
    return capacity

@router.get("", response_model=list[CapacityRead])
def list_capacities(sprint_number: int | None = None, db: Session = Depends(get_db)):
    q = db.query(CollaboratorCapacity)
    if sprint_number is not None:
        q = q.filter(CollaboratorCapacity.sprint_number == sprint_number)
    return q.order_by(CollaboratorCapacity.sprint_number.desc(), CollaboratorCapacity.collaborator_id.asc()).all()
