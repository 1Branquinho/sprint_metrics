import type { Collaborator } from "@/api/collaborators";
import type { Sprint } from "@/api/sprints";

import "./CapacityFilters.css";

type CapacityFiltersProps = {
  sprintNumber: string;
  collaboratorId: string;
  limit: number;
  sprints: Sprint[];
  collaborators: Collaborator[];
  onSprintChange: (value: string) => void;
  onCollaboratorChange: (value: string) => void;
  onLimitChange: (value: number) => void;
  onClear: () => void;
};

export function CapacityFilters({
  sprintNumber,
  collaboratorId,
  limit,
  sprints,
  collaborators,
  onSprintChange,
  onCollaboratorChange,
  onLimitChange,
  onClear,
}: CapacityFiltersProps) {
  return (
    <div className="capacity-filters">
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
        Colaborador
        <select value={collaboratorId} onChange={(event) => onCollaboratorChange(event.target.value)}>
          <option value="">Todos os colaboradores</option>
          {collaborators.map((collaborator) => (
            <option key={collaborator.id} value={String(collaborator.id)}>
              {collaborator.name}
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

      <button className="capacity-filters__clear" onClick={onClear} type="button">
        Limpar filtros
      </button>
    </div>
  );
}