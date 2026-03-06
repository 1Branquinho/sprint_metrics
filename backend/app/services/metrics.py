from sqlalchemy.orm import Session

from app.analytics.collaborator_metrics import compute_collaborator_metrics
from app.analytics.sprint_metrics import compute_sprint_metrics
from app.core.cache import get_cached, set_cached
from app.core.exceptions import DomainError
from app.models.collaborator import Collaborator
from app.repositories.metrics_repository import MetricsRepository
from app.repositories.sprint_repository import SprintRepository


class MetricsService:
    @staticmethod
    def get_sprint_metrics(db: Session, sprint_number: int):
        cache_key = f"sprint_metrics:{sprint_number}"
        cached = get_cached(cache_key)
        if cached:
            return cached

        sprint = SprintRepository.get_by_number(db, sprint_number)
        if sprint is None:
            raise DomainError(404, "Sprint not found")

        issues = MetricsRepository.get_issues_by_sprint(db, sprint_number)
        capacities = MetricsRepository.get_capacities_by_sprint(db, sprint_number)

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

        result = compute_sprint_metrics(
            sprint_row,
            issues_rows,
            capacities_rows,
        )

        set_cached(cache_key, result, ttl=60)

        return result

    @staticmethod
    def get_collaborator_metrics(
        db: Session,
        collaborator_id: int,
        sprint_number: int | None = None,
    ):
        collaborator = db.get(Collaborator, collaborator_id)
        if collaborator is None:
            raise DomainError(404, "Collaborator not found")

        sprint_row = None
        if sprint_number is not None:
            sprint = SprintRepository.get_by_number(db, sprint_number)
            if sprint is None:
                raise DomainError(404, "Sprint not found")
            sprint_row = {
                "sprint_number": sprint.sprint_number,
                "start_date": sprint.start_date,
                "end_date": sprint.end_date,
            }

        issues = MetricsRepository.get_issues_by_collaborator(db, collaborator_id, sprint_number)
        capacities = MetricsRepository.get_capacities_by_collaborator(db, collaborator_id, sprint_number)

        issues_rows = [
            {
                "id": issue.id,
                "sprint_number": issue.sprint_number,
                "story_points": issue.story_points,
                "status": issue.status,
                "created_at": issue.created_at,
                "work_day": issue.work_day,
                "done_at": issue.done_at,
            }
            for issue in issues
        ]

        capacities_rows = [
            {
                "id": capacity.id,
                "sprint_number": capacity.sprint_number,
                "collaborator_id": capacity.collaborator_id,
                "min_points": capacity.min_points,
                "expected_points": capacity.expected_points,
            }
            for capacity in capacities
        ]

        cache_key = f"collaborator_metrics:{collaborator_id}:{sprint_number if sprint_number is not None else 'all'}"
        cached = get_cached(cache_key)
        if cached:
            return cached

        result = compute_collaborator_metrics(
            collaborator_id=collaborator_id,
            issues_rows=issues_rows,
            sprint_row=sprint_row,
            capacities_rows=capacities_rows,
        )

        set_cached(cache_key, result, ttl=60)
        return result
