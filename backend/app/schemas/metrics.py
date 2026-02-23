from pydantic import BaseModel

class SprintInfo(BaseModel):
    sprintDays: int
    totalHours: int
    totalStoryPoints: int
    doneStoryPoints: int
    openStoryPoints: int
    statusPoints: dict[str, int]
    statusCounts: dict[str, int]
    expectedTotalStoryPoints: int

class StatusTotals(BaseModel):
    byPoints: dict[str, int]
    byCount: dict[str, int]

class AssigneeSummary(BaseModel):
    assignee_id: int
    issues_done_count: int
    issues_open_count: int
    points_done: int
    points_open: int
    total_points: int
    total_issues: int
    min_points: int
    expected_points: int

class BurndownSeries(BaseModel):
    dates: list[str]
    completedDaily: list[int]
    realRemaining: list[int]
    idealRemaining: list[int]
    expectedRemaining: list[int]

class SprintMetricsResponse(BaseModel):
    sprintNumber: int
    sprintInfo: SprintInfo
    statusTotals: StatusTotals
    perAssigneeSummary: list[AssigneeSummary]
    burndownSeries: BurndownSeries