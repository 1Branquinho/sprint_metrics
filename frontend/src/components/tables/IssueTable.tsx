import type { Collaborator } from "@/api/collaborators";
import type { Issue, IssueStatus } from "@/api/issues";
import { formatDate } from "@/utils/date";
import { formatNumber } from "@/utils/format";
import { issueStatusLabel, issueStatusOptions } from "@/utils/status";

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
            <th>Titulo</th>
            <th>Story points</th>
            <th>Responsavel</th>
            <th>Status</th>
            <th>Criada em</th>
            <th>Dia de trabalho</th>
            <th>Concluida em</th>
            <th className="issue-table__actions-header">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>{issue.issue_number}</td>
              <td>{issue.title}</td>
              <td>{formatNumber(issue.story_points)}</td>
              <td>{collaboratorMap.get(issue.assignee_id) ?? `#${formatNumber(issue.assignee_id)}`}</td>
              <td>
                <div className="issue-table__status-cell">
                  <IssueStatusBadge status={issue.status} />
                  <select
                    disabled={statusUpdatingId === issue.id}
                    onChange={(event) => onChangeStatus(issue, event.target.value as IssueStatus)}
                    value={issue.status}
                  >
                    {issueStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {issueStatusLabel(status)}
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
                  Editar
                </button>
                <button className="danger" onClick={() => onDelete(issue)} type="button">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}