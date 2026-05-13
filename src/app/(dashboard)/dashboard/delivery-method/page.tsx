"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  useDeleteDynamicMutation,
  useGetDynamicQuery,
  usePatchDynamicMutation,
  usePostDynamicMutation,
} from "@/src/redux/features/dynamic/dynamicApi";
import { IDeliveryMethod } from "@/src/interface/dashboard/deliveryMethod.interface";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import DataTable from "@/src/components/dashboard/shared/DataTable";
import Pagination from "@/src/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/src/components/dashboard/common/modal/ConfirmDialog";
import DynamicModal from "@/src/components/dashboard/common/modal/DynamicModal";
import { IErrorResponse } from "@/src/interface";

export default function DeliveryMethodPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editMethod, setEditMethod] = useState<IDeliveryMethod | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data, isLoading } = useGetDynamicQuery({
    url: "/delivery-method",
    params: {
      page,
      limit: 10,
    },
  });

  const { data: singleData, isLoading: singleLoading } = useGetDynamicQuery(
    { url: `delivery-method/${editMethod?._id}` },
    { skip: !editMethod },
  );

  const [createMethod, { isLoading: creating }] = usePostDynamicMutation();
  const [updateMethod, { isLoading: updating }] = usePatchDynamicMutation();
  const [deleteMethod, { isLoading: deleting }] = useDeleteDynamicMutation();

  const methods = data?.data ?? [];
  const meta = data?.meta;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCreate = async (form: Record<string, unknown>) => {
    try {
      await createMethod({ url: "delivery-method", data: form }).unwrap();
      toast.success("Delivery method added successfully");
      setCreateOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add delivery method");
    }
  };

  const handleUpdate = async (form: Record<string, unknown>) => {
    if (!editMethod) return;
    try {
      await updateMethod({
        url: `delivery-method/${editMethod._id}`,
        data: form as Partial<IDeliveryMethod>,
      }).unwrap();
      toast.success("Delivery method updated");
      setEditOpen(false);
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMethod({
        url: `delivery-method/${deleteId}`,
      }).unwrap();
      toast.success("Delivery method deleted");
      setDeleteId(null);
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to delete");
    }
  };

  // ── Columns ───────────────────────────────────────────────────────────────

  const columns = [
    {
      key: "name",
      label: "Method Name",
      render: (row: IDeliveryMethod) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {row.name}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (row: IDeliveryMethod) => (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 hover:bg-blue-100">
          {row.type}
        </Badge>
      ),
    },
    {
      key: "accountPhone",
      label: "Phone",
      render: (row: IDeliveryMethod) => (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {row.accountPhone}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row: IDeliveryMethod) => (
        <Badge
          className={
            row.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 hover:bg-green-100"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100"
          }
        >
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      headClassName: "text-right",
      render: (row: IDeliveryMethod) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setEditMethod(row);
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeadingTitle name="Delivery Methods" meta={meta} />
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Method
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={methods}
        columns={columns}
        isLoading={isLoading}
        rowKey={(r) => r._id!}
        emptyMessage="No delivery methods found."
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
        variant="deliveryMethod"
      />

      {/* Edit Modal */}
      <DynamicModal
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        isLoading={updating || singleLoading}
        defaultValues={singleData?.data}
        mode="edit"
        variant="deliveryMethod"
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Delivery Method?"
        description="This will permanently delete the delivery method. Are you sure?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
