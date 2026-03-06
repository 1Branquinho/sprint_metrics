import { useEffect, useState } from "react";

import type { SprintWidgetConfig } from "@/types/widgets";

const STORAGE_KEY = "sprint-dashboard-widgets-v1";

const defaultWidgets: SprintWidgetConfig[] = [
  {
    id: "burndown",
    title: "Burndown",
    enabled: true,
    chartType: "line",
    metricMode: "points",
    groupBy: "day",
  },
  {
    id: "status_breakdown",
    title: "Status breakdown",
    enabled: true,
    chartType: "bar",
    metricMode: "points",
    groupBy: "status",
  },
  {
    id: "assignee_summary",
    title: "Summary by assignee",
    enabled: true,
    chartType: "table",
    metricMode: "points",
    groupBy: "assignee",
  },
];

function readWidgets(): SprintWidgetConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultWidgets;
    }

    const parsed = JSON.parse(raw) as SprintWidgetConfig[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultWidgets;
    }

    return parsed;
  } catch {
    return defaultWidgets;
  }
}

export function useSprintWidgets() {
  const [widgets, setWidgets] = useState<SprintWidgetConfig[]>(() => readWidgets());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  function update(next: SprintWidgetConfig[]) {
    setWidgets(next);
  }

  function reset() {
    setWidgets(defaultWidgets);
  }

  return {
    widgets,
    update,
    reset,
    defaults: defaultWidgets,
  };
}
