from datetime import date
from pydantic import BaseModel, ConfigDict

class SprintCreate(BaseModel):
    sprint_number: int
    start_date: date
    end_date: date
    work_hours_per_day: int
    team_size: int
    max_team_capacity_points: int | None = None
    notes: str | None = None

class SprintRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sprint_number: int
    start_date: date
    end_date: date
    work_hours_per_day: int
    team_size: int
    max_team_capacity_points: int | None
    notes: str | None
