from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.collaborator import Collaborator
from app.schemas.common import Page
from app.schemas.collaborator import CollaboratorCreate, CollaboratorRead

router = APIRouter(prefix="/collaborators", tags=["collaborators"])

@router.post("", response_model=CollaboratorRead, status_code=201)
def create_collaborator(payload: CollaboratorCreate, db: Session = Depends(get_db)):
    collaborator = Collaborator(**payload.model_dump())
    db.add(collaborator)
    db.commit()
    db.refresh(collaborator)
    return collaborator

@router.get("", response_model=Page[CollaboratorRead])
def list_collaborators(
    active: bool | None = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    if limit < 1 or limit > 200:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 200")
    if offset < 0:
        raise HTTPException(status_code=400, detail="offset must be >= 0")

    q = db.query(Collaborator)
    if active is not None:
        q = q.filter(Collaborator.active == active)

    total = q.count()
    items = (
        q.order_by(Collaborator.active.desc(), Collaborator.name.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return Page(items=items, total=total, limit=limit, offset=offset)