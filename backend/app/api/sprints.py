from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.sprint import Sprint
from app.schemas.common import Page
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

@router.get("", response_model=Page[SprintRead])
def list_sprints(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    if limit < 1 or limit > 200:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 200")
    if offset < 0:
        raise HTTPException(status_code=400, detail="offset must be >= 0")

    q = db.query(Sprint)
    total = q.count()
    items = (
        q.order_by(Sprint.sprint_number.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return Page(items=items, total=total, limit=limit, offset=offset)