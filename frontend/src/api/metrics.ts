import { request } from "./client";

export type SprintInfo = {
  sprintDays: number;
  totalHours: number;
  totalStoryPoints: number;
  doneStoryPoints: number;
  openStoryPoints: number;
  statusPoints: Record<string, number>;
  statusCounts: Record<string, number>;
  expectedTotalStoryPoints: number;
};

export type StatusTotals = {
  byPoints: Record<string, number>;
  byCount: Record<string, number>;
};

export type AssigneeSummary = {
  assignee_id: number;
  issues_done_count: number;
  issues_open_count: number;
  points_done: number;
  points_open: number;
  total_points: number;
  total_issues: number;
  min_points: number;
  expected_points: number;
};

export type BurndownSeries = {
  dates: string[];
  completedDaily: number[];
  realRemaining: number[];
  idealRemaining: number[];
  expectedRemaining: number[];
};

export type SprintMetricsResponse = {
  sprintNumber: number;
  sprintInfo: SprintInfo;
  statusTotals: StatusTotals;
  perAssigneeSummary: AssigneeSummary[];
  burndownSeries: BurndownSeries;
};

export function getSprintMetrics(sprintNumber: number): Promise<SprintMetricsResponse> {
  return request<SprintMetricsResponse>(`/metrics/sprint/${sprintNumber}`);
}
