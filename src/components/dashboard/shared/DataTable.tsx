"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Column<T> = {
  key: string;
  label: string;
  headClassName?: string; // ClassTable এর মতো th-এ custom class
  className?: string; // td-এ custom class
  render?: (row: T, rowIndex: number) => React.ReactNode;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;

  // Loading
  isLoading?: boolean;
  skeletonRows?: number;

  // Empty state
  emptyMessage?: string;
  emptyImage?: React.ReactNode; // custom empty image/icon

  // Row interaction
  onRowClick?: (row: T) => void;

  // Action handlers — ClassTable এর মতো
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onToggle?: (row: T) => void;

  // Delete confirmation modal customization
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

type DeleteModalProps = {
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteConfirmModal({
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-slate-200 dark:border-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DataTable<T>({
  data,
  columns,
  rowKey,
  isLoading,
  skeletonRows = 5,
  emptyMessage = "No data available",
  emptyImage,
  onRowClick,
  onEdit,
  onDelete,
  onToggle,
  deleteConfirmTitle,
  deleteConfirmMessage,
}: DataTableProps<T>) {
  // Delete confirmation state
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);

  const confirmDelete = () => {
    if (pendingDelete && onDelete) {
      onDelete(pendingDelete);
    }
    setPendingDelete(null);
  };

  return (
    <section>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          {/* ── Head ── */}
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wide",
                    col.headClassName,
                  )}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* ── Body ── */}
          <TableBody>
            {/* Loading state */}
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              /* Empty state */
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-14 text-slate-400 dark:text-slate-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    {emptyImage ?? <div className="text-4xl">📭</div>}
                    <p className="text-sm font-semibold">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* Data rows */
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-slate-100 dark:border-slate-800 transition-colors",
                    onRowClick &&
                      "cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
                  )}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        "text-slate-700 dark:text-slate-300 py-3",
                        col.className,
                      )}
                    >
                      {/* render fn থাকলে সেটা, না হলে key দিয়ে value */}
                      {col.render
                        ? col.render(row, rowIndex)
                        : String(
                            (row as Record<string, unknown>)[col.key] ?? "—",
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Delete Confirm Modal ── */}
      {pendingDelete && (
        <DeleteConfirmModal
          title={deleteConfirmTitle}
          message={deleteConfirmMessage}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
}
