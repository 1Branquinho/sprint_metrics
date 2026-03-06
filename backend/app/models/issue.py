from datetime import date

from sqlalchemy import CheckConstraint, Date as SQLDate, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.enums import IssueStatus
from app.models.base import Base


class Issue(Base):
    __tablename__ = "issues"
    __table_args__ = (
        CheckConstraint(
            f"status IN ({', '.join(repr(s.value) for s in IssueStatus)})",
            name="ck_issue_status",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sprint_number: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("sprints.sprint_number"),
        nullable=False,
        index=True,
    )
    issue_number: Mapped[str] = mapped_column(String, nullable=False, index=True)
    gitlab_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    story_points: Mapped[int] = mapped_column(Integer, nullable=False)
    assignee_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("collaborators.id"),
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(String, nullable=False, index=True)
    created_at: Mapped[date] = mapped_column(SQLDate, nullable=False)
    work_day: Mapped[date] = mapped_column(SQLDate, nullable=False)
    done_at: Mapped[date | None] = mapped_column(SQLDate, nullable=True)
