import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { StatusBreakdownChart } from "@/components/charts/StatusBreakdownChart";
import { DailyCompletedChart, IndividualBurndownChart } from "@/components/charts/CollaboratorCharts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageFrame } from "@/components/common/PageFrame";
import { useCollaborators } from "@/hooks/useCollaborators";
import { useCollaboratorMetrics } from "@/hooks/useCollaboratorMetrics";
import { useSprints } from "@/hooks/useSprints";

import "./CollaboratorDashboardPage.css";

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Unexpected request error.";
}

export function CollaboratorDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const collaboratorParam = searchParams.get("collaborator_id");
  const sprintParam = searchParams.get("sprint_number");

  const selectedCollaborator = collaboratorParam ? Number(collaboratorParam) : null;
  const selectedSprint = sprintParam ? Number(sprintParam) : null;

  const collaboratorsQuery = useCollaborators(undefined, 500, 0);
  const sprintsQuery = useSprints(200, 0);

  useEffect(() => {
    if (selectedCollaborator !== null) {
      return;
    }

    const firstCollaborator = collaboratorsQuery.data?.items?.[0];
    if (!firstCollaborator) {
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.set("collaborator_id", String(firstCollaborator.id));
    setSearchParams(next, { replace: true });
  }, [collaboratorsQuery.data?.items, searchParams, selectedCollaborator, setSearchParams]);

  const metricsQuery = useCollaboratorMetrics(selectedCollaborator, selectedSprint);

  return (
    <PageFrame
      title="Collaborator Dashboard"
      subtitle="Individual delivery analytics and trends by collaborator."
    >
      <div className="collab-dashboard">
        <div className="collab-dashboard__filters">
          <label>
            Collaborator
            <select
              value={selectedCollaborator === null ? "" : String(selectedCollaborator)}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                next.set("collaborator_id", event.target.value);
                setSearchParams(next, { replace: true });
              }}
            >
              {(collaboratorsQuery.data?.items ?? []).map((collaborator) => (
                <option key={collaborator.id} value={String(collaborator.id)}>
                  {collaborator.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Sprint (optional)
            <select
              value={selectedSprint === null ? "" : String(selectedSprint)}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value === "") {
                  next.delete("sprint_number");
                } else {
                  next.set("sprint_number", event.target.value);
                }
                setSearchParams(next, { replace: true });
              }}
            >
              <option value="">All sprints</option>
              {(sprintsQuery.data?.items ?? []).map((sprint) => (
                <option key={sprint.sprint_number} value={String(sprint.sprint_number)}>
                  Sprint {sprint.sprint_number}
                </option>
              ))}
            </select>
          </label>
        </div>

        {metricsQuery.isLoading || collaboratorsQuery.isLoading ? (
          <p className="collab-dashboard__state">Loading collaborator metrics...</p>
        ) : null}

        {metricsQuery.isError ? (
          <div className="collab-dashboard__state collab-dashboard__state--error">
            <p>{getErrorMessage(metricsQuery.error)}</p>
            <button onClick={() => metricsQuery.refetch()} type="button">
              Retry
            </button>
          </div>
        ) : null}

        {metricsQuery.data ? (
          <>
            <section className="collab-dashboard__kpis">
              <MetricCard label="Points Done" value={metricsQuery.data.kpis.pointsDone} tone="success" />
              <MetricCard label="Points Open" value={metricsQuery.data.kpis.pointsOpen} tone="warning" />
              <MetricCard label="Issues Done" value={metricsQuery.data.kpis.issuesDone} />
              <MetricCard label="Issues Open" value={metricsQuery.data.kpis.issuesOpen} />
              <MetricCard
                label="Avg Points / Done Issue"
                value={metricsQuery.data.kpis.avgPointsPerDoneIssue}
              />
              <MetricCard
                label="Lead Time Avg (days)"
                value={metricsQuery.data.kpis.leadTimeDaysAvg ?? "-"}
              />
              <MetricCard label="Expected Points" value={metricsQuery.data.kpis.expectedPoints} />
              <MetricCard label="Min Points" value={metricsQuery.data.kpis.minPoints} />
            </section>

            <section className="collab-dashboard__charts-grid">
              <DailyCompletedChart series={metricsQuery.data.dailyCompletedSeries} />
              <IndividualBurndownChart series={metricsQuery.data.burndownSeries} />
            </section>

            <StatusBreakdownChart totals={metricsQuery.data.statusTotals} />
          </>
        ) : null}
      </div>
    </PageFrame>
  );
}
