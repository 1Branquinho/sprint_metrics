import { request } from "./client";

export type CollaboratorMetricsKpis = {
  pointsDone: number;
  pointsOpen: number;
  issuesDone: number;
  issuesOpen: number;
  avgPointsPerDoneIssue: number;
  leadTimeDaysAvg: number | null;
  expectedPoints: number;
  minPoints: number;
};

export type CollaboratorDailyCompletedSeries = {
  dates: string[];
  completedPoints: number[];
};

export type CollaboratorBurndownSeries = {
  dates: string[];
  realRemaining: number[];
  idealRemaining: number[];
};

export type CollaboratorMetricsResponse = {
  collaboratorId: number;
  sprintNumber: number | null;
  kpis: CollaboratorMetricsKpis;
  statusTotals: {
    byPoints: Record<string, number>;
    byCount: Record<string, number>;
  };
  dailyCompletedSeries: CollaboratorDailyCompletedSeries;
  burndownSeries: CollaboratorBurndownSeries;
};

export function getCollaboratorMetrics(
  collaboratorId: number,
  sprintNumber?: number,
): Promise<CollaboratorMetricsResponse> {
  return request<CollaboratorMetricsResponse>(`/metrics/collaborator/${collaboratorId}`, {
    query: { sprint_number: sprintNumber },
  });
}
