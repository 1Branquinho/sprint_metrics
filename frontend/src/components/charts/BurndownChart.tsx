import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { BurndownSeries } from "@/api/metrics";

import "./BurndownChart.css";

type BurndownChartProps = {
  series: BurndownSeries;
};

export function BurndownChart({ series }: BurndownChartProps) {
  const data = series.dates.map((date, index) => ({
    date: date.slice(5),
    completedDaily: series.completedDaily[index] ?? 0,
    realRemaining: series.realRemaining[index] ?? 0,
    idealRemaining: series.idealRemaining[index] ?? 0,
    expectedRemaining: series.expectedRemaining[index] ?? 0,
  }));

  return (
    <section className="chart-card">
      <header>
        <h3>Burndown</h3>
      </header>
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dde5ea" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="completedDaily" name="Completed daily" stroke="#1f8a70" strokeWidth={2} />
            <Line dataKey="realRemaining" name="Real remaining" stroke="#0e2a3a" strokeWidth={2} />
            <Line
              dataKey="idealRemaining"
              name="Ideal remaining"
              stroke="#7f8c8d"
              strokeDasharray="6 4"
            />
            <Line
              dataKey="expectedRemaining"
              name="Expected remaining"
              stroke="#c67b1b"
              strokeDasharray="6 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
