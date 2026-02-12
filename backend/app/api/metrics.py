from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.sprint import Sprint
from app.models.issue import Issue
from app.models.collaborator_capacity import CollaboratorCapacity
from app.analytics.sprint_metrics import compute_sprint_metrics

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.get("/sprint/{sprint_number}")
def get_sprint_metrics(sprint_number: int, db: Session = Depends(get_db)):
    sprint = db.get(Sprint, sprint_number)
    if sprint is None:
        raise HTTPException(status_code=404, detail="Sprint not found")

    issues = (
        db.query(Issue)
        .filter(Issue.sprint_number == sprint_number)
        .all()
    )

    capacities = (
        db.query(CollaboratorCapacity)
        .filter(CollaboratorCapacity.sprint_number == sprint_number)
        .all()
    )

    sprint_row = {
        "sprint_number": sprint.sprint_number,
        "start_date": sprint.start_date,
        "end_date": sprint.end_date,
        "work_hours_per_day": sprint.work_hours_per_day,
        "team_size": sprint.team_size,
    }

    issues_rows = [
        {
            "id": i.id,
            "sprint_number": i.sprint_number,
            "issue_number": i.issue_number,
            "story_points": i.story_points,
            "assignee_id": i.assignee_id,
            "status": i.status,
            "done_at": i.done_at,
        }
        for i in issues
    ]

    capacities_rows = [
        {
            "id": c.id,
            "sprint_number": c.sprint_number,
            "collaborator_id": c.collaborator_id,
            "min_points": c.min_points,
            "expected_points": c.expected_points,
        }
        for c in capacities
    ]

    return compute_sprint_metrics(sprint_row, issues_rows, capacities_rows)
