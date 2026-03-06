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

import "./CollaboratorCharts.css";

type DailyCompletedChartProps = {
  series: CollaboratorDailyCompletedSeries;
};

export function DailyCompletedChart({ series }: DailyCompletedChartProps) {
  const data = series.dates.map((date, index) => ({
    date: date.slice(5),
    completedPoints: series.completedPoints[index] ?? 0,
  }));

  return (
    <section className="collab-chart-card">
      <header>
        <h3>Daily points completed</h3>
      </header>
      <div className="collab-chart-card__body">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dde5ea" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completedPoints" name="Completed points" fill="#1f8a70" />
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
    date: date.slice(5),
    realRemaining: series.realRemaining[index] ?? 0,
    idealRemaining: series.idealRemaining[index] ?? 0,
  }));

  return (
    <section className="collab-chart-card">
      <header>
        <h3>Individual burndown</h3>
      </header>
      <div className="collab-chart-card__body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dde5ea" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="realRemaining" name="Real remaining" stroke="#0e2a3a" strokeWidth={2} />
            <Line
              dataKey="idealRemaining"
              name="Ideal remaining"
              stroke="#7f8c8d"
              strokeDasharray="6 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
