import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Pagination } from "@/components/common/Pagination";
import { PageFrame } from "@/components/common/PageFrame";
import { CollaboratorFormModal } from "@/components/forms/CollaboratorFormModal";
import { CollaboratorTable } from "@/components/tables/CollaboratorTable";
import { useCollaborators, useCreateCollaborator } from "@/hooks/useCollaborators";

import "./CollaboratorsPage.css";

function toPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toNonNegativeInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function parseActive(value: string | null): boolean | undefined {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Erro inesperado na requisicao.";
}

export function CollaboratorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const active = parseActive(searchParams.get("active"));
  const limit = toPositiveInt(searchParams.get("limit"), 20);
  const offset = toNonNegativeInt(searchParams.get("offset"), 0);

  const collaboratorsQuery = useCollaborators(active, limit, offset);
  const createCollaboratorMutation = useCreateCollaborator();

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

  async function handleCreateCollaborator(payload: { name: string; active: boolean }) {
    await createCollaboratorMutation.mutateAsync(payload);
    setIsCreateOpen(false);
  }

  return (
    <PageFrame title="Colaboradores" subtitle="Cadastro de pessoas e visao de status ativo/inativo.">
      <div className="collaborators-page">
        <div className="collaborators-page__header">
          <div className="collaborators-page__filters">
            <label>
              Filtro de atividade
              <select
                value={active === undefined ? "" : String(active)}
                onChange={(event) => updateParams({ active: event.target.value })}
              >
                <option value="">Todos</option>
                <option value="true">Somente ativos</option>
                <option value="false">Somente inativos</option>
              </select>
            </label>

            <label>
              Linhas
              <select
                value={String(limit)}
                onChange={(event) => updateParams({ limit: Number(event.target.value) })}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </label>
          </div>

          <button onClick={() => setIsCreateOpen(true)} type="button">
            Novo colaborador
          </button>
        </div>

        {collaboratorsQuery.isLoading ? <p className="collaborators-page__state">Carregando colaboradores...</p> : null}

        {collaboratorsQuery.isError ? (
          <div className="collaborators-page__state collaborators-page__state--error">
            <p>{getErrorMessage(collaboratorsQuery.error)}</p>
            <button onClick={() => collaboratorsQuery.refetch()} type="button">
              Tentar novamente
            </button>
          </div>
        ) : null}

        {!collaboratorsQuery.isLoading && !collaboratorsQuery.isError && collaboratorsQuery.data?.items.length === 0 ? (
          <p className="collaborators-page__state">Nenhum colaborador encontrado para os filtros.</p>
        ) : null}

        {!collaboratorsQuery.isLoading && !collaboratorsQuery.isError && collaboratorsQuery.data && collaboratorsQuery.data.items.length > 0 ? (
          <>
            <CollaboratorTable collaborators={collaboratorsQuery.data.items} />
            <Pagination
              total={collaboratorsQuery.data.total}
              limit={collaboratorsQuery.data.limit}
              offset={collaboratorsQuery.data.offset}
              onChange={(nextOffset) => updateParams({ offset: nextOffset }, { resetOffset: false })}
            />
          </>
        ) : null}

        <CollaboratorFormModal
          isOpen={isCreateOpen}
          isSubmitting={createCollaboratorMutation.isPending}
          errorMessage={
            createCollaboratorMutation.error ? getErrorMessage(createCollaboratorMutation.error) : null
          }
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(payload) => {
            void handleCreateCollaborator(payload);
          }}
        />
      </div>
    </PageFrame>
  );
}