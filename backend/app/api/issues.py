from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.enums import IssueStatus
from app.core.exceptions import DomainError
from app.models.issue import Issue
from app.schemas.common import Page
from app.schemas.issue import IssueCreate, IssueUpdate, IssueRead
from app.services.issues import IssueService

router = APIRouter(prefix="/issues", tags=["issues"])

@router.post("", response_model=IssueRead, status_code=201)
def create_issue(payload: IssueCreate, db: Session = Depends(get_db)):
    try:
        return IssueService.create(db, payload)
    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.put("/{issue_id}", response_model=IssueRead)
def update_issue(issue_id: int, payload: IssueUpdate, db: Session = Depends(get_db)):
    issue = db.get(Issue, issue_id)
    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    try:
        return IssueService.update(db, issue, payload)
    except DomainError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("", response_model=Page[IssueRead])
def list_issues(
    sprint_number: int | None = None,
    assignee_id: int | None = None,
    status: IssueStatus | None = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    if limit < 1 or limit > 200:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 200")
    if offset < 0:
        raise HTTPException(status_code=400, detail="offset must be >= 0")

    q = db.query(Issue)

    if sprint_number is not None:
        q = q.filter(Issue.sprint_number == sprint_number)

    if assignee_id is not None:
        q = q.filter(Issue.assignee_id == assignee_id)

    if status is not None:
        q = q.filter(Issue.status == status)

    total = q.count()

    items = (
        q.order_by(Issue.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return Page(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
    )

@router.delete("/{issue_id}", status_code=204)
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.get(Issue, issue_id)
    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    db.delete(issue)
    db.commit()