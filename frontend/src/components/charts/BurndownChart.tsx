import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { BurndownSeries } from "@/api/metrics";
import { formatDateShort } from "@/utils/date";
import { formatNumber } from "@/utils/format";

import "./BurndownChart.css";

type BurndownChartProps = {
  series: BurndownSeries;
};

export function BurndownChart({ series }: BurndownChartProps) {
  const data = series.dates.map((date, index) => ({
    date: formatDateShort(date),
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
            <YAxis tickFormatter={formatNumber} />
            <Tooltip formatter={(value) => formatNumber(Number(value))} />
            <Legend />
            <Line dataKey="completedDaily" name="Concluido no dia" stroke="#0e7c86" strokeWidth={2} />
            <Line dataKey="realRemaining" name="Restante real" stroke="#133247" strokeWidth={2} />
            <Line
              dataKey="idealRemaining"
              name="Restante ideal"
              stroke="#7f8c8d"
              strokeDasharray="6 4"
            />
            <Line
              dataKey="expectedRemaining"
              name="Restante esperado"
              stroke="#c67b1b"
              strokeDasharray="6 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}