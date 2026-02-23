from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.collaborator_capacity import CollaboratorCapacity
from app.schemas.capacity import CapacityCreate, CapacityRead
from app.schemas.common import Page

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

@router.get("", response_model=Page[CapacityRead])
def list_capacities(
    sprint_number: int | None = None,
    collaborator_id: int | None = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    if limit < 1 or limit > 200:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 200")
    if offset < 0:
        raise HTTPException(status_code=400, detail="offset must be >= 0")

    q = db.query(CollaboratorCapacity)

    if sprint_number is not None:
        q = q.filter(CollaboratorCapacity.sprint_number == sprint_number)

    if collaborator_id is not None:
        q = q.filter(CollaboratorCapacity.collaborator_id == collaborator_id)

    total = q.count()

    items = (
        q.order_by(CollaboratorCapacity.sprint_number.desc(), CollaboratorCapacity.collaborator_id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return Page(items=items, total=total, limit=limit, offset=offset)