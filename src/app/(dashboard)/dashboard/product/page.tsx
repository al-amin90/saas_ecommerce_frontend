"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useGetDynamicQuery } from "@/src/redux/features/dynamic/dynamicApi";
import { IErrorResponse } from "@/src/interface";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
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
import {
  ICategory,
  IColor,
  ISizeChart,
} from "@/src/interface/dashboard/dashboard";
import { useGetAllSizeChartsQuery } from "@/src/redux/features/sizeChart/sizeChart";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableProductRow } from "@/src/components/dashboard/product/SortableProductRow";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isReordering, setIsReordering] = useState(false);

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data, isLoading, refetch } = useGetProductQuery({
    url: "/product",
    params: { page, limit },
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
  const { data: sizeChartData, isLoading: sizeChartsLoading } =
    useGetAllSizeChartsQuery(undefined);

  const [createProduct, { isLoading: creating }] = usePostProductMutation();
  const [updateProduct, { isLoading: updating }] = usePatchProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [reorderProducts, { isLoading: reordering }] = usePostProductMutation();

  // Update local state when data loads
  useEffect(() => {
    if (data?.data) {
      setProducts(data.data);
    }
  }, [data]);

  const categories = categoryData?.data ?? [];
  const colors = colorData?.data ?? [];

  // ── Drag & Drop Sensors ───────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ── Handle Drag End ───────────────────────────────────────────────────────
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p._id === active.id);
      const newIndex = products.findIndex((p) => p._id === over.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);

      // Prepare order updates
      const productOrders = newProducts.map((product, index) => ({
        _id: product._id!,
        order: index,
      }));

      setIsReordering(true);
      try {
        await reorderProducts({
          url: "product/reorder",
          data: { productOrders },
        }).unwrap();
        toast.success("Products reordered successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to reorder products");
        refetch();
      } finally {
        setIsReordering(false);
      }
    }
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCreate = async (form: ProductFormData) => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description ?? "");
      formData.append("sku", form.sku);
      formData.append("price", String(form.price));
      formData.append("discountPrice", String(form.discountPrice));
      formData.append("originalPrice", String(form.originalPrice));
      formData.append("categoryID", form.categoryID);
      formData.append("sizeChartId", String(form.sizeChartId));

      if (form.images?.length) {
        form.images.forEach((image: File) => {
          formData.append("images", image);
        });
      }

      formData.append("variant", JSON.stringify(form.variant));

      await createProduct({ url: "product", data: formData }).unwrap();

      toast.success("Product added successfully");
      setCreateOpen(false);
      refetch();
    } catch (err: unknown) {
      console.log("err", err);
      const error = err as { data?: { message?: string } };
      const sourceError = err as {
        data?: { errorSources: { message?: string }[] };
      };
      toast.error(
        sourceError?.data?.errorSources?.[0]?.message ||
          error?.data?.message ||
          "Failed to add product",
      );
    }
  };

  const handleUpdate = async (
    form: ProductFormData,
    defaultValues: Partial<ProductFormData> = {},
  ) => {
    if (!editProduct) return;

    try {
      const formData = new FormData();

      if (form.name !== defaultValues?.name) {
        formData.append("name", form.name);
      }

      if (form.description !== defaultValues?.description) {
        formData.append("description", form.description ?? "");
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

      if (form.originalPrice !== defaultValues?.originalPrice) {
        formData.append("originalPrice", String(form.originalPrice || 0));
      }

      if (form.categoryID !== defaultValues?.categoryID) {
        formData.append("categoryID", form.categoryID);
      }

      if (form.sizeChartId !== defaultValues?.sizeChartId) {
        formData.append("sizeChartId", String(form.sizeChartId));
      }

      const variantChanged =
        JSON.stringify(form.variant) !== JSON.stringify(defaultValues?.variant);

      if (variantChanged) {
        formData.append("variant", JSON.stringify(form.variant));
      }

      if (form.images?.length) {
        form.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      if (form.existingImages?.length) {
        form.existingImages.forEach((url) => {
          formData.append("existingImages", url);
        });
      }

      console.log(Object.fromEntries(formData));

      await updateProduct({
        url: `product/${editProduct._id}`,
        data: formData as Partial<IProduct>,
      }).unwrap();

      toast.success("Product updated");
      setEditOpen(false);
      refetch();
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
      refetch();
    } catch (err: unknown) {
      const error = err as IErrorResponse;
      toast.error(error?.message ?? "Failed to delete");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeadingTitle name="Products" meta={data?.meta} />
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Drag & Drop Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={products.map((p) => p._id!)}
              strategy={verticalListSortingStrategy}
            >
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="w-12 px-4 py-3"></th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Variants
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || sizeChartsLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                          No products found. Click "Add Product" to create one.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <SortableProductRow
                        key={product._id}
                        product={product}
                        isReordering={isReordering || reordering}
                        onEdit={() => {
                          setEditProduct(product);
                          setEditOpen(true);
                        }}
                        onDelete={() => setDeleteId(product._id || null)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.totalPage >= 1 && (
        <Pagination
          page={page}
          totalPage={data.meta.totalPage}
          total={data.meta.total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}

      {/* Create Modal */}
      <DynamicModal<ProductFormData, ICategory, IColor, ISizeChart>
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={creating}
        dialogClassName="sm:max-w-4xl"
        mode="create"
        variant="product"
        options1={categories}
        options2={colors}
        options3={sizeChartData?.data}
      />

      {/* Edit Modal */}
      <DynamicModal<ProductFormData, ICategory, IColor, ISizeChart>
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        isLoading={updating || singleLoading}
        defaultValues={singleData?.data}
        dialogClassName="sm:max-w-4xl"
        mode="edit"
        variant="product"
        options1={categories}
        options2={colors}
        options3={sizeChartData?.data}
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
