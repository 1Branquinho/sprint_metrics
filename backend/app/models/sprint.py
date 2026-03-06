from datetime import date

from sqlalchemy import Date as SQLDate, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Sprint(Base):
    __tablename__ = "sprints"

    sprint_number: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    start_date: Mapped[date] = mapped_column(SQLDate, nullable=False)
    end_date: Mapped[date] = mapped_column(SQLDate, nullable=False)

    work_hours_per_day: Mapped[int] = mapped_column(Integer, nullable=False)
    team_size: Mapped[int] = mapped_column(Integer, nullable=False)

    max_team_capacity_points: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
