from datetime import date, timedelta
import pandas as pd

def compute_sprint_metrics(
    sprint_row: dict,
    issues_rows: list[dict],
    capacities_rows: list[dict],
) -> dict:
    sprint_number = int(sprint_row["sprint_number"])
    start_date = sprint_row["start_date"]
    end_date = sprint_row["end_date"]
    work_hours_per_day = int(sprint_row["work_hours_per_day"])
    team_size = int(sprint_row["team_size"])

    sprint_days = (end_date - start_date).days + 1
    total_hours = sprint_days * team_size * work_hours_per_day

    issues_df = pd.DataFrame(issues_rows)
    if issues_df.empty:
        issues_df = pd.DataFrame(columns=["story_points", "status", "assignee_id", "done_at"])

    issues_df["story_points"] = pd.to_numeric(issues_df["story_points"], errors="coerce").fillna(0).astype(int)

    total_story_points = int(issues_df["story_points"].sum())
    done_story_points = int(issues_df.loc[issues_df["status"] == "DONE", "story_points"].sum())
    open_story_points = int(issues_df.loc[issues_df["status"] != "DONE", "story_points"].sum())

    status_order = ["TODO", "DOING", "QA", "DONE"]
    status_points = {s: int(issues_df.loc[issues_df["status"] == s, "story_points"].sum()) for s in status_order}
    status_counts = {s: int((issues_df["status"] == s).sum()) for s in status_order}

    capacities_df = pd.DataFrame(capacities_rows)
    if capacities_df.empty:
        capacities_df = pd.DataFrame(columns=["collaborator_id", "min_points", "expected_points"])

    capacities_df["expected_points"] = pd.to_numeric(capacities_df["expected_points"], errors="coerce").fillna(0).astype(int)
    capacities_df["min_points"] = pd.to_numeric(capacities_df["min_points"], errors="coerce").fillna(0).astype(int)

    expected_total_sp = int(capacities_df["expected_points"].sum())

    dates = []
    d = start_date
    while d <= end_date:
        dates.append(d)
        d = d + timedelta(days=1)

    if "done_at" in issues_df.columns:
        issues_df["done_at"] = pd.to_datetime(issues_df["done_at"], errors="coerce").dt.date
    else:
        issues_df["done_at"] = pd.Series([], dtype="object")

    completed_daily = []
    done_cum = []
    running_done = 0

    for day in dates:
        day_done = int(issues_df.loc[issues_df["done_at"] == day, "story_points"].sum())
        running_done += day_done
        completed_daily.append(day_done)
        done_cum.append(running_done)

    real_remaining = [max(total_story_points - x, 0) for x in done_cum]

    ideal_remaining = []
    expected_remaining = []
    for idx, _day in enumerate(dates):
        t = idx / sprint_days
        ideal_remaining.append(int(round(total_story_points * (1 - t))))
        expected_remaining.append(int(round(expected_total_sp * (1 - t))))

    per_assignee = []
    if not issues_df.empty:
        base = issues_df.groupby("assignee_id").agg(
            issues_done_count=("status", lambda s: int((s == "DONE").sum())),
            issues_open_count=("status", lambda s: int((s != "DONE").sum())),
            points_done=("story_points", lambda sp: int(sp.loc[issues_df["status"] == "DONE"].sum())),
            points_open=("story_points", lambda sp: int(sp.loc[issues_df["status"] != "DONE"].sum())),
            total_points=("story_points", "sum"),
            total_issues=("status", "count"),
        ).reset_index()
        per_assignee = base.to_dict(orient="records")

    cap_map = capacities_df.groupby("collaborator_id").agg(
        min_points=("min_points", "sum"),
        expected_points=("expected_points", "sum"),
    ).reset_index()

    if per_assignee:
        per_df = pd.DataFrame(per_assignee)
        merged = per_df.merge(cap_map, how="left", left_on="assignee_id", right_on="collaborator_id")
        merged["min_points"] = pd.to_numeric(merged["min_points"], errors="coerce").fillna(0).astype(int)
        merged["expected_points"] = pd.to_numeric(merged["expected_points"], errors="coerce").fillna(0).astype(int)
        merged = merged.drop(columns=["collaborator_id"])
        per_assignee = merged.to_dict(orient="records")
    else:
        per_assignee = []

    return {
        "sprintNumber": sprint_number,
        "sprintInfo": {
            "sprintDays": sprint_days,
            "totalHours": total_hours,
            "totalStoryPoints": total_story_points,
            "doneStoryPoints": done_story_points,
            "openStoryPoints": open_story_points,
            "statusPoints": status_points,
            "statusCounts": status_counts,
            "expectedTotalStoryPoints": expected_total_sp,
        },
        "statusTotals": {
            "byPoints": status_points,
            "byCount": status_counts,
        },
        "perAssigneeSummary": per_assignee,
        "burndownSeries": {
            "dates": [d.isoformat() for d in dates],
            "completedDaily": completed_daily,
            "realRemaining": real_remaining,
            "idealRemaining": ideal_remaining,
            "expectedRemaining": expected_remaining,
        },
    }
