"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPage: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
};

const LIMIT_OPTIONS = [5, 10, 20, 50, 100];

export default function Pagination({
  page,
  totalPage,
  total,
  limit = 10,
  onPageChange,
  onLimitChange,
}: Props) {
  const pages = Array.from({ length: Math.min(totalPage, 5) }, (_, i) => {
    if (totalPage <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPage - 2) return totalPage - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
      {/* ── Left: total info + limit select ── */}
      <div className="flex items-center gap-3">
        {total !== undefined && (
          <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {Math.min((page - 1) * limit + 1, total)}–
              {Math.min(page * limit, total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {total}
            </span>
          </p>
        )}
      </div>

      {/* ── Right: page navigation ── */}
      <div className="flex items-center gap-1">
        {/* Limit select */}
        {onLimitChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 whitespace-nowrap">
              Rows:
            </span>
            <select
              value={limit}
              onChange={(e) => {
                onLimitChange(Number(e.target.value));
                onPageChange(1); // limit change হলে first page এ যাও
              }}
              className="h-8 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-300 cursor-pointer hover:border-slate-400 transition-colors"
            >
              {LIMIT_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* First page + ellipsis */}
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              1
            </button>
            {pages[0] > 2 && (
              <span className="h-8 w-6 flex items-center justify-center text-xs text-slate-400">
                ···
              </span>
            )}
          </>
        )}

        {/* Page numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
              p === page
                ? "bg-black dark:bg-white text-white dark:text-black shadow-md scale-105 border-transparent"
                : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Last page + ellipsis */}
        {pages[pages.length - 1] < totalPage && (
          <>
            {pages[pages.length - 1] < totalPage - 1 && (
              <span className="h-8 w-6 flex items-center justify-center text-xs text-slate-400">
                ···
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPage)}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {totalPage}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPage}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
