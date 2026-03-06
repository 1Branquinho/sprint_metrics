import type { Page } from "@/types/common";
import { request } from "./client";

export type Capacity = {
  id: number;
  sprint_number: number;
  collaborator_id: number;
  min_points: number;
  expected_points: number;
};

export function listCapacities(params: {
  sprint_number?: number;
  collaborator_id?: number;
  limit?: number;
  offset?: number;
}): Promise<Page<Capacity>> {
  return request<Page<Capacity>>("/capacities", { query: params });
}
