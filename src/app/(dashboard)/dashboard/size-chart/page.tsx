"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import DynamicModal from "@/src/components/dashboard/common/modal/DynamicModal";
import ConfirmDialog from "@/src/components/dashboard/common/modal/ConfirmDialog";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import {
  useCreateSizeChartMutation,
  useDeleteSizeChartMutation,
  useGetAllSizeChartsQuery,
  useUpdateSizeChartMutation,
} from "@/src/redux/features/sizeChart/sizeChart";
import { SizeChartFormData } from "@/src/validation";

interface ISizeChartRow {
  size: string;
  innerLength?: string;
  feetLength?: string;
  ageRange?: string;
  note?: string;
}

interface ISizeChart {
  _id: string;
  chartName: string;
  brand?: string;
  region?: string;
  targetGroup?: string;
  rows: ISizeChartRow[];
}

// ── Chart Card ────────────────────────────────────────────────────────────────

function ChartCard({
  chart,
  onEdit,
  onDelete,
}: {
  chart: ISizeChart;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            {chart.chartName}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {chart.brand && (
              <span className="text-xs text-slate-400">{chart.brand}</span>
            )}
            {chart.region && (
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                {chart.region}
              </span>
            )}
            {chart.targetGroup && (
              <span className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                {chart.targetGroup}
              </span>
            )}
            <span className="text-xs text-slate-400">
              {chart.rows.length} sizes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                {["Size", "Inner (cm)", "Feet (cm)", "Age Range", "Note"].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-2 px-3 text-left font-semibold text-slate-400 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-2 px-3 font-semibold text-slate-800 dark:text-white">
                    {row.size}
                  </td>
                  <td className="py-2 px-3 text-slate-500">
                    {row.innerLength ?? "—"}
                  </td>
                  <td className="py-2 px-3 text-slate-500">
                    {row.feetLength ?? "—"}
                  </td>
                  <td className="py-2 px-3 text-slate-500">
                    {row.ageRange ?? "—"}
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {row.note ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SizeChartPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editChart, setEditChart] = useState<ISizeChart | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetAllSizeChartsQuery(undefined);

  const [createChart, { isLoading: creating }] = useCreateSizeChartMutation();
  const [updateChart, { isLoading: updating }] = useUpdateSizeChartMutation();
  const [deleteChart, { isLoading: deleting }] = useDeleteSizeChartMutation();

  const charts: ISizeChart[] = data?.data ?? [];

  const handleCreate = async (form: Record<string, unknown>) => {
    console.log("form", form);
    try {
      await createChart(form).unwrap();
      toast.success("Size chart created");
      setCreateOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to create");
    }
  };

  const handleUpdate = async (form: SizeChartFormData) => {
    if (!editChart) return;
    try {
      await updateChart({ chartId: editChart._id, data: form }).unwrap();
      toast.success("Size chart updated");
      setEditOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteChart(deleteId).unwrap();
      toast.success("Size chart deleted");
      setDeleteId(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <PageHeadingTitle name="Size Charts" meta={{ total: charts.length }} />
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-black hover:bg-slate-800 text-white gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Chart
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : charts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
          No size charts yet.
        </div>
      ) : (
        <div className="space-y-3">
          {charts.map((chart) => (
            <ChartCard
              key={chart._id}
              chart={chart}
              onEdit={() => {
                setEditChart(chart);
                setEditOpen(true);
              }}
              onDelete={() => setDeleteId(chart._id)}
            />
          ))}
        </div>
      )}

      <DynamicModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={creating}
        mode="create"
        variant="sizeChart"
      />

      <DynamicModal
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        defaultValues={editChart}
        isLoading={updating}
        mode="edit"
        variant="sizeChart"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Size Chart?"
        description="Products using this chart will lose the reference."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
