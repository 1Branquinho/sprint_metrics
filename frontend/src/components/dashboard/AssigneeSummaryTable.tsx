import type { AssigneeSummary } from "@/api/metrics";
import type { Collaborator } from "@/api/collaborators";
import { formatNumber } from "@/utils/format";

import "./AssigneeSummaryTable.css";

type AssigneeSummaryTableProps = {
  rows: AssigneeSummary[];
  collaborators: Collaborator[];
};

export function AssigneeSummaryTable({ rows, collaborators }: AssigneeSummaryTableProps) {
  const collaboratorMap = new Map(collaborators.map((c) => [c.id, c.name]));

  return (
    <section className="assignee-summary">
      <header>
        <h3>Resumo por responsavel</h3>
      </header>
      <div className="assignee-summary__table-wrap">
        <table className="assignee-summary__table">
          <thead>
            <tr>
              <th>Responsavel</th>
              <th>Pontos concluidos</th>
              <th>Pontos em aberto</th>
              <th>Issues concluidas</th>
              <th>Issues em aberto</th>
              <th>Pontos esperados</th>
              <th>Pontos minimos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.assignee_id}>
                <td>{collaboratorMap.get(row.assignee_id) ?? `#${formatNumber(row.assignee_id)}`}</td>
                <td>{formatNumber(row.points_done)}</td>
                <td>{formatNumber(row.points_open)}</td>
                <td>{formatNumber(row.issues_done_count)}</td>
                <td>{formatNumber(row.issues_open_count)}</td>
                <td>{formatNumber(row.expected_points)}</td>
                <td>{formatNumber(row.min_points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}