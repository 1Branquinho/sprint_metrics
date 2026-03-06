import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { ApiError } from "@/types/common";
import { PageFrame } from "@/components/common/PageFrame";
import { Pagination } from "@/components/common/Pagination";
import { useToast } from "@/components/common/ToastProvider";
import { IssueFilters } from "@/components/forms/IssueFilters";
import { IssueFormModal } from "@/components/forms/IssueFormModal";
import { IssueTable } from "@/components/tables/IssueTable";
import type { Issue, IssueCreateInput, IssueStatus, IssueUpdateInput } from "@/api/issues";
import { useCollaborators } from "@/hooks/useCollaborators";
import { useCreateIssue, useDeleteIssue, useIssues, useUpdateIssue } from "@/hooks/useIssues";
import { useSprints } from "@/hooks/useSprints";
import { issueStatusOptions } from "@/utils/status";

import "./IssuesPage.css";

const statusValues: IssueStatus[] = issueStatusOptions;

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
    return String((error as ApiError).message);
  }
  return "Erro inesperado na requisicao.";
}

export function IssuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const sprintNumberParam = searchParams.get("sprint_number") ?? "";
  const assigneeIdParam = searchParams.get("assignee_id") ?? "";
  const statusParamRaw = searchParams.get("status") ?? "";
  const statusParam = statusValues.includes(statusParamRaw as IssueStatus)
    ? (statusParamRaw as IssueStatus)
    : "";
  const limit = toPositiveInt(searchParams.get("limit"), 20);
  const offset = toNonNegativeInt(searchParams.get("offset"), 0);

  const [modalState, setModalState] = useState<{ mode: "create" | "edit"; issue: Issue | null } | null>(
    null,
  );
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

  const filters = useMemo(
    () => ({
      sprint_number: sprintNumberParam ? Number(sprintNumberParam) : undefined,
      assignee_id: assigneeIdParam ? Number(assigneeIdParam) : undefined,
      status: statusParam || undefined,
      limit,
      offset,
    }),
    [assigneeIdParam, limit, offset, sprintNumberParam, statusParam],
  );

  const issuesQuery = useIssues(filters);
  const sprintsQuery = useSprints(200, 0);
  const collaboratorsQuery = useCollaborators(undefined, 200, 0);

  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();
  const deleteIssueMutation = useDeleteIssue();

  const mutationError =
    (createIssueMutation.error ? getErrorMessage(createIssueMutation.error) : null) ??
    (updateIssueMutation.error ? getErrorMessage(updateIssueMutation.error) : null) ??
    (deleteIssueMutation.error ? getErrorMessage(deleteIssueMutation.error) : null) ??
    null;

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

  function openCreateModal() {
    createIssueMutation.reset();
    updateIssueMutation.reset();
    setModalState({ mode: "create", issue: null });
  }

  function openEditModal(issue: Issue) {
    createIssueMutation.reset();
    updateIssueMutation.reset();
    setModalState({ mode: "edit", issue });
  }

  function closeModal() {
    setModalState(null);
  }

  async function handleModalSubmit(payload: IssueCreateInput | IssueUpdateInput) {
    if (!modalState) {
      return;
    }

    try {
      if (modalState.mode === "create") {
        await createIssueMutation.mutateAsync(payload as IssueCreateInput);
        toast.success("Issue criada com sucesso.");
      } else if (modalState.issue) {
        await updateIssueMutation.mutateAsync({
          issueId: modalState.issue.id,
          payload,
        });
        toast.success("Issue atualizada com sucesso.");
      }

      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleDeleteIssue(issue: Issue) {
    const confirmed = window.confirm(`Excluir ${issue.issue_number}?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteIssueMutation.mutateAsync(issue.id);
      toast.success("Issue excluida com sucesso.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleStatusChange(issue: Issue, nextStatus: IssueStatus) {
    if (issue.status === nextStatus) {
      return;
    }

    setStatusUpdatingId(issue.id);
    try {
      await updateIssueMutation.mutateAsync({
        issueId: issue.id,
        payload: { status: nextStatus },
      });
      toast.success(`Status da issue ${issue.issue_number} atualizado.`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setStatusUpdatingId(null);
    }
  }

  const isLoading = issuesQuery.isLoading || sprintsQuery.isLoading || collaboratorsQuery.isLoading;
  const pageData = issuesQuery.data;

  return (
    <PageFrame
      title="Issues"
      subtitle="Fila operacional com filtros, paginacao e transicao de status."
    >
      <div className="issues-page">
        <div className="issues-page__toolbar">
          <IssueFilters
            sprintNumber={sprintNumberParam}
            assigneeId={assigneeIdParam}
            status={statusParam}
            limit={limit}
            sprints={sprintsQuery.data?.items ?? []}
            collaborators={collaboratorsQuery.data?.items ?? []}
            onSprintChange={(value) => updateParams({ sprint_number: value })}
            onAssigneeChange={(value) => updateParams({ assignee_id: value })}
            onStatusChange={(value) => updateParams({ status: value })}
            onLimitChange={(value) => updateParams({ limit: value })}
            onClear={() => {
              setSearchParams({ limit: String(limit) }, { replace: true });
            }}
          />

          <button className="issues-page__create" onClick={openCreateModal} type="button">
            Nova issue
          </button>
        </div>

        {isLoading ? <p className="issues-page__state">Carregando issues...</p> : null}

        {issuesQuery.isError ? (
          <div className="issues-page__state issues-page__state--error">
            <p>{getErrorMessage(issuesQuery.error)}</p>
            <button onClick={() => issuesQuery.refetch()} type="button">
              Tentar novamente
            </button>
          </div>
        ) : null}

        {!isLoading && !issuesQuery.isError && pageData && pageData.items.length === 0 ? (
          <p className="issues-page__state">Nenhuma issue encontrada para os filtros selecionados.</p>
        ) : null}

        {!isLoading && !issuesQuery.isError && pageData && pageData.items.length > 0 ? (
          <>
            <IssueTable
              issues={pageData.items}
              collaborators={collaboratorsQuery.data?.items ?? []}
              statusUpdatingId={statusUpdatingId}
              onEdit={openEditModal}
              onDelete={(issue) => {
                void handleDeleteIssue(issue);
              }}
              onChangeStatus={(issue, status) => {
                void handleStatusChange(issue, status);
              }}
            />
            <Pagination
              total={pageData.total}
              limit={pageData.limit}
              offset={pageData.offset}
              onChange={(nextOffset) => updateParams({ offset: nextOffset }, { resetOffset: false })}
            />
          </>
        ) : null}

        <IssueFormModal
          isOpen={modalState !== null}
          mode={modalState?.mode ?? "create"}
          issue={modalState?.issue ?? null}
          sprints={sprintsQuery.data?.items ?? []}
          collaborators={collaboratorsQuery.data?.items ?? []}
          isSubmitting={createIssueMutation.isPending || updateIssueMutation.isPending}
          errorMessage={mutationError}
          onClose={closeModal}
          onSubmit={(payload) => {
            void handleModalSubmit(payload);
          }}
        />
      </div>
    </PageFrame>
  );
}
