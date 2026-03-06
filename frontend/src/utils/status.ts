import type { IssueStatus } from "@/api/issues";

const statusLabelMap: Record<IssueStatus, string> = {
  TODO: "A Fazer",
  DOING: "Em Progresso",
  "CODE REVIEW": "Revisao de Codigo",
  TESTING: "Teste",
  DONE: "Concluido",
};

export const issueStatusOptions: IssueStatus[] = ["TODO", "DOING", "CODE REVIEW", "TESTING", "DONE"];

export function issueStatusLabel(status: IssueStatus): string {
  return statusLabelMap[status];
}

export function issueStatusLabelFromUnknown(status: string): string {
  if (status in statusLabelMap) {
    return statusLabelMap[status as IssueStatus];
  }
  return status;
}