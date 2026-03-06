from sqlalchemy.orm import Session

from app.models.collaborator_capacity import CollaboratorCapacity
from app.models.issue import Issue


class MetricsRepository:
    @staticmethod
    def get_issues_by_sprint(db: Session, sprint_number: int):
        return db.query(Issue).filter(Issue.sprint_number == sprint_number).all()

    @staticmethod
    def get_capacities_by_sprint(db: Session, sprint_number: int):
        return (
            db.query(CollaboratorCapacity)
            .filter(CollaboratorCapacity.sprint_number == sprint_number)
            .all()
        )

    @staticmethod
    def get_issues_by_collaborator(db: Session, collaborator_id: int, sprint_number: int | None = None):
        q = db.query(Issue).filter(Issue.assignee_id == collaborator_id)
        if sprint_number is not None:
            q = q.filter(Issue.sprint_number == sprint_number)
        return q.all()

    @staticmethod
    def get_capacities_by_collaborator(
        db: Session,
        collaborator_id: int,
        sprint_number: int | None = None,
    ):
        q = db.query(CollaboratorCapacity).filter(CollaboratorCapacity.collaborator_id == collaborator_id)
        if sprint_number is not None:
            q = q.filter(CollaboratorCapacity.sprint_number == sprint_number)
        return q.all()
