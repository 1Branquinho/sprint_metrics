from datetime import date
from sqlalchemy.orm import Session
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueUpdate

class IssueService:
    @staticmethod
    def create(db: Session, payload: IssueCreate) -> Issue:
        issue = Issue(**payload.model_dump())
        if issue.status == "DONE" and issue.done_at is None:
            issue.done_at = date.today()
        db.add(issue)
        db.commit()
        db.refresh(issue)
        return issue

    @staticmethod
    def update(db: Session, issue: Issue, payload: IssueUpdate) -> Issue:
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
