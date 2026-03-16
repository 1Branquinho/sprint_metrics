import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { BurndownChart } from "@/components/charts/BurndownChart";
import { StatusBreakdownChart } from "@/components/charts/StatusBreakdownChart";
import { PageFrame } from "@/components/common/PageFrame";
import { AssigneeSummaryTable } from "@/components/dashboard/AssigneeSummaryTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SprintSelector } from "@/components/dashboard/SprintSelector";
import { useCollaborators } from "@/hooks/useCollaborators";
import { useSprintMetrics } from "@/hooks/useSprintMetrics";
import { useSprints } from "@/hooks/useSprints";
import { issueStatusLabelFromUnknown } from "@/utils/status";

import "./SprintDashboardPage.css";

const statusOrder = ["TODO", "DOING", "CODE REVIEW", "TESTING", "DONE"] as const;

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Erro inesperado na requisicao.";
}

export function SprintDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sprintParam = searchParams.get("sprint_number");
  const selectedSprint = sprintParam ? Number(sprintParam) : null;

  const sprintsQuery = useSprints(200, 0);
  const collaboratorsQuery = useCollaborators(undefined, 500, 0);
  const metricsQuery = useSprintMetrics(selectedSprint);

  useEffect(() => {
    if (selectedSprint !== null) {
      return;
    }

    const firstSprint = sprintsQuery.data?.items?.[0];
    if (!firstSprint) {
      return;
    }

    setSearchParams({ sprint_number: String(firstSprint.sprint_number) }, { replace: true });
  }, [selectedSprint, setSearchParams, sprintsQuery.data?.items]);

  return (
    <PageFrame title="Painel da Sprint" subtitle="Visao consolidada da execucao da sprint com foco em leitura e decisao.">
      <div className="sprint-dashboard">
        <section className="sprint-dashboard__header">
          <SprintSelector
            sprintNumber={selectedSprint}
            sprints={sprintsQuery.data?.items ?? []}
            onChange={(sprintNumber) =>
              setSearchParams({ sprint_number: String(sprintNumber) }, { replace: true })
            }
          />
          <p>
            Acompanhamento de progresso, distribuicao por status e resumo por colaborador em um unico painel.
          </p>
        </section>

        {metricsQuery.isLoading || sprintsQuery.isLoading ? (
          <p className="sprint-dashboard__state">Carregando metricas da sprint...</p>
        ) : null}

        {metricsQuery.isError ? (
          <div className="sprint-dashboard__state sprint-dashboard__state--error">
            <p>{getErrorMessage(metricsQuery.error)}</p>
            <button onClick={() => metricsQuery.refetch()} type="button">
              Tentar novamente
            </button>
          </div>
        ) : null}

        {!metricsQuery.isLoading && !metricsQuery.isError && !metricsQuery.data ? (
          <p className="sprint-dashboard__state">Selecione uma sprint para visualizar as metricas.</p>
        ) : null}

        {metricsQuery.data ? (
          <>
            <section className="sprint-dashboard__kpis">
              <MetricCard label="Dias da sprint" value={metricsQuery.data.sprintInfo.sprintDays} />
              <MetricCard label="Horas totais" value={metricsQuery.data.sprintInfo.totalHours} />
              <MetricCard label="Story points totais" value={metricsQuery.data.sprintInfo.totalStoryPoints} />
              <MetricCard
                label="Story points concluidos"
                value={metricsQuery.data.sprintInfo.doneStoryPoints}
                tone="success"
              />
              <MetricCard
                label="Story points em aberto"
                value={metricsQuery.data.sprintInfo.openStoryPoints}
                tone="warning"
              />
              <MetricCard
                label="Story points esperados"
                value={metricsQuery.data.sprintInfo.expectedTotalStoryPoints}
              />
            </section>

            <section className="sprint-dashboard__main-grid">
              <BurndownChart series={metricsQuery.data.burndownSeries} />
              <div className="sprint-dashboard__status-panel">
                <h3>Status da Sprint</h3>
                <div className="sprint-dashboard__status-cards">
                  {statusOrder.map((status) => (
                    <MetricCard
                      key={status}
                      label={issueStatusLabelFromUnknown(status)}
                      value={metricsQuery.data.sprintInfo.statusPoints[status] ?? 0}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="sprint-dashboard__secondary-grid">
              <StatusBreakdownChart totals={metricsQuery.data.statusTotals} mode="points" chartType="bar" />
              <AssigneeSummaryTable
                rows={metricsQuery.data.perAssigneeSummary}
                collaborators={collaboratorsQuery.data?.items ?? []}
              />
            </section>
          </>
        ) : null}
      </div>
    </PageFrame>
  );
}
