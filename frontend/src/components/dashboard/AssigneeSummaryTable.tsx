import type { AssigneeSummary } from "@/api/metrics";
import type { Collaborator } from "@/api/collaborators";

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
        <h3>Summary by assignee</h3>
      </header>
      <div className="assignee-summary__table-wrap">
        <table className="assignee-summary__table">
          <thead>
            <tr>
              <th>Assignee</th>
              <th>Points done</th>
              <th>Points open</th>
              <th>Issues done</th>
              <th>Issues open</th>
              <th>Expected points</th>
              <th>Min points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.assignee_id}>
                <td>{collaboratorMap.get(row.assignee_id) ?? `#${row.assignee_id}`}</td>
                <td>{row.points_done}</td>
                <td>{row.points_open}</td>
                <td>{row.issues_done_count}</td>
                <td>{row.issues_open_count}</td>
                <td>{row.expected_points}</td>
                <td>{row.min_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
