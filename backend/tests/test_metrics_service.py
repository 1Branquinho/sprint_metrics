from datetime import date

from app.core.enums import IssueStatus
from app.models.collaborator import Collaborator
from app.models.collaborator_capacity import CollaboratorCapacity
from app.models.issue import Issue
from app.models.sprint import Sprint
from app.schemas.issue import IssueCreate
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


def test_collaborator_metrics_with_sprint_scope(db):
    sprint = Sprint(
        sprint_number=2,
        start_date=date(2024, 2, 1),
        end_date=date(2024, 2, 5),
        work_hours_per_day=8,
        team_size=2,
    )

    collaborator = Collaborator(name="Alice", active=True)

    db.add(sprint)
    db.add(collaborator)
    db.commit()

    db.add(
        CollaboratorCapacity(
            sprint_number=2,
            collaborator_id=collaborator.id,
            min_points=2,
            expected_points=7,
        )
    )

    done_issue = Issue(
        sprint_number=2,
        issue_number="ISSUE-DONE",
        gitlab_url=None,
        title="Done issue",
        story_points=3,
        assignee_id=collaborator.id,
        status=IssueStatus.DONE,
        created_at=date(2024, 2, 1),
        work_day=date(2024, 2, 2),
        done_at=date(2024, 2, 3),
    )

    open_issue = Issue(
        sprint_number=2,
        issue_number="ISSUE-OPEN",
        gitlab_url=None,
        title="Open issue",
        story_points=5,
        assignee_id=collaborator.id,
        status=IssueStatus.DOING,
        created_at=date(2024, 2, 1),
        work_day=date(2024, 2, 2),
        done_at=None,
    )

    db.add(done_issue)
    db.add(open_issue)
    db.commit()

    result = MetricsService.get_collaborator_metrics(db, collaborator.id, sprint_number=2)

    assert result["collaboratorId"] == collaborator.id
    assert result["sprintNumber"] == 2

    assert result["kpis"]["pointsDone"] == 3
    assert result["kpis"]["pointsOpen"] == 5
    assert result["kpis"]["issuesDone"] == 1
    assert result["kpis"]["issuesOpen"] == 1
    assert result["kpis"]["avgPointsPerDoneIssue"] == 3.0
    assert result["kpis"]["leadTimeDaysAvg"] == 2.0
    assert result["kpis"]["expectedPoints"] == 7
    assert result["kpis"]["minPoints"] == 2

    assert result["statusTotals"]["byPoints"][IssueStatus.DONE] == 3
    assert result["statusTotals"]["byPoints"][IssueStatus.DOING] == 5

    assert len(result["dailyCompletedSeries"]["dates"]) == 5
    assert result["dailyCompletedSeries"]["completedPoints"][2] == 3
