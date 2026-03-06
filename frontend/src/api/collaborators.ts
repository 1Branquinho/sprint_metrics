import type { Page } from "@/types/common";
import { request } from "./client";

export type Collaborator = {
  id: number;
  name: string;
  active: boolean;
};

export function listCollaborators(active?: boolean, limit = 50, offset = 0): Promise<Page<Collaborator>> {
  return request<Page<Collaborator>>("/collaborators", { query: { active, limit, offset } });
}
