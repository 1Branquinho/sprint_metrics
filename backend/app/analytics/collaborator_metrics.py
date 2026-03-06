from datetime import date, timedelta

from app.core.enums import IssueStatus


def _safe_int(value: object) -> int:
    if value is None:
        return 0
    return int(value)


def _build_date_range(start: date, end: date) -> list[date]:
    dates: list[date] = []
    current = start
    while current <= end:
        dates.append(current)
        current = current + timedelta(days=1)
    return dates


def compute_collaborator_metrics(
    collaborator_id: int,
    issues_rows: list[dict],
    sprint_row: dict | None,
    capacities_rows: list[dict],
) -> dict:
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
        if created_at is None or done_at is None:
            continue

        lead_times.append((done_at - created_at).days)

    lead_time_days_avg = round(sum(lead_times) / len(lead_times), 2) if lead_times else None

    status_points = {
        status: sum(
            _safe_int(row.get("story_points")) for row in issues_rows if row.get("status") == status
        )
        for status in status_order
    }
    status_counts = {
        status: sum(1 for row in issues_rows if row.get("status") == status) for status in status_order
    }

    expected_points = sum(_safe_int(row.get("expected_points")) for row in capacities_rows)
    min_points = sum(_safe_int(row.get("min_points")) for row in capacities_rows)

    if sprint_row is not None:
        start_date = sprint_row["start_date"]
        end_date = sprint_row["end_date"]
        sprint_number = _safe_int(sprint_row["sprint_number"])
    elif issues_rows:
        date_candidates_start = [
            row.get("work_day") or row.get("created_at") for row in issues_rows if row.get("work_day") or row.get("created_at")
        ]
        date_candidates_end = [
            row.get("done_at") or row.get("work_day") or row.get("created_at")
            for row in issues_rows
            if row.get("done_at") or row.get("work_day") or row.get("created_at")
        ]
        start_date = min(date_candidates_start)
        end_date = max(date_candidates_end)
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
