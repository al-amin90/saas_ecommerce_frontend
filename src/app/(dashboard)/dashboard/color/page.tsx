"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteDynamicMutation,
  useGetDynamicQuery,
  usePatchDynamicMutation,
  usePostDynamicMutation,
} from "@/src/redux/features/dynamic/dynamicApi";
import { IErrorResponse } from "@/src/interface";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import DataTable from "@/src/components/dashboard/shared/DataTable";
import Pagination from "@/src/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/src/components/dashboard/common/modal/ConfirmDialog";
import DynamicModal from "@/src/components/dashboard/common/modal/DynamicModal";
import { IColor } from "@/src/interface/dashboard/dashboard";

// ─── Interface ────────────────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ColorPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editColor, setEditColor] = useState<IColor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data, isLoading } = useGetDynamicQuery({
    url: "/color",
    params: { page, limit: 10 },
  });

  const [createColor, { isLoading: creating }] = usePostDynamicMutation();
  const [updateColor, { isLoading: updating }] = usePatchDynamicMutation();
  const [deleteColor, { isLoading: deleting }] = useDeleteDynamicMutation();

  const colors: IColor[] = data?.data ?? [];
  const meta = data?.meta;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleCreate = async (form: Record<string, unknown>) => {
    try {
      await createColor({ url: "color", data: form }).unwrap();
      toast.success("Color added successfully");
      setCreateOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add color");
    }
  };

  const handleUpdate = async (form: Record<string, unknown>) => {
    if (!editColor) return;
    try {
      await updateColor({
        url: `color/${editColor._id}`,
        data: form as Partial<IColor>,
      }).unwrap();
      toast.success("Color updated");
      setEditOpen(false);
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteColor({ url: `color/${deleteId}` }).unwrap();
      toast.success("Color deleted");
      setDeleteId(null);
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to delete");
    }
  };

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns = [
    {
      key: "name",
      label: "Color Name",
      render: (row: IColor) => (
        <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
          {row.name}
        </span>
      ),
    },
    {
      key: "color",
      label: "Color Preview",
      render: (row: IColor) => (
        <div className="flex items-center gap-2">
          {/* Color swatch */}
          <span
            className="inline-block w-6 h-6 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
            style={{ backgroundColor: row.color }}
          />
          <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
            {row.color}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      headClassName: "text-right",
      render: (row: IColor) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setEditColor(row);
              setEditOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(row._id || null);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeadingTitle name="Colors" meta={meta} />
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Color
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={colors}
        columns={columns}
        isLoading={isLoading}
        rowKey={(r) => r._id!}
        emptyMessage="No colors found."
      />

      {/* Pagination */}
      {meta && meta.totalPage >= 1 && (
        <Pagination
          page={page}
          totalPage={meta.totalPage}
          onPageChange={setPage}
        />
      )}

      {/* Create Modal */}
      <DynamicModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={creating}
        mode="create"
        variant="color"
      />

      {/* Edit Modal */}
      <DynamicModal
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        variantSingleId={editColor?._id ?? undefined}
        isLoading={updating}
        mode="edit"
        variant="color"
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Color?"
        description="This will permanently delete the color. Are you sure?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
