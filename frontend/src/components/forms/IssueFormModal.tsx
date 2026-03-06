import { useEffect, useMemo, useState, type FormEvent } from "react";

import type { Collaborator } from "@/api/collaborators";
import type { Issue, IssueCreateInput, IssueStatus, IssueUpdateInput } from "@/api/issues";
import type { Sprint } from "@/api/sprints";
import { issueStatusLabel, issueStatusOptions } from "@/utils/status";

import "./IssueFormModal.css";

type IssueFormModalProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  issue: Issue | null;
  sprints: Sprint[];
  collaborators: Collaborator[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (payload: IssueCreateInput | IssueUpdateInput) => void;
};

type FormState = {
  sprint_number: string;
  issue_number: string;
  gitlab_url: string;
  title: string;
  story_points: string;
  assignee_id: string;
  status: IssueStatus;
  created_at: string;
  work_day: string;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function toFormState(issue: Issue | null): FormState {
  if (!issue) {
    return {
      sprint_number: "",
      issue_number: "",
      gitlab_url: "",
      title: "",
      story_points: "0",
      assignee_id: "",
      status: "TODO",
      created_at: todayIso(),
      work_day: todayIso(),
    };
  }

  return {
    sprint_number: String(issue.sprint_number),
    issue_number: issue.issue_number,
    gitlab_url: issue.gitlab_url ?? "",
    title: issue.title,
    story_points: String(issue.story_points),
    assignee_id: String(issue.assignee_id),
    status: issue.status,
    created_at: issue.created_at.slice(0, 10),
    work_day: issue.work_day.slice(0, 10),
  };
}

export function IssueFormModal({
  isOpen,
  mode,
  issue,
  sprints,
  collaborators,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: IssueFormModalProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(issue));

  useEffect(() => {
    if (isOpen) {
      setForm(toFormState(issue));
    }
  }, [isOpen, issue]);

  const isValid = useMemo(() => {
    return (
      form.sprint_number !== "" &&
      form.assignee_id !== "" &&
      form.issue_number.trim() !== "" &&
      form.title.trim() !== "" &&
      form.created_at !== "" &&
      form.work_day !== ""
    );
  }, [form]);

  if (!isOpen) {
    return null;
  }

  function handleFieldChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: IssueCreateInput = {
      sprint_number: Number(form.sprint_number),
      issue_number: form.issue_number.trim(),
      gitlab_url: form.gitlab_url.trim() === "" ? null : form.gitlab_url.trim(),
      title: form.title.trim(),
      story_points: Number(form.story_points),
      assignee_id: Number(form.assignee_id),
      status: form.status,
      created_at: form.created_at,
      work_day: form.work_day,
    };

    onSubmit(mode === "create" ? payload : payload);
  }

  return (
    <div className="issue-modal__backdrop" role="presentation">
      <div aria-modal="true" className="issue-modal" role="dialog">
        <header className="issue-modal__header">
          <h3>{mode === "create" ? "Nova issue" : `Editar issue #${issue?.id}`}</h3>
          <button onClick={onClose} type="button">
            Fechar
          </button>
        </header>

        <form className="issue-modal__form" onSubmit={handleSubmit}>
          <label>
            Sprint
            <select
              required
              value={form.sprint_number}
              onChange={(event) => handleFieldChange("sprint_number", event.target.value)}
            >
              <option value="">Selecione a sprint</option>
              {sprints.map((sprint) => (
                <option key={sprint.sprint_number} value={String(sprint.sprint_number)}>
                  Sprint {sprint.sprint_number}
                </option>
              ))}
            </select>
          </label>

          <label>
            Numero da issue
            <input
              required
              value={form.issue_number}
              onChange={(event) => handleFieldChange("issue_number", event.target.value)}
              placeholder="ISSUE-123"
            />
          </label>

          <label>
            Titulo
            <input
              required
              value={form.title}
              onChange={(event) => handleFieldChange("title", event.target.value)}
              placeholder="Descreva o item de trabalho"
            />
          </label>

          <label>
            URL do GitLab
            <input
              value={form.gitlab_url}
              onChange={(event) => handleFieldChange("gitlab_url", event.target.value)}
              placeholder="https://gitlab..."
            />
          </label>

          <label>
            Story points
            <input
              min={0}
              required
              type="number"
              value={form.story_points}
              onChange={(event) => handleFieldChange("story_points", event.target.value)}
            />
          </label>

          <label>
            Responsavel
            <select
              required
              value={form.assignee_id}
              onChange={(event) => handleFieldChange("assignee_id", event.target.value)}
            >
              <option value="">Selecione o responsavel</option>
              {collaborators.map((collaborator) => (
                <option key={collaborator.id} value={String(collaborator.id)}>
                  {collaborator.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select value={form.status} onChange={(event) => handleFieldChange("status", event.target.value as IssueStatus)}>
              {issueStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {issueStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Criada em
            <input
              required
              type="date"
              value={form.created_at}
              onChange={(event) => handleFieldChange("created_at", event.target.value)}
            />
          </label>

          <label>
            Dia de trabalho
            <input
              required
              type="date"
              value={form.work_day}
              onChange={(event) => handleFieldChange("work_day", event.target.value)}
            />
          </label>

          {errorMessage ? <p className="issue-modal__error">{errorMessage}</p> : null}

          <footer className="issue-modal__footer">
            <button onClick={onClose} type="button">
              Cancelar
            </button>
            <button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? "Salvando..." : mode === "create" ? "Criar" : "Salvar"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}