export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }

  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function formatDateShort(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }

  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function parseDate(value: string): Date {
  // Avoid timezone shifts for YYYY-MM-DD values returned by the API.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
}