from datetime import date
from sqlalchemy.orm import Session
from app.core.enums import IssueStatus
from app.core.exceptions import DomainError
from app.core.cache import invalidate
from app.models.issue import Issue
from app.models.sprint import Sprint
from app.models.collaborator import Collaborator
from app.schemas.issue import IssueCreate, IssueUpdate


class IssueService:

    @staticmethod
    def create(db: Session, payload: IssueCreate) -> Issue:

        if payload.story_points < 0:
            raise DomainError(400, "story_points must be >= 0")

        if db.get(Sprint, payload.sprint_number) is None:
            raise DomainError(404, "Sprint not found")

        if db.get(Collaborator, payload.assignee_id) is None:
            raise DomainError(404, "Collaborator not found")

        issue = Issue(**payload.model_dump())

        if issue.status == IssueStatus.DONE and issue.done_at is None:
            issue.done_at = date.today()

        db.add(issue)
        db.commit()
        db.refresh(issue)

        invalidate(f"sprint_metrics:{issue.sprint_number}")

        return issue

    @staticmethod
    def update(db: Session, issue: Issue, payload: IssueUpdate) -> Issue:

        data = payload.model_dump(exclude_unset=True)

        if "story_points" in data and data["story_points"] is not None and data["story_points"] < 0:
            raise DomainError(400, "story_points must be >= 0")

        new_sprint_number = data.get("sprint_number", issue.sprint_number)
        new_assignee_id = data.get("assignee_id", issue.assignee_id)

        if db.get(Sprint, new_sprint_number) is None:
            raise DomainError(404, "Sprint not found")

        if db.get(Collaborator, new_assignee_id) is None:
            raise DomainError(404, "Collaborator not found")

        previous_status = IssueStatus(issue.status)

        for key, value in data.items():
            setattr(issue, key, value)

        if issue.status == IssueStatus.DONE and issue.done_at is None:
            issue.done_at = date.today()

        if previous_status == IssueStatus.DONE and issue.status != IssueStatus.DONE:
            issue.done_at = None

        db.commit()
        db.refresh(issue)

        invalidate(f"sprint_metrics:{issue.sprint_number}")

        return issue

    @staticmethod
    def delete(db: Session, issue: Issue) -> None:

        sprint_number = issue.sprint_number

        db.delete(issue)
        db.commit()

        invalidate(f"sprint_metrics:{sprint_number}")