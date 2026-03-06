import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  CollaboratorBurndownSeries,
  CollaboratorDailyCompletedSeries,
} from "@/api/collaboratorMetrics";
import { formatDateShort } from "@/utils/date";
import { formatNumber } from "@/utils/format";

import "./CollaboratorCharts.css";

type DailyCompletedChartProps = {
  series: CollaboratorDailyCompletedSeries;
};

export function DailyCompletedChart({ series }: DailyCompletedChartProps) {
  const data = series.dates.map((date, index) => ({
    date: formatDateShort(date),
    completedPoints: series.completedPoints[index] ?? 0,
  }));

  return (
    <section className="collab-chart-card">
      <header>
        <h3>Pontos concluidos por dia</h3>
      </header>
      <div className="collab-chart-card__body">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dde5ea" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip formatter={(value) => formatNumber(Number(value))} />
            <Legend />
            <Bar dataKey="completedPoints" name="Pontos concluidos" fill="#0e7c86" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

type IndividualBurndownChartProps = {
  series: CollaboratorBurndownSeries;
};

export function IndividualBurndownChart({ series }: IndividualBurndownChartProps) {
  const data = series.dates.map((date, index) => ({
    date: formatDateShort(date),
    realRemaining: series.realRemaining[index] ?? 0,
    idealRemaining: series.idealRemaining[index] ?? 0,
  }));

  return (
    <section className="collab-chart-card">
      <header>
        <h3>Burndown individual</h3>
      </header>
      <div className="collab-chart-card__body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dde5ea" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip formatter={(value) => formatNumber(Number(value))} />
            <Legend />
            <Line dataKey="realRemaining" name="Restante real" stroke="#133247" strokeWidth={2} />
            <Line
              dataKey="idealRemaining"
              name="Restante ideal"
              stroke="#7f8c8d"
              strokeDasharray="6 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}