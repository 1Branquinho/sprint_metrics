import { Link } from "react-router-dom";

import type { Collaborator } from "@/api/collaborators";
import { formatNumber } from "@/utils/format";
import { routes } from "@/utils/routes";

import "./CollaboratorTable.css";

type CollaboratorTableProps = {
  collaborators: Collaborator[];
};

export function CollaboratorTable({ collaborators }: CollaboratorTableProps) {
  return (
    <div className="collaborator-table-wrap">
      <table className="collaborator-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Status</th>
            <th className="collaborator-table__actions-header">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {collaborators.map((collaborator) => (
            <tr key={collaborator.id}>
              <td>#{formatNumber(collaborator.id)}</td>
              <td>{collaborator.name}</td>
              <td>
                <span
                  className={
                    collaborator.active
                      ? "collaborator-table__status collaborator-table__status--active"
                      : "collaborator-table__status collaborator-table__status--inactive"
                  }
                >
                  {collaborator.active ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="collaborator-table__actions">
                <Link
                  to={`${routes.collaboratorDashboard}?collaborator_id=${collaborator.id}`}
                >
                  Abrir painel
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}