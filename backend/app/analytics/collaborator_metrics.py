from datetime import date, timedelta

from app.core.enums import IssueStatus


def _safe_int(value: object | None) -> int:
    if value is None:
        return 0

    if isinstance(value, bool):
        return int(value)

    if isinstance(value, (int, float, str)):
        try:
            return int(value)
        except (TypeError, ValueError):
            return 0

    return 0


def _pick_row_date(row: dict[str, object], keys: tuple[str, ...]) -> date | None:
    for key in keys:
        value = row.get(key)
        if isinstance(value, date):
            return value
    return None


def _build_date_range(start: date, end: date) -> list[date]:
    dates: list[date] = []
    current = start
    while current <= end:
        dates.append(current)
        current = current + timedelta(days=1)
    return dates


def compute_collaborator_metrics(
    collaborator_id: int,
    issues_rows: list[dict[str, object]],
    sprint_row: dict[str, object] | None,
    capacities_rows: list[dict[str, object]],
) -> dict[str, object]:
    status_order = [s.value for s in IssueStatus]

    total_points = sum(_safe_int(row.get("story_points")) for row in issues_rows)
    done_points = sum(
        _safe_int(row.get("story_points")) for row in issues_rows if row.get("status") == IssueStatus.DONE
    )
    open_points = total_points - done_points

    issues_done_count = sum(1 for row in issues_rows if row.get("status") == IssueStatus.DONE)
    issues_open_count = len(issues_rows) - issues_done_count

    avg_points_per_done_issue = round(done_points / issues_done_count, 2) if issues_done_count > 0 else 0.0

    lead_times: list[int] = []
    for row in issues_rows:
        if row.get("status") != IssueStatus.DONE:
            continue

        created_at = row.get("created_at")
        done_at = row.get("done_at")
        if not isinstance(created_at, date) or not isinstance(done_at, date):
            continue

        lead_times.append((done_at - created_at).days)

    lead_time_days_avg = round(sum(lead_times) / len(lead_times), 2) if lead_times else None

    status_points = {
        status: sum(_safe_int(row.get("story_points")) for row in issues_rows if row.get("status") == status)
        for status in status_order
    }
    status_counts = {
        status: sum(1 for row in issues_rows if row.get("status") == status) for status in status_order
    }

    expected_points = sum(_safe_int(row.get("expected_points")) for row in capacities_rows)
    min_points = sum(_safe_int(row.get("min_points")) for row in capacities_rows)

    if sprint_row is not None:
        start_candidate = sprint_row.get("start_date")
        end_candidate = sprint_row.get("end_date")

        if isinstance(start_candidate, date) and isinstance(end_candidate, date):
            start_date = start_candidate
            end_date = end_candidate
        else:
            today = date.today()
            start_date = today
            end_date = today

        sprint_number = _safe_int(sprint_row.get("sprint_number"))
    elif issues_rows:
        date_candidates_start: list[date] = []
        date_candidates_end: list[date] = []

        for row in issues_rows:
            start_pick = _pick_row_date(row, ("work_day", "created_at"))
            end_pick = _pick_row_date(row, ("done_at", "work_day", "created_at"))

            if start_pick is not None:
                date_candidates_start.append(start_pick)

            if end_pick is not None:
                date_candidates_end.append(end_pick)

        if date_candidates_start and date_candidates_end:
            start_date = min(date_candidates_start)
            end_date = max(date_candidates_end)
        else:
            today = date.today()
            start_date = today
            end_date = today

        sprint_number = None
    else:
        today = date.today()
        start_date = today
        end_date = today
        sprint_number = None

    dates = _build_date_range(start_date, end_date)

    completed_daily: list[int] = []
    running_done = 0
    real_remaining: list[int] = []

    for day in dates:
        day_done = sum(
            _safe_int(row.get("story_points"))
            for row in issues_rows
            if row.get("status") == IssueStatus.DONE and row.get("done_at") == day
        )
        completed_daily.append(day_done)
        running_done += day_done
        real_remaining.append(max(total_points - running_done, 0))

    denominator = max(len(dates) - 1, 1)
    ideal_remaining = [int(round(total_points * (1 - idx / denominator))) for idx, _ in enumerate(dates)]

    return {
        "collaboratorId": collaborator_id,
        "sprintNumber": sprint_number,
        "kpis": {
            "pointsDone": done_points,
            "pointsOpen": open_points,
            "issuesDone": issues_done_count,
            "issuesOpen": issues_open_count,
            "avgPointsPerDoneIssue": avg_points_per_done_issue,
            "leadTimeDaysAvg": lead_time_days_avg,
            "expectedPoints": expected_points,
            "minPoints": min_points,
        },
        "statusTotals": {
            "byPoints": status_points,
            "byCount": status_counts,
        },
        "dailyCompletedSeries": {
            "dates": [d.isoformat() for d in dates],
            "completedPoints": completed_daily,
        },
        "burndownSeries": {
            "dates": [d.isoformat() for d in dates],
            "realRemaining": real_remaining,
            "idealRemaining": ideal_remaining,
        },
    }
