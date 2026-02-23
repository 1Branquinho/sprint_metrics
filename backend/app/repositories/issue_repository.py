from sqlalchemy.orm import Session
from app.models.issue import Issue
from app.core.enums import IssueStatus

class IssueRepository:

    @staticmethod
    def get_by_id(db: Session, issue_id: int) -> Issue | None:
        return db.get(Issue, issue_id)

    @staticmethod
    def list(
        db: Session,
        sprint_number: int | None,
        assignee_id: int | None,
        status: IssueStatus | None,
        limit: int,
        offset: int,
    ):
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

        return items, total