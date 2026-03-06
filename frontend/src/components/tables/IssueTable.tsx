import type { Collaborator } from "@/api/collaborators";
import type { Issue, IssueStatus } from "@/api/issues";
import { formatDate } from "@/utils/date";

import { IssueStatusBadge } from "@/components/common/IssueStatusBadge";

import "./IssueTable.css";

type IssueTableProps = {
  issues: Issue[];
  collaborators: Collaborator[];
  statusUpdatingId: number | null;
  onEdit: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
  onChangeStatus: (issue: Issue, status: IssueStatus) => void;
};

const statusOptions: IssueStatus[] = ["TODO", "DOING", "CODE REVIEW", "TESTING", "DONE"];

export function IssueTable({
  issues,
  collaborators,
  statusUpdatingId,
  onEdit,
  onDelete,
  onChangeStatus,
}: IssueTableProps) {
  const collaboratorMap = new Map(collaborators.map((c) => [c.id, c.name]));

  return (
    <div className="issue-table-wrap">
      <table className="issue-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Title</th>
            <th>Story points</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Created</th>
            <th>Work day</th>
            <th>Done at</th>
            <th className="issue-table__actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>{issue.issue_number}</td>
              <td>{issue.title}</td>
              <td>{issue.story_points}</td>
              <td>{collaboratorMap.get(issue.assignee_id) ?? `#${issue.assignee_id}`}</td>
              <td>
                <div className="issue-table__status-cell">
                  <IssueStatusBadge status={issue.status} />
                  <select
                    disabled={statusUpdatingId === issue.id}
                    onChange={(event) => onChangeStatus(issue, event.target.value as IssueStatus)}
                    value={issue.status}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td>{formatDate(issue.created_at)}</td>
              <td>{formatDate(issue.work_day)}</td>
              <td>{formatDate(issue.done_at)}</td>
              <td className="issue-table__actions">
                <button onClick={() => onEdit(issue)} type="button">
                  Edit
                </button>
                <button className="danger" onClick={() => onDelete(issue)} type="button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
