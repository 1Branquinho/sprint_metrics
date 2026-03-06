import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { StatusTotals } from "@/api/metrics";

import "./StatusBreakdownChart.css";

type StatusBreakdownChartProps = {
  totals: StatusTotals;
  mode?: "points" | "count";
  chartType?: "bar" | "pie";
};

export function StatusBreakdownChart({
  totals,
  mode = "points",
  chartType = "bar",
}: StatusBreakdownChartProps) {
  const data = useMemo(() => {
    const source = mode === "points" ? totals.byPoints : totals.byCount;
    return Object.entries(source).map(([status, value]) => ({ status, value }));
  }, [mode, totals.byCount, totals.byPoints]);

  return (
    <section className="status-breakdown">
      <header className="status-breakdown__header">
        <h3>Status breakdown ({mode})</h3>
      </header>

      <div className="status-breakdown__charts status-breakdown__charts--single">
        {chartType === "bar" ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde5ea" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={mode === "points" ? "Points" : "Count"} fill="#1f8a70" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="status"
                outerRadius={95}
                fill="#1f8a70"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
