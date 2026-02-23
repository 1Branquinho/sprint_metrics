from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueUpdate, IssueRead
from app.services.issues import IssueService

router = APIRouter(prefix="/issues", tags=["issues"])

@router.post("", response_model=IssueRead, status_code=201)
def create_issue(payload: IssueCreate, db: Session = Depends(get_db)):
    try:
        return IssueService.create(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{issue_id}", response_model=IssueRead)
def update_issue(issue_id: int, payload: IssueUpdate, db: Session = Depends(get_db)):
    issue = db.get(Issue, issue_id)
    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    try:
        return IssueService.update(db, issue, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
