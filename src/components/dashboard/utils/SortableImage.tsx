import { IImageItem } from "@/src/interface/dashboard/product.interface";
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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";

// ── Single Sortable Image ─────────────────────────────────────────────────────

function SortableImage({
  item,
  index,
  onRemove,
}: {
  item: IImageItem;
  index: number;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
        isDragging
          ? "border-blue-400 shadow-xl shadow-blue-200 scale-105 z-50 opacity-90"
          : index === 0
            ? "border-blue-400"
            : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <img
        src={item.preview}
        alt={`Image ${index + 1}`}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* First image badge */}
      {index === 0 && (
        <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
          Main
        </div>
      )}

      {/* Type badge */}
      <div
        className={`absolute bottom-1.5 left-1.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
          item.type === "existing"
            ? "bg-black/50 text-white"
            : "bg-green-500/80 text-white"
        }`}
      >
        {item.type === "existing" ? "Saved" : "New"}
      </div>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1.5 right-8 bg-black/40 hover:bg-black/60 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="4" cy="3" r="1.2" />
          <circle cx="8" cy="3" r="1.2" />
          <circle cx="4" cy="6" r="1.2" />
          <circle cx="8" cy="6" r="1.2" />
          <circle cx="4" cy="9" r="1.2" />
          <circle cx="8" cy="9" r="1.2" />
        </svg>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
      >
        <X size={12} />
      </button>

      {/* Drag overlay hint */}
      {isDragging && <div className="absolute inset-0 bg-blue-400/20" />}
    </div>
  );
}

export default SortableImage;
