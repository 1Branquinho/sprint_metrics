from sqlalchemy import Integer, String, Date, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class Issue(Base):
    __tablename__ = "issues"
    __table_args__ = (
        CheckConstraint("status IN ('TODO','DOING','QA','DONE')", name="ck_issue_status"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sprint_number: Mapped[int] = mapped_column(Integer, ForeignKey("sprints.sprint_number"), nullable=False, index=True)
    issue_number: Mapped[str] = mapped_column(String, nullable=False, index=True)
    gitlab_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    story_points: Mapped[int] = mapped_column(Integer, nullable=False)
    assignee_id: Mapped[int] = mapped_column(Integer, ForeignKey("collaborators.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String, nullable=False, index=True)
    created_at: Mapped[Date] = mapped_column(Date, nullable=False)
    work_day: Mapped[Date] = mapped_column(Date, nullable=False)
    done_at: Mapped[Date | None] = mapped_column(Date, nullable=True)
