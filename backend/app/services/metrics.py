from sqlalchemy.orm import Session
from app.core.exceptions import DomainError
from app.core.cache import get_cached, set_cached
from app.analytics.sprint_metrics import compute_sprint_metrics
from app.repositories.sprint_repository import SprintRepository
from app.repositories.metrics_repository import MetricsRepository


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