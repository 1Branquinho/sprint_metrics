import "./MetricCard.css";

type MetricCardProps = {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "warning";
};

export function MetricCard({ label, value, tone = "default" }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
