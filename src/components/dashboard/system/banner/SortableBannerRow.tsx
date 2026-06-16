"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

import Image from "next/image";
import { IBanner } from "@/src/interface/dashboard/dashboard";

interface SortableBannerRowProps {
  banner: IBanner;
  isReordering: boolean;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export function SortableBannerRow({
  banner,
  isReordering,
  onEdit,
  onToggleStatus,
  onDelete,
}: SortableBannerRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner._id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "rgb(243 244 246)" : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      {/* Drag Handle */}
      <td className="px-4 py-3">
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${
            isReordering ? "cursor-wait" : ""
          }`}
        >
          <GripVertical className="h-5 w-5" />
        </div>
      </td>

      {/* Banner Image */}
      <td className="px-4 py-3">
        <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          {banner.image ? (
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>
      </td>

      {/* Title */}
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {banner.title}
          </p>
          {banner.subTitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {banner.subTitle}
            </p>
          )}
        </div>
      </td>

      {/* Text Color */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
            style={{ backgroundColor: banner.colorHex || "#ffffff" }}
          />
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {banner.colorHex || "#ffffff"}
          </span>
        </div>
      </td>

      {/* Product */}
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {banner.productID && typeof banner.productID === "object"
            ? banner.productID.name
            : "—"}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <Badge
          variant={banner.isActive ? "default" : "secondary"}
          className={
            banner.isActive
              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
          }
        >
          {banner.isActive ? "Active" : "Inactive"}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 rounded-lg"
            onClick={onToggleStatus}
            title={banner.isActive ? "Deactivate" : "Activate"}
          >
            <EyeOff className={`h-4 w-4 ${!banner.isActive && "opacity-50"}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
