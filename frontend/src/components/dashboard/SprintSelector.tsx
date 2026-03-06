import type { Sprint } from "@/api/sprints";

import "./SprintSelector.css";

type SprintSelectorProps = {
  sprintNumber: number | null;
  sprints: Sprint[];
  onChange: (sprintNumber: number) => void;
};

export function SprintSelector({ sprintNumber, sprints, onChange }: SprintSelectorProps) {
  return (
    <label className="sprint-selector">
      Sprint
      <select
        value={sprintNumber === null ? "" : String(sprintNumber)}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {sprints.length === 0 ? <option value="">Sem sprints disponiveis</option> : null}
        {sprints.map((sprint) => (
          <option key={sprint.sprint_number} value={String(sprint.sprint_number)}>
            Sprint {sprint.sprint_number}
          </option>
        ))}
      </select>
    </label>
  );
}