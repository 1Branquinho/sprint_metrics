import { Link } from "react-router-dom";

import type { Sprint } from "@/api/sprints";
import { formatDate } from "@/utils/date";
import { formatNumber } from "@/utils/format";
import { routes } from "@/utils/routes";

import "./SprintTable.css";

type SprintTableProps = {
  sprints: Sprint[];
};

export function SprintTable({ sprints }: SprintTableProps) {
  return (
    <div className="sprint-table-wrap">
      <table className="sprint-table">
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Inicio</th>
            <th>Fim</th>
            <th>Horas/dia</th>
            <th>Tamanho do time</th>
            <th>Capacidade maxima</th>
            <th>Observacoes</th>
            <th className="sprint-table__actions-header">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {sprints.map((sprint) => (
            <tr key={sprint.sprint_number}>
              <td>#{formatNumber(sprint.sprint_number)}</td>
              <td>{formatDate(sprint.start_date)}</td>
              <td>{formatDate(sprint.end_date)}</td>
              <td>{formatNumber(sprint.work_hours_per_day)}</td>
              <td>{formatNumber(sprint.team_size)}</td>
              <td>
                {sprint.max_team_capacity_points === null ? "-" : formatNumber(sprint.max_team_capacity_points)}
              </td>
              <td>{sprint.notes ?? "-"}</td>
              <td className="sprint-table__actions">
                <Link to={`${routes.sprintDashboard}?sprint_number=${sprint.sprint_number}`}>Abrir painel</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}