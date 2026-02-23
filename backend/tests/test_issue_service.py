from datetime import date
from app.core.enums import IssueStatus
from app.models.sprint import Sprint
from app.models.collaborator import Collaborator
from app.schemas.issue import IssueCreate, IssueUpdate
from app.services.issues import IssueService


def test_issue_done_sets_done_at(db):
    sprint = Sprint(
        sprint_number=1,
        start_date=date(2024, 1, 1),
        end_date=date(2024, 1, 10),
        work_hours_per_day=8,
        team_size=2,
    )

    collaborator = Collaborator(name="John", active=True)

    db.add(sprint)
    db.add(collaborator)
    db.commit()

    payload = IssueCreate(
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

    issue = IssueService.create(db, payload)

    assert issue.done_at == date.today()


def test_issue_status_change_clears_done_at(db):
    sprint = Sprint(
        sprint_number=1,
        start_date=date(2024, 1, 1),
        end_date=date(2024, 1, 10),
        work_hours_per_day=8,
        team_size=2,
    )

    collaborator = Collaborator(name="John", active=True)

    db.add(sprint)
    db.add(collaborator)
    db.commit()

    payload = IssueCreate(
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

    issue = IssueService.create(db, payload)

    update_payload = IssueUpdate(status=IssueStatus.TESTING)

    issue = IssueService.update(db, issue, update_payload)

    assert issue.done_at is None