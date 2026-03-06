import type { Collaborator } from "@/api/collaborators";
import type { IssueStatus } from "@/api/issues";
import type { Sprint } from "@/api/sprints";

import "./IssueFilters.css";

type IssueFiltersProps = {
  sprintNumber: string;
  assigneeId: string;
  status: "" | IssueStatus;
  limit: number;
  sprints: Sprint[];
  collaborators: Collaborator[];
  onSprintChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onStatusChange: (value: "" | IssueStatus) => void;
  onLimitChange: (value: number) => void;
  onClear: () => void;
};

const statusOptions: Array<{ value: "" | IssueStatus; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "TODO", label: "TODO" },
  { value: "DOING", label: "DOING" },
  { value: "CODE REVIEW", label: "CODE REVIEW" },
  { value: "TESTING", label: "TESTING" },
  { value: "DONE", label: "DONE" },
];

export function IssueFilters({
  sprintNumber,
  assigneeId,
  status,
  limit,
  sprints,
  collaborators,
  onSprintChange,
  onAssigneeChange,
  onStatusChange,
  onLimitChange,
  onClear,
}: IssueFiltersProps) {
  return (
    <div className="issue-filters">
      <label>
        Sprint
        <select value={sprintNumber} onChange={(event) => onSprintChange(event.target.value)}>
          <option value="">All sprints</option>
          {sprints.map((sprint) => (
            <option key={sprint.sprint_number} value={String(sprint.sprint_number)}>
              Sprint {sprint.sprint_number}
            </option>
          ))}
        </select>
      </label>

      <label>
        Assignee
        <select value={assigneeId} onChange={(event) => onAssigneeChange(event.target.value)}>
          <option value="">All assignees</option>
          {collaborators.map((collaborator) => (
            <option key={collaborator.id} value={String(collaborator.id)}>
              {collaborator.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Status
        <select
          value={status}
          onChange={(event) => onStatusChange((event.target.value || "") as "" | IssueStatus)}
        >
          {statusOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Rows
        <select value={String(limit)} onChange={(event) => onLimitChange(Number(event.target.value))}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </label>

      <button className="issue-filters__clear" onClick={onClear} type="button">
        Clear filters
      </button>
    </div>
  );
}
