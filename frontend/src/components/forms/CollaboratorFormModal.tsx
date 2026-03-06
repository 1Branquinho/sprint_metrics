import { useEffect, useState, type FormEvent } from "react";

import type { CollaboratorCreateInput } from "@/api/collaborators";

import "./CollaboratorFormModal.css";

type CollaboratorFormModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (payload: CollaboratorCreateInput) => void;
};

export function CollaboratorFormModal({
  isOpen,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: CollaboratorFormModalProps) {
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setActive(true);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      name: name.trim(),
      active,
    });
  }

  return (
    <div className="collaborator-modal__backdrop" role="presentation">
      <div aria-modal="true" className="collaborator-modal" role="dialog">
        <header className="collaborator-modal__header">
          <h3>Create collaborator</h3>
          <button onClick={onClose} type="button">
            Close
          </button>
        </header>

        <form className="collaborator-modal__form" onSubmit={handleSubmit}>
          <label>
            Name
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </label>

          <label className="collaborator-modal__checkbox">
            <input checked={active} onChange={(event) => setActive(event.target.checked)} type="checkbox" />
            Active
          </label>

          {errorMessage ? <p className="collaborator-modal__error">{errorMessage}</p> : null}

          <footer className="collaborator-modal__footer">
            <button onClick={onClose} type="button">
              Cancel
            </button>
            <button disabled={name.trim() === "" || isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Create"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
