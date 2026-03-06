import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { StatusTotals } from "@/api/metrics";

import "./StatusBreakdownChart.css";

type StatusBreakdownChartProps = {
  totals: StatusTotals;
};

export function StatusBreakdownChart({ totals }: StatusBreakdownChartProps) {
  const [mode, setMode] = useState<"points" | "count">("points");

  const data = useMemo(() => {
    const source = mode === "points" ? totals.byPoints : totals.byCount;
    return Object.entries(source).map(([status, value]) => ({ status, value }));
  }, [mode, totals.byCount, totals.byPoints]);

  return (
    <section className="status-breakdown">
      <header className="status-breakdown__header">
        <h3>Status breakdown</h3>
        <div>
          <button
            className={mode === "points" ? "active" : ""}
            onClick={() => setMode("points")}
            type="button"
          >
            Points
          </button>
          <button
            className={mode === "count" ? "active" : ""}
            onClick={() => setMode("count")}
            type="button"
          >
            Count
          </button>
        </div>
      </header>

      <div className="status-breakdown__charts">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dde5ea" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name={mode === "points" ? "Points" : "Count"} fill="#1f8a70" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={260}>
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
      </div>
    </section>
  );
}
