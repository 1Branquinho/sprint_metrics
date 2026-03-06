import type { Capacity } from "@/api/capacities";
import type { Collaborator } from "@/api/collaborators";
import { formatNumber } from "@/utils/format";

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
            <th>Colaborador</th>
            <th>Pontos minimos</th>
            <th>Pontos esperados</th>
          </tr>
        </thead>
        <tbody>
          {capacities.map((capacity) => (
            <tr key={capacity.id}>
              <td>#{formatNumber(capacity.sprint_number)}</td>
              <td>
                {collaboratorMap.get(capacity.collaborator_id) ?? `#${formatNumber(capacity.collaborator_id)}`}
              </td>
              <td>{formatNumber(capacity.min_points)}</td>
              <td>{formatNumber(capacity.expected_points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}