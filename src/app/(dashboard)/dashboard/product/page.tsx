"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useGetDynamicQuery } from "@/src/redux/features/dynamic/dynamicApi";
import { IErrorResponse } from "@/src/interface";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import DataTable from "@/src/components/dashboard/shared/DataTable";
import Pagination from "@/src/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/src/components/dashboard/common/modal/ConfirmDialog";
import DynamicModal from "@/src/components/dashboard/common/modal/DynamicModal";
import { IProduct } from "@/src/interface/dashboard/product.interface";
import {
  useDeleteProductMutation,
  useGetProductQuery,
  useGetSingleProductQuery,
  usePatchProductMutation,
  usePostProductMutation,
} from "@/src/redux/features/product/productApi";
import { ProductFormData } from "@/src/validation";
import { ICategory, IColor } from "@/src/interface/dashboard/dashboard";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data, isLoading } = useGetProductQuery({
    url: "/product",
    params: { page, limit: 10 },
  });

  const { data: singleData, isLoading: singleLoading } =
    useGetSingleProductQuery(
      { url: `product/${editProduct?._id}` },
      { skip: !editProduct },
    );

  // categories & colors for selects inside the modal
  const { data: categoryData } = useGetDynamicQuery({
    url: "/category",
    params: { limit: 100 },
  });
  const { data: colorData } = useGetDynamicQuery({
    url: "/color",
    params: { limit: 100 },
  });

  const [createProduct, { isLoading: creating }] = usePostProductMutation();
  const [updateProduct, { isLoading: updating }] = usePatchProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const products: IProduct[] = data?.data ?? [];
  const meta = data?.meta;
  const categories = categoryData?.data ?? [];
  const colors = colorData?.data ?? [];

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCreate = async (form: ProductFormData) => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("sku", form.sku);
      formData.append("price", String(form.price));
      formData.append("discountPrice", String(form.discountPrice || 0));
      formData.append("categoryID", form.categoryID);

      if (form.images) {
        form.images.forEach((image: File) => {
          formData.append("images", image);
        });
      }

      formData.append("variant", JSON.stringify(form.variant));

      await createProduct({ url: "product", data: formData }).unwrap();

      toast.success("Product added successfully");
      setCreateOpen(false);
    } catch (err: unknown) {
      console.log("err", err);
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add product");
    }
  };

  const handleUpdate = async ({
    form,
    defaultValues,
  }: {
    form: ProductFormData;
    defaultValues: Partial<ProductFormData>;
  }) => {
    if (!editProduct) return;
    try {
      const formData = new FormData();

      // String fields

      if (form.name !== defaultValues?.name) {
        formData.append("name", form.name);
      }
      if (form.sku !== defaultValues?.sku) {
        formData.append("sku", form.sku);
      }
      if (form.price !== defaultValues?.price) {
        formData.append("price", String(form.price));
      }
      if (form.discountPrice !== defaultValues?.discountPrice) {
        formData.append("discountPrice", String(form.discountPrice || 0));
      }
      if (form.categoryID !== defaultValues?.categoryID) {
        formData.append("categoryID", form.categoryID);
      }
      if (form.description !== defaultValues?.description) {
        formData.append("description", form.description || "");
      }

      // New images
      if (form.images) {
        form.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      // Existing images to keep
      if (form?.existingImages) {
        console.log("form?.existingImages", form?.existingImages);
        formData.append("existingImages", JSON.stringify(form?.existingImages));
      }

      // Variant
      formData.append("variant", JSON.stringify(form.variant));

      await updateProduct({
        url: `product/${editProduct._id}`,
        data: formData as Partial<IProduct>,
      }).unwrap();
      toast.success("Product updated");
      setEditOpen(false);
    } catch (err: unknown) {
      const error = err as { data: IErrorResponse };
      console.log("err", err);
      toast.error(error?.data?.message ?? "Failed to update");
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
      <DynamicModal<ProductFormData, ICategory, IColor>
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        isLoading={updating || singleLoading}
        defaultValues={singleData?.data}
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
