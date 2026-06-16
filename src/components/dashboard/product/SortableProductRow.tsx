"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Pencil, Trash2, ImageIcon } from "lucide-react";
import { IProduct } from "@/src/interface/dashboard/product.interface";

interface SortableProductRowProps {
  product: IProduct;
  isReordering: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableProductRow({
  product,
  isReordering,
  onEdit,
  onDelete,
}: SortableProductRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id! });

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

      {/* Image */}
      <td className="px-4 py-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
      </td>

      {/* Product Name & SKU */}
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {product.name}
          </p>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
            SKU: {product.sku}
          </p>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {typeof product.categoryID === "object" && product.categoryID?.name
            ? product.categoryID.name
            : "—"}
        </span>
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            ৳{product.price}
          </span>
          {product.discountPrice && product.discountPrice < product.price && (
            <span className="ml-2 text-xs text-green-600 dark:text-green-400">
              -{Math.round((1 - product.discountPrice / product.price) * 100)}%
            </span>
          )}
        </div>
        {product.discountPrice && product.discountPrice < product.price && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Discount: ৳{product.discountPrice}
          </div>
        )}
      </td>

      {/* Variants */}
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {product.variant?.length ?? 0} color
          {(product.variant?.length ?? 0) !== 1 ? "s" : ""}
        </span>
        {product.variant && product.variant.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {product.variant.slice(0, 4).map((v, idx) => (
              <span
                key={idx}
                className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: v.color?.color || "#ccc" }}
                title={v.color?.name || "Color"}
              />
            ))}
            {product.variant.length > 4 && (
              <span className="text-xs text-gray-400">
                +{product.variant.length - 4}
              </span>
            )}
          </div>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <Badge
          className={
            product.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 hover:bg-green-100"
              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100"
          }
        >
          {product.isActive ? "Active" : "Inactive"}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
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
