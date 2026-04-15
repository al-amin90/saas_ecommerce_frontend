"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import {
  useDeleteDynamicMutation,
  useGetDynamicQuery,
  usePatchDynamicMutation,
  usePostDynamicMutation,
} from "@/src/redux/features/dynamic/dynamicApi";
import { ICategory } from "@/src/interface/dashboard/dashboard";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import DataTable from "@/src/components/dashboard/shared/DataTable";
import Pagination from "@/src/components/dashboard/shared/Pagination";
import ConfirmDialog from "@/src/components/dashboard/common/modal/ConfirmDialog";
import DynamicModal from "@/src/components/dashboard/common/modal/DynamicModal";

export default function CategoryPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<ICategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetDynamicQuery({
    url: "/category",
    params: {
      page,
      limit: 10,
    },
  });

  console.log("data", data);

  const [createCategory, { isLoading: creating }] = usePostDynamicMutation();
  const [updateCategory, { isLoading: updating }] = usePatchDynamicMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteDynamicMutation();

  const categorys = data?.data ?? [];
  const meta = data?.meta;

  const handleCreate = async (form: Record<string, unknown>) => {
    try {
      await createCategory({ url: "category", data: form }).unwrap();
      toast.success("Category added successfully");
      setCreateOpen(false);
    } catch (err: unknown) {
      console.log(";errf", err);
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to add Category");
    }
  };

  const handleUpdate = async (form: Record<string, unknown>) => {
    if (!editCategory) return;
    console.log("editCategory", editCategory);

    try {
      await updateCategory({
        url: `category/${editCategory._id}`,
        data: form as Partial<ICategory>,
      }).unwrap();
      toast.success("Category updated");
      setEditCategory(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory({
        url: `category/${deleteId}`,
      }).unwrap();
      toast.success("Category deleted");
      setDeleteId(null);
    } catch (err) {
      console.log("err", err);
      toast.error(err?.message ?? "Failed to delete");
    }
  };

  const columns = [
    { key: "name", label: "Category Name" },
    {
      key: "actions",
      label: "Actions",
      headClassName: "text-right",
      render: (row: ICategory) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              // setEditDoctor(row);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeadingTitle name={"Categorys"} meta={meta} />

        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <DataTable
        data={categorys}
        columns={columns}
        isLoading={isLoading}
        rowKey={(r) => r._id}
        emptyMessage="No Categorys found."
      />

      {/* pagination ys here*/}
      {meta && meta.totalPage >= 1 && (
        <Pagination
          page={page}
          totalPage={meta.totalPage}
          onPageChange={setPage}
        />
      )}

      {/*all modals are here */}
      <DynamicModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={creating}
        mode="create"
      />
      <DynamicModal
        open={!!editCategory}
        onOpenChange={(v) => !v && setEditCategory(null)}
        onSubmit={handleUpdate}
        defaultValues={editCategory ?? undefined}
        isLoading={updating}
        mode="edit"
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Category?"
        description="This will delete Paranently. Are you sure?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
