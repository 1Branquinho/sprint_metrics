from datetime import date
from pydantic import BaseModel, ConfigDict

class IssueCreate(BaseModel):
    sprint_number: int
    issue_number: str
    gitlab_url: str | None = None
    title: str
    story_points: int
    assignee_id: int
    status: str
    created_at: date
    work_day: date

class IssueUpdate(BaseModel):
    sprint_number: int | None = None
    issue_number: str | None = None
    gitlab_url: str | None = None
    title: str | None = None
    story_points: int | None = None
    assignee_id: int | None = None
    status: str | None = None
    created_at: date | None = None
    work_day: date | None = None

class IssueRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sprint_number: int
    issue_number: str
    gitlab_url: str | None
    title: str
    story_points: int
    assignee_id: int
    status: str
    created_at: date
    work_day: date
    done_at: date | None
