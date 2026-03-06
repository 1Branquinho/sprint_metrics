import type { Page } from "@/types/common";

import { request } from "./client";

export type IssueStatus = "TODO" | "DOING" | "CODE REVIEW" | "TESTING" | "DONE";

export type Issue = {
  id: number;
  sprint_number: number;
  issue_number: string;
  gitlab_url: string | null;
  title: string;
  story_points: number;
  assignee_id: number;
  status: IssueStatus;
  created_at: string;
  work_day: string;
  done_at: string | null;
};

export type IssueFilters = {
  sprint_number?: number;
  assignee_id?: number;
  status?: IssueStatus;
  limit?: number;
  offset?: number;
};

export type IssueCreateInput = {
  sprint_number: number;
  issue_number: string;
  gitlab_url: string | null;
  title: string;
  story_points: number;
  assignee_id: number;
  status: IssueStatus;
  created_at: string;
  work_day: string;
};

export type IssueUpdateInput = Partial<IssueCreateInput>;

export function listIssues(filters: IssueFilters): Promise<Page<Issue>> {
  return request<Page<Issue>>("/issues", { query: filters });
}

export function createIssue(payload: IssueCreateInput): Promise<Issue> {
  return request<Issue>("/issues", { method: "POST", body: payload });
}

export function updateIssue(issueId: number, payload: IssueUpdateInput): Promise<Issue> {
  return request<Issue>(`/issues/${issueId}`, { method: "PUT", body: payload });
}

export function deleteIssue(issueId: number): Promise<void> {
  return request<void>(`/issues/${issueId}`, { method: "DELETE" });
}
