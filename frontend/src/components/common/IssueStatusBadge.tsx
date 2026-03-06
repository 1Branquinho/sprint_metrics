import type { IssueStatus } from "@/api/issues";
import { issueStatusLabel } from "@/utils/status";

import "./IssueStatusBadge.css";

const statusClassMap: Record<IssueStatus, string> = {
  TODO: "status-badge status-badge--todo",
  DOING: "status-badge status-badge--doing",
  "CODE REVIEW": "status-badge status-badge--review",
  TESTING: "status-badge status-badge--testing",
  DONE: "status-badge status-badge--done",
};

type IssueStatusBadgeProps = {
  status: IssueStatus;
};

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  return <span className={statusClassMap[status]}>{issueStatusLabel(status)}</span>;
}