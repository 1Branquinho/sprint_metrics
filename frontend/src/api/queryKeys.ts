export const queryKeys = {
  issues: (params?: Record<string, unknown>) => ["issues", params ?? {}] as const,
  sprints: (params?: Record<string, unknown>) => ["sprints", params ?? {}] as const,
  collaborators: (params?: Record<string, unknown>) => ["collaborators", params ?? {}] as const,
  capacities: (params?: Record<string, unknown>) => ["capacities", params ?? {}] as const,
  sprintMetrics: (sprintNumber: number | null) => ["sprintMetrics", sprintNumber] as const,
  collaboratorMetrics: (collaboratorId: number | null, sprintNumber?: number | null) =>
    ["collaboratorMetrics", collaboratorId, sprintNumber ?? null] as const,
};
