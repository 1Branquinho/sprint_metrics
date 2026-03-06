export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(value);
}