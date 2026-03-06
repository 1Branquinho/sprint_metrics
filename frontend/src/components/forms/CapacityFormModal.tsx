import { useEffect, useState, type FormEvent } from "react";

import type { CapacityCreateInput } from "@/api/capacities";
import type { Collaborator } from "@/api/collaborators";
import type { Sprint } from "@/api/sprints";

import "./CapacityFormModal.css";

type CapacityFormModalProps = {
  isOpen: boolean;
  sprints: Sprint[];
  collaborators: Collaborator[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (payload: CapacityCreateInput) => void;
};

export function CapacityFormModal({
  isOpen,
  sprints,
  collaborators,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: CapacityFormModalProps) {
  const [sprintNumber, setSprintNumber] = useState("");
  const [collaboratorId, setCollaboratorId] = useState("");
  const [minPoints, setMinPoints] = useState("0");
  const [expectedPoints, setExpectedPoints] = useState("0");

  useEffect(() => {
    if (isOpen) {
      setSprintNumber("");
      setCollaboratorId("");
      setMinPoints("0");
      setExpectedPoints("0");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isValid = sprintNumber !== "" && collaboratorId !== "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      sprint_number: Number(sprintNumber),
      collaborator_id: Number(collaboratorId),
      min_points: Number(minPoints),
      expected_points: Number(expectedPoints),
    });
  }

  return (
    <div className="capacity-modal__backdrop" role="presentation">
      <div aria-modal="true" className="capacity-modal" role="dialog">
        <header className="capacity-modal__header">
          <h3>Create capacity</h3>
          <button onClick={onClose} type="button">
            Close
          </button>
        </header>

        <form className="capacity-modal__form" onSubmit={handleSubmit}>
          <label>
            Sprint
            <select required value={sprintNumber} onChange={(event) => setSprintNumber(event.target.value)}>
              <option value="">Select sprint</option>
              {sprints.map((sprint) => (
                <option key={sprint.sprint_number} value={String(sprint.sprint_number)}>
                  Sprint {sprint.sprint_number}
                </option>
              ))}
            </select>
          </label>

          <label>
            Collaborator
            <select
              required
              value={collaboratorId}
              onChange={(event) => setCollaboratorId(event.target.value)}
            >
              <option value="">Select collaborator</option>
              {collaborators.map((collaborator) => (
                <option key={collaborator.id} value={String(collaborator.id)}>
                  {collaborator.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Min points
            <input
              min={0}
              required
              type="number"
              value={minPoints}
              onChange={(event) => setMinPoints(event.target.value)}
            />
          </label>

          <label>
            Expected points
            <input
              min={0}
              required
              type="number"
              value={expectedPoints}
              onChange={(event) => setExpectedPoints(event.target.value)}
            />
          </label>

          {errorMessage ? <p className="capacity-modal__error">{errorMessage}</p> : null}

          <footer className="capacity-modal__footer">
            <button onClick={onClose} type="button">
              Cancel
            </button>
            <button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Create"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
