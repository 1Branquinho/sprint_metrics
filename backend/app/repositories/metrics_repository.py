from sqlalchemy.orm import Session
from app.models.issue import Issue
from app.models.collaborator_capacity import CollaboratorCapacity


class MetricsRepository:

    @staticmethod
    def get_issues_by_sprint(db: Session, sprint_number: int):
        return (
            db.query(Issue)
            .filter(Issue.sprint_number == sprint_number)
            .all()
        )

    @staticmethod
    def get_capacities_by_sprint(db: Session, sprint_number: int):
        return (
            db.query(CollaboratorCapacity)
            .filter(CollaboratorCapacity.sprint_number == sprint_number)
            .all()
        )