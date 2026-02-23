from datetime import date
from sqlalchemy.orm import Session
from app.core.enums import IssueStatus
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueUpdate

class IssueService:
    @staticmethod
    def create(db: Session, payload: IssueCreate) -> Issue:
        if payload.story_points < 0:
            raise ValueError("story_points must be >= 0")

        issue = Issue(**payload.model_dump())

        if issue.status == IssueStatus.DONE and issue.done_at is None:
            issue.done_at = date.today()

        db.add(issue)
        db.commit()
        db.refresh(issue)
        return issue

    @staticmethod
    def update(db: Session, issue: Issue, payload: IssueUpdate) -> Issue:
        data = payload.model_dump(exclude_unset=True)

        if "story_points" in data and data["story_points"] is not None and data["story_points"] < 0:
            raise ValueError("story_points must be >= 0")

        previous_status = IssueStatus(issue.status)

        for key, value in data.items():
            setattr(issue, key, value)

        if issue.status == IssueStatus.DONE and issue.done_at is None:
            issue.done_at = date.today()

        if previous_status == IssueStatus.DONE and issue.status != IssueStatus.DONE:
            issue.done_at = None

        db.commit()
        db.refresh(issue)
        return issue
