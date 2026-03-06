import pytest
from fastapi.testclient import TestClient

from app.core.enums import IssueStatus
from app.db.deps import get_db
from app.main import app


@pytest.fixture
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def _create_sprint(client: TestClient, sprint_number: int = 1):
    return client.post(
        "/sprints",
        json={
            "sprint_number": sprint_number,
            "start_date": "2024-01-01",
            "end_date": "2024-01-10",
            "work_hours_per_day": 8,
            "team_size": 2,
            "max_team_capacity_points": None,
            "notes": None,
        },
    )


def _create_collaborator(client: TestClient, name: str = "John"):
    return client.post("/collaborators", json={"name": name, "active": True})


def _create_issue(client: TestClient, assignee_id: int, sprint_number: int = 1):
    return client.post(
        "/issues",
        json={
            "sprint_number": sprint_number,
            "issue_number": "ISSUE-1",
            "gitlab_url": None,
            "title": "Test issue",
            "story_points": 5,
            "assignee_id": assignee_id,
            "status": IssueStatus.TODO,
            "created_at": "2024-01-01",
            "work_day": "2024-01-02",
        },
    )


def test_sprints_create_and_duplicate_conflict(client: TestClient):
    created = _create_sprint(client, sprint_number=7)
    assert created.status_code == 201

    duplicate = _create_sprint(client, sprint_number=7)
    assert duplicate.status_code == 409
    assert duplicate.json()["detail"] == "Sprint already exists"


def test_sprints_list_limit_validation_returns_400(client: TestClient):
    response = client.get("/sprints", params={"limit": 0})
    assert response.status_code == 400
    assert "limit" in response.json()["detail"]


def test_issue_create_missing_references_returns_404(client: TestClient):
    response = client.post(
        "/issues",
        json={
            "sprint_number": 999,
            "issue_number": "ISSUE-404",
            "gitlab_url": None,
            "title": "Missing refs",
            "story_points": 3,
            "assignee_id": 999,
            "status": IssueStatus.TODO,
            "created_at": "2024-01-01",
            "work_day": "2024-01-02",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Sprint not found"


def test_capacity_duplicate_returns_409(client: TestClient):
    sprint = _create_sprint(client, sprint_number=1)
    assert sprint.status_code == 201

    collaborator = _create_collaborator(client, name="Alice")
    assert collaborator.status_code == 201
    collaborator_id = collaborator.json()["id"]

    payload = {
        "sprint_number": 1,
        "collaborator_id": collaborator_id,
        "min_points": 3,
        "expected_points": 5,
    }

    first = client.post("/capacities", json=payload)
    assert first.status_code == 201

    duplicate = client.post("/capacities", json=payload)
    assert duplicate.status_code == 409


def test_issues_list_and_metrics_happy_path(client: TestClient):
    sprint = _create_sprint(client, sprint_number=5)
    assert sprint.status_code == 201

    collaborator = _create_collaborator(client, name="Bob")
    assert collaborator.status_code == 201
    collaborator_id = collaborator.json()["id"]

    capacity = client.post(
        "/capacities",
        json={
            "sprint_number": 5,
            "collaborator_id": collaborator_id,
            "min_points": 2,
            "expected_points": 8,
        },
    )
    assert capacity.status_code == 201

    issue = _create_issue(client, assignee_id=collaborator_id, sprint_number=5)
    assert issue.status_code == 201

    issues_response = client.get("/issues", params={"sprint_number": 5, "status": IssueStatus.TODO})
    assert issues_response.status_code == 200
    body = issues_response.json()
    assert body["total"] == 1
    assert body["items"][0]["issue_number"] == "ISSUE-1"

    metrics_response = client.get("/metrics/sprint/5")
    assert metrics_response.status_code == 200
    metrics = metrics_response.json()
    assert metrics["sprintNumber"] == 5
    assert metrics["sprintInfo"]["totalStoryPoints"] == 5


def test_metrics_not_found_returns_404(client: TestClient):
    response = client.get("/metrics/sprint/12345")
    assert response.status_code == 404
    assert response.json()["detail"] == "Sprint not found"
