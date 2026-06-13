"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { IBanner } from "@/src/interface/dashboard/dashboard";

export default function BannerPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<IBanner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data, isLoading, refetch } = useGetDynamicQuery({
    url: "banner",
    params: { page, limit: 10 },
  });

  const { data: singleData, isLoading: singleLoading } = useGetDynamicQuery(
    { url: `banner/${editBanner?._id}` },
    { skip: !editBanner },
  );

  const [createBanner, { isLoading: creating }] = usePostDynamicMutation();
  const [updateBanner, { isLoading: updating }] = usePatchDynamicMutation();
  const [deleteBanner, { isLoading: deleting }] = useDeleteDynamicMutation();
  const [toggleStatus] = usePatchDynamicMutation();

  const banners: IBanner[] = data?.data ?? [];
  const meta = data?.meta;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCreate = async (formData: FormData) => {
    try {
      await createBanner({
        url: "banner",
        data: formData,
        isFormData: true, // Important for file upload
      }).unwrap();
      toast.success("Banner created successfully");
      setCreateOpen(false);
      refetch();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to create banner");
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editBanner) return;
    try {
      await updateBanner({
        url: `banner/${editBanner._id}`,
        data: formData,
        isFormData: true,
      }).unwrap();
      toast.success("Banner updated successfully");
      setEditOpen(false);
      refetch();
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to update banner");
    }
  };

  const handleToggleStatus = async (banner: IBanner) => {
    try {
      await toggleStatus({
        url: `banner/${banner._id}/toggle`,
        data: {},
      }).unwrap();
      toast.success(
        `Banner ${banner.isActive ? "deactivated" : "activated"} successfully`,
      );
      refetch();
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to toggle status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBanner({ url: `banner/${deleteId}` }).unwrap();
      toast.success("Banner deleted successfully");
      setDeleteId(null);
      refetch();
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to delete banner");
    }
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns = [
    {
      key: "image",
      label: "Banner",
      render: (row: IBanner) => (
        <div className="relative w-16 h-16 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
          {row.image ? (
            <Image
              src={row.image}
              alt={row.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="text-xs text-slate-400">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (row: IBanner) => (
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-300">
            {row.title}
          </p>
          {row.subTitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {row.subTitle}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "colorHex",
      label: "Text Color",
      render: (row: IBanner) => (
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-6 h-6 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
            style={{ backgroundColor: row.colorHex || "#ffffff" }}
          />
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
            {row.colorHex || "#ffffff"}
          </span>
        </div>
      ),
    },
    {
      key: "productID",
      label: "Product",
      render: (row: IBanner) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {row.productID && typeof row.productID === "object"
            ? row.productID.name
            : "—"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row: IBanner) => (
        <Badge
          variant={row.isActive ? "default" : "secondary"}
          className={
            row.isActive
              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
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
      render: (row: IBanner) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
            title={row.isActive ? "Deactivate" : "Activate"}
          >
            <EyeOff className={`h-4 w-4 ${!row.isActive && "opacity-50"}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setEditBanner(row);
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeadingTitle name="Banners" meta={meta} />
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={banners}
        columns={columns}
        isLoading={isLoading}
        rowKey={(r) => r._id!}
        emptyMessage="No banners found. Click 'Add Banner' to create one."
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
        variant="banner"
      />

      {/* Edit Modal */}
      <DynamicModal
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        defaultValues={singleData?.data ?? undefined}
        isLoading={updating || singleLoading}
        mode="edit"
        variant="banner"
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Banner?"
        description="This will permanently delete the banner. Are you sure?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
