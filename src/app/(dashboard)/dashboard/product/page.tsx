"use client";

import { useState } from "react";
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
import { IErrorResponse } from "@/src/interface";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import DataTable from "@/src/components/dashboard/shared/DataTable";
import Pagination from "@/src/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/src/components/dashboard/common/modal/ConfirmDialog";
import DynamicModal from "@/src/components/dashboard/common/modal/DynamicModal";
import { IProduct } from "@/src/interface/dashboard/product.interface";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data, isLoading } = useGetDynamicQuery({
    url: "/product",
    params: { page, limit: 10 },
  });

  // categories & colors for selects inside the modal
  const { data: categoryData } = useGetDynamicQuery({
    url: "/category",
    params: { limit: 100 },
  });
  const { data: colorData } = useGetDynamicQuery({
    url: "/color",
    params: { limit: 100 },
  });

  const [createProduct, { isLoading: creating }] = usePostDynamicMutation();
  const [updateProduct, { isLoading: updating }] = usePatchDynamicMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteDynamicMutation();

  const products: IProduct[] = data?.data ?? [];
  const meta = data?.meta;
  const categories = categoryData?.data ?? [];
  const colors = colorData?.data ?? [];

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCreate = async (form: Record<string, unknown>) => {
    try {
      await createProduct({ url: "product", data: form }).unwrap();
      toast.success("Product added successfully");
      setCreateOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add product");
    }
  };

  const handleUpdate = async (form: Record<string, unknown>) => {
    if (!editProduct) return;
    try {
      await updateProduct({
        url: `product/${editProduct._id}`,
        data: form as Partial<IProduct>,
      }).unwrap();
      toast.success("Product updated");
      setEditOpen(false);
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct({ url: `product/${deleteId}` }).unwrap();
      toast.success("Product deleted");
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
      label: "Product Name",
      render: (row: IProduct) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {row.name}
        </span>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      render: (row: IProduct) => (
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          {row.sku}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row: IProduct) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            ${row.price}
          </span>
          {row.discountPrice < row.price && (
            <span className="text-xs text-green-600 dark:text-green-400">
              ${row.discountPrice} sale
            </span>
          )}
        </div>
      ),
    },
    {
      key: "variant",
      label: "Variants",
      render: (row: IProduct) => (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {row.variant?.length ?? 0} color
          {(row.variant?.length ?? 0) !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row: IProduct) => (
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
      render: (row: IProduct) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setEditProduct(row);
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
        <PageHeadingTitle name="Products" meta={meta} />
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        rowKey={(r) => r._id!}
        emptyMessage="No products found."
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
        variant="product"
        options1={categories}
        options2={colors}
      />

      {/* Edit Modal */}
      <DynamicModal
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        defaultValues={editProduct ?? undefined}
        isLoading={updating}
        mode="edit"
        variant="product"
        options1={categories}
        options2={colors}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Product?"
        description="This will permanently delete the product. Are you sure?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
