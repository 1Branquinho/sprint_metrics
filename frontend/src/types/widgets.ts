export type WidgetType = "burndown" | "status_breakdown" | "assignee_summary";

export type ChartType = "bar" | "line" | "area" | "pie" | "table";
export type MetricMode = "points" | "count";
export type GroupBy = "day" | "status" | "assignee" | "sprint";

export type SprintWidgetConfig = {
  id: WidgetType;
  title: string;
  enabled: boolean;
  chartType: ChartType;
  metricMode: MetricMode;
  groupBy: GroupBy;
};
