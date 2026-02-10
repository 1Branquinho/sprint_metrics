from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.collaborator import Collaborator
from app.schemas.collaborator import CollaboratorCreate, CollaboratorRead

router = APIRouter(prefix="/collaborators", tags=["collaborators"])

@router.post("", response_model=CollaboratorRead, status_code=201)
def create_collaborator(payload: CollaboratorCreate, db: Session = Depends(get_db)):
    collaborator = Collaborator(**payload.model_dump())
    db.add(collaborator)
    db.commit()
    db.refresh(collaborator)
    return collaborator

@router.get("", response_model=list[CollaboratorRead])
def list_collaborators(db: Session = Depends(get_db)):
    return db.query(Collaborator).order_by(Collaborator.active.desc(), Collaborator.name.asc()).all()
