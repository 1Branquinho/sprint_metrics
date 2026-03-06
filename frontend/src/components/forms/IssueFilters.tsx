import type { Collaborator } from "@/api/collaborators";
import type { IssueStatus } from "@/api/issues";
import type { Sprint } from "@/api/sprints";
import { issueStatusLabel, issueStatusOptions } from "@/utils/status";

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
  { value: "", label: "Todos os status" },
  ...issueStatusOptions.map((status) => ({ value: status, label: issueStatusLabel(status) })),
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
          <option value="">Todas as sprints</option>
          {sprints.map((sprint) => (
            <option key={sprint.sprint_number} value={String(sprint.sprint_number)}>
              Sprint {sprint.sprint_number}
            </option>
          ))}
        </select>
      </label>

      <label>
        Responsavel
        <select value={assigneeId} onChange={(event) => onAssigneeChange(event.target.value)}>
          <option value="">Todos os responsaveis</option>
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
        Linhas
        <select value={String(limit)} onChange={(event) => onLimitChange(Number(event.target.value))}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </label>

      <button className="issue-filters__clear" onClick={onClear} type="button">
        Limpar filtros
      </button>
    </div>
  );
}