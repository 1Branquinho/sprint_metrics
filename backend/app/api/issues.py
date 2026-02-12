from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueUpdate, IssueRead

router = APIRouter(prefix="/issues", tags=["issues"])

@router.post("", response_model=IssueRead, status_code=201)
def create_issue(payload: IssueCreate, db: Session = Depends(get_db)):
    issue = Issue(**payload.model_dump())
    if issue.status == "DONE" and issue.done_at is None:
        issue.done_at = date.today()
    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue

@router.get("", response_model=list[IssueRead])
def list_issues(
    sprint_number: int | None = None,
    assignee_id: int | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Issue)
    if sprint_number is not None:
        q = q.filter(Issue.sprint_number == sprint_number)
    if assignee_id is not None:
        q = q.filter(Issue.assignee_id == assignee_id)
    if status is not None:
        q = q.filter(Issue.status == status)
    return q.order_by(Issue.id.desc()).all()

@router.put("/{issue_id}", response_model=IssueRead)
def update_issue(issue_id: int, payload: IssueUpdate, db: Session = Depends(get_db)):
    issue = db.get(Issue, issue_id)
    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")

    previous_status = issue.status

    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(issue, key, value)

    if issue.status == "DONE" and issue.done_at is None:
        issue.done_at = date.today()

    if previous_status == "DONE" and issue.status != "DONE":
        issue.done_at = None

    db.commit()
    db.refresh(issue)
    return issue

@router.delete("/{issue_id}", status_code=204)
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.get(Issue, issue_id)
    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    db.delete(issue)
    db.commit()
