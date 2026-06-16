"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteDynamicMutation,
  useGetDynamicQuery,
  usePatchDynamicMutation,
  usePostDynamicMutation,
} from "@/src/redux/features/dynamic/dynamicApi";
import { IErrorResponse } from "@/src/interface";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import ConfirmDialog from "@/src/components/dashboard/common/modal/ConfirmDialog";
import DynamicModal from "@/src/components/dashboard/common/modal/DynamicModal";
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
import { IBanner } from "@/src/interface/dashboard/dashboard";
import { SortableBannerRow } from "@/src/components/dashboard/system/banner/SortableBannerRow";

export default function BannerPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<IBanner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [isReordering, setIsReordering] = useState(false);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data, isLoading, refetch } = useGetDynamicQuery({
    url: "/banner",
    params: { limit: 100 }, // Get all banners for reordering
  });

  const { data: singleData, isLoading: singleLoading } = useGetDynamicQuery(
    { url: `banner/${editBanner?._id}` },
    { skip: !editBanner },
  );

  const [createBanner, { isLoading: creating }] = usePostDynamicMutation();
  const [updateBanner, { isLoading: updating }] = usePatchDynamicMutation();
  const [deleteBanner, { isLoading: deleting }] = useDeleteDynamicMutation();
  const [toggleStatus] = usePatchDynamicMutation();
  const [reorderBanners] = usePostDynamicMutation();

  // Update local state when data loads
  useEffect(() => {
    if (data?.data) {
      setBanners(data.data);
    }
  }, [data]);

  // ── Drag & Drop Sensors ───────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag to activate (prevents accidental drag on click)
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
      const oldIndex = banners.findIndex((b) => b._id === active.id);
      const newIndex = banners.findIndex((b) => b._id === over.id);

      const newBanners = arrayMove(banners, oldIndex, newIndex);
      setBanners(newBanners);

      // Prepare order updates
      const bannerOrders = newBanners.map((banner, index) => ({
        _id: banner._id!,
        order: index,
      }));

      setIsReordering(true);
      try {
        await reorderBanners({
          url: "banner/reorder",
          data: { bannerOrders },
        }).unwrap();
        toast.success("Banners reordered successfully");
        refetch(); // Refresh from server
      } catch (err) {
        toast.error("Failed to reorder banners");
        refetch(); // Revert to original order
      } finally {
        setIsReordering(false);
      }
    }
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCreate = async (formData: FormData) => {
    try {
      await createBanner({
        url: "banner",
        data: formData,
        isFormData: true,
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeadingTitle name="Banners" meta={data?.meta} />
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Banner
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
              items={banners.map((b) => b._id!)}
              strategy={verticalListSortingStrategy}
            >
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="w-12 px-4 py-3"></th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Text Color
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : banners.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                          No banners found. Click "Add Banner" to create one.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    banners.map((banner) => (
                      <SortableBannerRow
                        key={banner._id}
                        banner={banner}
                        isReordering={isReordering}
                        onEdit={() => {
                          setEditBanner(banner);
                          setEditOpen(true);
                        }}
                        onToggleStatus={() => handleToggleStatus(banner)}
                        onDelete={() => setDeleteId(banner._id || null)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>
      </div>

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
