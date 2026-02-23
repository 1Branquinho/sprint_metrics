from datetime import date
from app.models.sprint import Sprint
from app.models.collaborator import Collaborator
from app.models.collaborator_capacity import CollaboratorCapacity
from app.schemas.issue import IssueCreate
from app.core.enums import IssueStatus
from app.services.issues import IssueService
from app.services.metrics import MetricsService


def test_metrics_basic_totals(db):
    sprint = Sprint(
        sprint_number=1,
        start_date=date(2024, 1, 1),
        end_date=date(2024, 1, 5),
        work_hours_per_day=8,
        team_size=1,
    )

    collaborator = Collaborator(name="John", active=True)

    db.add(sprint)
    db.add(collaborator)
    db.commit()

    capacity = CollaboratorCapacity(
        sprint_number=1,
        collaborator_id=collaborator.id,
        min_points=5,
        expected_points=10,
    )

    db.add(capacity)
    db.commit()

    issue_payload = IssueCreate(
        sprint_number=1,
        issue_number="ISSUE-1",
        gitlab_url=None,
        title="Test",
        story_points=5,
        assignee_id=collaborator.id,
        status=IssueStatus.DONE,
        created_at=date(2024, 1, 1),
        work_day=date(2024, 1, 2),
    )

    IssueService.create(db, issue_payload)

    result = MetricsService.get_sprint_metrics(db, 1)

    assert result["sprintInfo"]["totalStoryPoints"] == 5
    assert result["sprintInfo"]["doneStoryPoints"] == 5
    assert result["sprintInfo"]["openStoryPoints"] == 0