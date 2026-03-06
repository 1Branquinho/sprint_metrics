import type { Capacity } from "@/api/capacities";
import type { Collaborator } from "@/api/collaborators";

import "./CapacityTable.css";

type CapacityTableProps = {
  capacities: Capacity[];
  collaborators: Collaborator[];
};

export function CapacityTable({ capacities, collaborators }: CapacityTableProps) {
  const collaboratorMap = new Map(collaborators.map((c) => [c.id, c.name]));

  return (
    <div className="capacity-table-wrap">
      <table className="capacity-table">
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Collaborator</th>
            <th>Min points</th>
            <th>Expected points</th>
          </tr>
        </thead>
        <tbody>
          {capacities.map((capacity) => (
            <tr key={capacity.id}>
              <td>#{capacity.sprint_number}</td>
              <td>{collaboratorMap.get(capacity.collaborator_id) ?? `#${capacity.collaborator_id}`}</td>
              <td>{capacity.min_points}</td>
              <td>{capacity.expected_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
