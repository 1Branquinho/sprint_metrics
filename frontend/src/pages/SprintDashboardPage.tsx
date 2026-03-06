import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { BurndownChart } from "@/components/charts/BurndownChart";
import { StatusBreakdownChart } from "@/components/charts/StatusBreakdownChart";
import { PageFrame } from "@/components/common/PageFrame";
import { AssigneeSummaryTable } from "@/components/dashboard/AssigneeSummaryTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SprintSelector } from "@/components/dashboard/SprintSelector";
import { WidgetConfigPanel } from "@/components/widgets/WidgetConfigPanel";
import { useCollaborators } from "@/hooks/useCollaborators";
import { useSprintMetrics } from "@/hooks/useSprintMetrics";
import { useSprints } from "@/hooks/useSprints";
import { useSprintWidgets } from "@/hooks/useSprintWidgets";
import type { SprintWidgetConfig } from "@/types/widgets";
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

  const { widgets, update, reset } = useSprintWidgets();

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

  function renderWidget(widget: SprintWidgetConfig) {
    if (!metricsQuery.data || !widget.enabled) {
      return null;
    }

    if (widget.id === "burndown") {
      return <BurndownChart key={widget.id} series={metricsQuery.data.burndownSeries} />;
    }

    if (widget.id === "status_breakdown") {
      return (
        <StatusBreakdownChart
          key={widget.id}
          totals={metricsQuery.data.statusTotals}
          mode={widget.metricMode}
          chartType={widget.chartType === "pie" ? "pie" : "bar"}
        />
      );
    }

    if (widget.id === "assignee_summary") {
      return (
        <AssigneeSummaryTable
          key={widget.id}
          rows={metricsQuery.data.perAssigneeSummary}
          collaborators={collaboratorsQuery.data?.items ?? []}
        />
      );
    }

    return null;
  }

  return (
    <PageFrame title="Painel da Sprint" subtitle="KPIs consolidados da execucao e do burndown da sprint.">
      <div className="sprint-dashboard">
        <div className="sprint-dashboard__controls">
          <SprintSelector
            sprintNumber={selectedSprint}
            sprints={sprintsQuery.data?.items ?? []}
            onChange={(sprintNumber) =>
              setSearchParams({ sprint_number: String(sprintNumber) }, { replace: true })
            }
          />
        </div>

        <WidgetConfigPanel widgets={widgets} onChange={update} />
        <div className="sprint-dashboard__widget-actions">
          <button onClick={reset} type="button">
            Restaurar widgets padrao
          </button>
        </div>

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

            <section className="sprint-dashboard__status-cards">
              {statusOrder.map((status) => (
                <MetricCard
                  key={status}
                  label={`${issueStatusLabelFromUnknown(status)} (pts)`}
                  value={metricsQuery.data.sprintInfo.statusPoints[status] ?? 0}
                />
              ))}
            </section>

            {widgets.map((widget) => renderWidget(widget))}
          </>
        ) : null}
      </div>
    </PageFrame>
  );
}