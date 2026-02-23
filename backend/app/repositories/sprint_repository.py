from sqlalchemy.orm import Session
from app.models.sprint import Sprint


class SprintRepository:

    @staticmethod
    def get_by_number(db: Session, sprint_number: int) -> Sprint | None:
        return db.get(Sprint, sprint_number)

    @staticmethod
    def list(db: Session, limit: int, offset: int):
        q = db.query(Sprint)

        total = q.count()

        items = (
            q.order_by(Sprint.sprint_number.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

        return items, total