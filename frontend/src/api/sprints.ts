import type { Page } from "@/types/common";

import { request } from "./client";

export type Sprint = {
  sprint_number: number;
  start_date: string;
  end_date: string;
  work_hours_per_day: number;
  team_size: number;
  max_team_capacity_points: number | null;
  notes: string | null;
};

export type SprintCreateInput = {
  sprint_number: number;
  start_date: string;
  end_date: string;
  work_hours_per_day: number;
  team_size: number;
  max_team_capacity_points: number | null;
  notes: string | null;
};

export function listSprints(limit = 50, offset = 0): Promise<Page<Sprint>> {
  return request<Page<Sprint>>("/sprints", { query: { limit, offset } });
}

export function createSprint(payload: SprintCreateInput): Promise<Sprint> {
  return request<Sprint>("/sprints", { method: "POST", body: payload });
}
