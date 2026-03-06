import { formatNumber } from "@/utils/format";

import "./Pagination.css";

type PaginationProps = {
  total: number;
  limit: number;
  offset: number;
  onChange: (nextOffset: number) => void;
};

export function Pagination({ total, limit, offset, onChange }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="pagination">
      <button disabled={!hasPrevious} onClick={() => onChange(Math.max(0, offset - limit))} type="button">
        Anterior
      </button>
      <span>
        Pagina {formatNumber(currentPage)} de {formatNumber(totalPages)}
      </span>
      <button disabled={!hasNext} onClick={() => onChange(offset + limit)} type="button">
        Proxima
      </button>
    </div>
  );
}