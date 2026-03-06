import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { BurndownChart } from "@/components/charts/BurndownChart";
import { StatusBreakdownChart } from "@/components/charts/StatusBreakdownChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AssigneeSummaryTable } from "@/components/dashboard/AssigneeSummaryTable";
import { SprintSelector } from "@/components/dashboard/SprintSelector";
import { PageFrame } from "@/components/common/PageFrame";
import { useCollaborators } from "@/hooks/useCollaborators";
import { useSprintMetrics } from "@/hooks/useSprintMetrics";
import { useSprints } from "@/hooks/useSprints";

import "./SprintDashboardPage.css";

const statusOrder = ["TODO", "DOING", "CODE REVIEW", "TESTING", "DONE"] as const;

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Unexpected request error.";
}

export function SprintDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sprintParam = searchParams.get("sprint_number");
  const selectedSprint = sprintParam ? Number(sprintParam) : null;

  const sprintsQuery = useSprints(200, 0);
  const collaboratorsQuery = useCollaborators(undefined, 500, 0);

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

  const metricsQuery = useSprintMetrics(selectedSprint);

  return (
    <PageFrame title="Sprint Dashboard" subtitle="Consolidated sprint execution KPIs and burndown.">
      <div className="sprint-dashboard">
        <div className="sprint-dashboard__controls">
          <SprintSelector
            sprintNumber={selectedSprint}
            sprints={sprintsQuery.data?.items ?? []}
            onChange={(sprintNumber) => setSearchParams({ sprint_number: String(sprintNumber) }, { replace: true })}
          />
        </div>

        {metricsQuery.isLoading || sprintsQuery.isLoading ? (
          <p className="sprint-dashboard__state">Loading sprint metrics...</p>
        ) : null}

        {metricsQuery.isError ? (
          <div className="sprint-dashboard__state sprint-dashboard__state--error">
            <p>{getErrorMessage(metricsQuery.error)}</p>
            <button onClick={() => metricsQuery.refetch()} type="button">
              Retry
            </button>
          </div>
        ) : null}

        {!metricsQuery.isLoading && !metricsQuery.isError && !metricsQuery.data ? (
          <p className="sprint-dashboard__state">Select a sprint to visualize metrics.</p>
        ) : null}

        {metricsQuery.data ? (
          <>
            <section className="sprint-dashboard__kpis">
              <MetricCard label="Sprint Days" value={metricsQuery.data.sprintInfo.sprintDays} />
              <MetricCard label="Total Hours" value={metricsQuery.data.sprintInfo.totalHours} />
              <MetricCard label="Total Story Points" value={metricsQuery.data.sprintInfo.totalStoryPoints} />
              <MetricCard
                label="Done Story Points"
                value={metricsQuery.data.sprintInfo.doneStoryPoints}
                tone="success"
              />
              <MetricCard
                label="Open Story Points"
                value={metricsQuery.data.sprintInfo.openStoryPoints}
                tone="warning"
              />
              <MetricCard
                label="Expected Total Story Points"
                value={metricsQuery.data.sprintInfo.expectedTotalStoryPoints}
              />
            </section>

            <section className="sprint-dashboard__status-cards">
              {statusOrder.map((status) => (
                <MetricCard
                  key={status}
                  label={`${status} points`}
                  value={metricsQuery.data.sprintInfo.statusPoints[status] ?? 0}
                />
              ))}
            </section>

            <BurndownChart series={metricsQuery.data.burndownSeries} />

            <StatusBreakdownChart totals={metricsQuery.data.statusTotals} />

            <AssigneeSummaryTable
              rows={metricsQuery.data.perAssigneeSummary}
              collaborators={collaboratorsQuery.data?.items ?? []}
            />
          </>
        ) : null}
      </div>
    </PageFrame>
  );
}
