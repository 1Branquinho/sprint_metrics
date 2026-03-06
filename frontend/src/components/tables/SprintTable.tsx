import { Link } from "react-router-dom";

import type { Sprint } from "@/api/sprints";
import { formatDate } from "@/utils/date";
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
            <th>Start</th>
            <th>End</th>
            <th>Work hrs/day</th>
            <th>Team size</th>
            <th>Max capacity</th>
            <th>Notes</th>
            <th className="sprint-table__actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sprints.map((sprint) => (
            <tr key={sprint.sprint_number}>
              <td>#{sprint.sprint_number}</td>
              <td>{formatDate(sprint.start_date)}</td>
              <td>{formatDate(sprint.end_date)}</td>
              <td>{sprint.work_hours_per_day}</td>
              <td>{sprint.team_size}</td>
              <td>{sprint.max_team_capacity_points ?? "-"}</td>
              <td>{sprint.notes ?? "-"}</td>
              <td className="sprint-table__actions">
                <Link to={`${routes.sprintDashboard}?sprint_number=${sprint.sprint_number}`}>Open dashboard</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
