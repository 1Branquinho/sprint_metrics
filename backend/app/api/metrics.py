from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.exceptions import DomainError
from app.db.deps import get_db
from app.schemas.metrics import CollaboratorMetricsResponse, SprintMetricsResponse
from app.services.metrics import MetricsService

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/sprint/{sprint_number}", response_model=SprintMetricsResponse)
def get_sprint_metrics(sprint_number: int, db: Session = Depends(get_db)):
    try:
        return MetricsService.get_sprint_metrics(db, sprint_number)
    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@router.get("/collaborator/{collaborator_id}", response_model=CollaboratorMetricsResponse)
def get_collaborator_metrics(
    collaborator_id: int,
    sprint_number: int | None = None,
    db: Session = Depends(get_db),
):
    try:
        return MetricsService.get_collaborator_metrics(db, collaborator_id, sprint_number)
    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
