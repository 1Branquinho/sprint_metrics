import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { CapacityCreateInput } from "@/api/capacities";
import { Pagination } from "@/components/common/Pagination";
import { PageFrame } from "@/components/common/PageFrame";
import { useToast } from "@/components/common/ToastProvider";
import { CapacityFilters } from "@/components/forms/CapacityFilters";
import { CapacityFormModal } from "@/components/forms/CapacityFormModal";
import { CapacityTable } from "@/components/tables/CapacityTable";
import { useCollaborators } from "@/hooks/useCollaborators";
import { useCapacities, useCreateCapacity } from "@/hooks/useCapacities";
import { useSprints } from "@/hooks/useSprints";

import "./CapacitiesPage.css";

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
  return "Erro inesperado na requisicao.";
}

export function CapacitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const toast = useToast();

  const sprintNumberParam = searchParams.get("sprint_number") ?? "";
  const collaboratorIdParam = searchParams.get("collaborator_id") ?? "";
  const limit = toPositiveInt(searchParams.get("limit"), 20);
  const offset = toNonNegativeInt(searchParams.get("offset"), 0);

  const capacitiesQuery = useCapacities({
    sprint_number: sprintNumberParam ? Number(sprintNumberParam) : undefined,
    collaborator_id: collaboratorIdParam ? Number(collaboratorIdParam) : undefined,
    limit,
    offset,
  });
  const sprintsQuery = useSprints(200, 0);
  const collaboratorsQuery = useCollaborators(undefined, 200, 0);
  const createCapacityMutation = useCreateCapacity();

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

  async function handleCreateCapacity(payload: CapacityCreateInput) {
    try {
      await createCapacityMutation.mutateAsync(payload);
      setIsCreateOpen(false);
      toast.success("Capacidade criada com sucesso.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const isLoading = capacitiesQuery.isLoading || sprintsQuery.isLoading || collaboratorsQuery.isLoading;

  return (
    <PageFrame title="Capacidades" subtitle="Planejamento de capacidade por sprint e colaborador.">
      <div className="capacities-page">
        <div className="capacities-page__toolbar">
          <CapacityFilters
            sprintNumber={sprintNumberParam}
            collaboratorId={collaboratorIdParam}
            limit={limit}
            sprints={sprintsQuery.data?.items ?? []}
            collaborators={collaboratorsQuery.data?.items ?? []}
            onSprintChange={(value) => updateParams({ sprint_number: value })}
            onCollaboratorChange={(value) => updateParams({ collaborator_id: value })}
            onLimitChange={(value) => updateParams({ limit: value })}
            onClear={() => setSearchParams({ limit: String(limit) }, { replace: true })}
          />

          <button onClick={() => setIsCreateOpen(true)} type="button">
            Nova capacidade
          </button>
        </div>

        <p className="capacities-page__hint">
          Observacao: acoes de atualizar/excluir serao habilitadas quando o backend expor endpoints de PUT/DELETE.
        </p>

        {isLoading ? <p className="capacities-page__state">Carregando capacidades...</p> : null}

        {capacitiesQuery.isError ? (
          <div className="capacities-page__state capacities-page__state--error">
            <p>{getErrorMessage(capacitiesQuery.error)}</p>
            <button onClick={() => capacitiesQuery.refetch()} type="button">
              Tentar novamente
            </button>
          </div>
        ) : null}

        {!isLoading && !capacitiesQuery.isError && capacitiesQuery.data?.items.length === 0 ? (
          <p className="capacities-page__state">Nenhuma capacidade encontrada para os filtros selecionados.</p>
        ) : null}

        {!isLoading && !capacitiesQuery.isError && capacitiesQuery.data && capacitiesQuery.data.items.length > 0 ? (
          <>
            <CapacityTable
              capacities={capacitiesQuery.data.items}
              collaborators={collaboratorsQuery.data?.items ?? []}
            />
            <Pagination
              total={capacitiesQuery.data.total}
              limit={capacitiesQuery.data.limit}
              offset={capacitiesQuery.data.offset}
              onChange={(nextOffset) => updateParams({ offset: nextOffset }, { resetOffset: false })}
            />
          </>
        ) : null}

        <CapacityFormModal
          isOpen={isCreateOpen}
          sprints={sprintsQuery.data?.items ?? []}
          collaborators={collaboratorsQuery.data?.items ?? []}
          isSubmitting={createCapacityMutation.isPending}
          errorMessage={
            createCapacityMutation.error ? getErrorMessage(createCapacityMutation.error) : null
          }
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(payload) => {
            void handleCreateCapacity(payload);
          }}
        />
      </div>
    </PageFrame>
  );
}
