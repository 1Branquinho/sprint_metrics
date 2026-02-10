from sqlalchemy import Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class CollaboratorCapacity(Base):
    __tablename__ = "collaborator_capacity"
    __table_args__ = (
        UniqueConstraint("sprint_number", "collaborator_id", name="uq_capacity_sprint_collaborator"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sprint_number: Mapped[int] = mapped_column(Integer, ForeignKey("sprints.sprint_number"), nullable=False, index=True)
    collaborator_id: Mapped[int] = mapped_column(Integer, ForeignKey("collaborators.id"), nullable=False, index=True)
    min_points: Mapped[int] = mapped_column(Integer, nullable=False)
    expected_points: Mapped[int] = mapped_column(Integer, nullable=False)
