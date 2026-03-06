import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { SprintCreateInput } from "@/api/sprints";
import { Pagination } from "@/components/common/Pagination";
import { PageFrame } from "@/components/common/PageFrame";
import { SprintFormModal } from "@/components/forms/SprintFormModal";
import { SprintTable } from "@/components/tables/SprintTable";
import { useCreateSprint, useSprints } from "@/hooks/useSprints";

import "./SprintsPage.css";

function toPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toNonNegativeInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Unexpected request error.";
}

export function SprintsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const limit = toPositiveInt(searchParams.get("limit"), 20);
  const offset = toNonNegativeInt(searchParams.get("offset"), 0);

  const sprintsQuery = useSprints(limit, offset);
  const createSprintMutation = useCreateSprint();

  const summary = useMemo(() => {
    const items = sprintsQuery.data?.items ?? [];
    if (items.length === 0) {
      return {
        loaded: 0,
        avgTeamSize: 0,
      };
    }

    const avgTeamSize = Math.round(items.reduce((sum, item) => sum + item.team_size, 0) / items.length);
    return {
      loaded: items.length,
      avgTeamSize,
    };
  }, [sprintsQuery.data?.items]);

  function updateParams(
    updates: Record<string, string | number | undefined>,
    options: { resetOffset?: boolean } = { resetOffset: true },
  ) {
    const next = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }

    if (options.resetOffset !== false) {
      next.delete("offset");
    }

    setSearchParams(next, { replace: true });
  }

  async function handleCreateSprint(payload: SprintCreateInput) {
    await createSprintMutation.mutateAsync(payload);
    setIsCreateOpen(false);
  }

  return (
    <PageFrame title="Sprints" subtitle="Sprint management and quick links to dashboard views.">
      <div className="sprints-page">
        <div className="sprints-page__header">
          <div className="sprints-page__summary">
            <article>
              <strong>{sprintsQuery.data?.total ?? 0}</strong>
              <span>Total sprints</span>
            </article>
            <article>
              <strong>{summary.loaded}</strong>
              <span>Loaded in page</span>
            </article>
            <article>
              <strong>{summary.avgTeamSize}</strong>
              <span>Avg team size (loaded)</span>
            </article>
          </div>

          <div className="sprints-page__actions">
            <label>
              Rows
              <select value={String(limit)} onChange={(event) => updateParams({ limit: Number(event.target.value) })}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </label>

            <button onClick={() => setIsCreateOpen(true)} type="button">
              Create sprint
            </button>
          </div>
        </div>

        {sprintsQuery.isLoading ? <p className="sprints-page__state">Loading sprints...</p> : null}

        {sprintsQuery.isError ? (
          <div className="sprints-page__state sprints-page__state--error">
            <p>{getErrorMessage(sprintsQuery.error)}</p>
            <button onClick={() => sprintsQuery.refetch()} type="button">
              Retry
            </button>
          </div>
        ) : null}

        {!sprintsQuery.isLoading && !sprintsQuery.isError && sprintsQuery.data?.items.length === 0 ? (
          <p className="sprints-page__state">No sprints found. Create your first sprint.</p>
        ) : null}

        {!sprintsQuery.isLoading && !sprintsQuery.isError && sprintsQuery.data && sprintsQuery.data.items.length > 0 ? (
          <>
            <SprintTable sprints={sprintsQuery.data.items} />
            <Pagination
              total={sprintsQuery.data.total}
              limit={sprintsQuery.data.limit}
              offset={sprintsQuery.data.offset}
              onChange={(nextOffset) => updateParams({ offset: nextOffset }, { resetOffset: false })}
            />
          </>
        ) : null}

        <SprintFormModal
          isOpen={isCreateOpen}
          sprint={null}
          isSubmitting={createSprintMutation.isPending}
          errorMessage={createSprintMutation.error ? getErrorMessage(createSprintMutation.error) : null}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(payload) => {
            void handleCreateSprint(payload);
          }}
        />
      </div>
    </PageFrame>
  );
}
