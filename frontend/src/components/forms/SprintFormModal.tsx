import { useEffect, useMemo, useState, type FormEvent } from "react";

import type { Sprint, SprintCreateInput } from "@/api/sprints";

import "./SprintFormModal.css";

type SprintFormModalProps = {
  isOpen: boolean;
  sprint: Sprint | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (payload: SprintCreateInput) => void;
};

type FormState = {
  sprint_number: string;
  start_date: string;
  end_date: string;
  work_hours_per_day: string;
  team_size: string;
  max_team_capacity_points: string;
  notes: string;
};

function toFormState(sprint: Sprint | null): FormState {
  if (!sprint) {
    return {
      sprint_number: "",
      start_date: "",
      end_date: "",
      work_hours_per_day: "8",
      team_size: "1",
      max_team_capacity_points: "",
      notes: "",
    };
  }

  return {
    sprint_number: String(sprint.sprint_number),
    start_date: sprint.start_date.slice(0, 10),
    end_date: sprint.end_date.slice(0, 10),
    work_hours_per_day: String(sprint.work_hours_per_day),
    team_size: String(sprint.team_size),
    max_team_capacity_points:
      sprint.max_team_capacity_points === null ? "" : String(sprint.max_team_capacity_points),
    notes: sprint.notes ?? "",
  };
}

export function SprintFormModal({
  isOpen,
  sprint,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: SprintFormModalProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(sprint));

  useEffect(() => {
    if (isOpen) {
      setForm(toFormState(sprint));
    }
  }, [isOpen, sprint]);

  const isValid = useMemo(() => {
    return (
      form.sprint_number !== "" &&
      form.start_date !== "" &&
      form.end_date !== "" &&
      form.work_hours_per_day !== "" &&
      form.team_size !== ""
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

    onSubmit({
      sprint_number: Number(form.sprint_number),
      start_date: form.start_date,
      end_date: form.end_date,
      work_hours_per_day: Number(form.work_hours_per_day),
      team_size: Number(form.team_size),
      max_team_capacity_points:
        form.max_team_capacity_points.trim() === "" ? null : Number(form.max_team_capacity_points),
      notes: form.notes.trim() === "" ? null : form.notes.trim(),
    });
  }

  return (
    <div className="sprint-modal__backdrop" role="presentation">
      <div aria-modal="true" className="sprint-modal" role="dialog">
        <header className="sprint-modal__header">
          <h3>Nova sprint</h3>
          <button onClick={onClose} type="button">
            Fechar
          </button>
        </header>

        <form className="sprint-modal__form" onSubmit={handleSubmit}>
          <label>
            Numero da sprint
            <input
              min={1}
              required
              type="number"
              value={form.sprint_number}
              onChange={(event) => handleFieldChange("sprint_number", event.target.value)}
            />
          </label>

          <label>
            Data de inicio
            <input
              required
              type="date"
              value={form.start_date}
              onChange={(event) => handleFieldChange("start_date", event.target.value)}
            />
          </label>

          <label>
            Data de fim
            <input
              required
              type="date"
              value={form.end_date}
              onChange={(event) => handleFieldChange("end_date", event.target.value)}
            />
          </label>

          <label>
            Horas de trabalho por dia
            <input
              min={1}
              required
              type="number"
              value={form.work_hours_per_day}
              onChange={(event) => handleFieldChange("work_hours_per_day", event.target.value)}
            />
          </label>

          <label>
            Tamanho do time
            <input
              min={1}
              required
              type="number"
              value={form.team_size}
              onChange={(event) => handleFieldChange("team_size", event.target.value)}
            />
          </label>

          <label>
            Maximo de pontos da equipe
            <input
              min={0}
              type="number"
              value={form.max_team_capacity_points}
              onChange={(event) => handleFieldChange("max_team_capacity_points", event.target.value)}
            />
          </label>

          <label className="sprint-modal__notes">
            Observacoes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => handleFieldChange("notes", event.target.value)}
            />
          </label>

          {errorMessage ? <p className="sprint-modal__error">{errorMessage}</p> : null}

          <footer className="sprint-modal__footer">
            <button onClick={onClose} type="button">
              Cancelar
            </button>
            <button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? "Salvando..." : "Criar"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}