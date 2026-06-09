// components/ui/ImageDropzone.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
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
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface IImageItem {
  id: string;
  type: "existing" | "new";
  url: string;
  file?: File;
  preview: string;
}

interface ImageDropzoneProps {
  value: IImageItem[];
  onChange: (images: IImageItem[]) => void;
  maxFiles?: number;
  maxSize?: number; // bytes
  className?: string;
}

// ── Sortable Image ────────────────────────────────────────────────────────────

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

      {/* Main badge */}
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
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="4" cy="3" r="1.2" />
          <circle cx="8" cy="3" r="1.2" />
          <circle cx="4" cy="6" r="1.2" />
          <circle cx="8" cy="6" r="1.2" />
          <circle cx="4" cy="9" r="1.2" />
          <circle cx="8" cy="9" r="1.2" />
        </svg>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ImageDropzone({
  value,
  onChange,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  className = "",
}: ImageDropzoneProps) {
  const remaining = maxFiles - value.length;

  // ── Drag to sort ──────────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((img) => img.id === active.id);
      const newIndex = value.findIndex((img) => img.id === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  // ── Dropzone ──────────────────────────────────────────────────────────────
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const code = rejectedFiles[0].errors[0].code;
        if (code === "file-too-large")
          toast.error(`Max size is ${Math.round(maxSize / 1024 / 1024)}MB`);
        else if (code === "file-invalid-type")
          toast.error("Only JPG, PNG, WebP allowed");
        else if (code === "too-many-files")
          toast.error(
            `Only ${remaining} slot${remaining !== 1 ? "s" : ""} remaining`,
          );
        return;
      }

      const newItems: IImageItem[] = acceptedFiles
        .slice(0, remaining)
        .map((file) => ({
          id: `new-${Date.now()}-${Math.random()}-${file.name}`,
          type: "new" as const,
          url: "",
          file,
          preview: URL.createObjectURL(file),
        }));

      onChange([...value, ...newItems]);
    },
    [value, onChange, remaining, maxSize],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
      maxSize,
      maxFiles: remaining,
      disabled: remaining <= 0,
      onDrop,
    });

  // ── Remove ────────────────────────────────────────────────────────────────
  const handleRemove = (id: string) => {
    onChange(value.filter((img) => img.id !== id));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {value.length}/{maxFiles} images
          {value.length > 1 && " · Drag to reorder"}
        </span>
        {value.length > 1 && (
          <span className="text-xs text-blue-500 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
              <circle cx="4" cy="3" r="1.2" />
              <circle cx="8" cy="3" r="1.2" />
              <circle cx="4" cy="6" r="1.2" />
              <circle cx="8" cy="6" r="1.2" />
              <circle cx="4" cy="9" r="1.2" />
              <circle cx="8" cy="9" r="1.2" />
            </svg>
            First image = main photo
          </span>
        )}
      </div>

      {/* Sortable grid */}
      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={value.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-2">
              {value.map((item, idx) => (
                <SortableImage
                  key={item.id}
                  item={item}
                  index={idx}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Dropzone */}
      {remaining > 0 && (
        <div
          {...getRootProps()}
          className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
            isDragReject
              ? "border-red-400 bg-red-50 dark:bg-red-950/20"
              : isDragActive
                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20 scale-[1.01]"
                : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/10"
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-3 p-5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isDragReject
                  ? "bg-red-100 dark:bg-red-900/40"
                  : isDragActive
                    ? "bg-blue-100 dark:bg-blue-900/40 scale-110"
                    : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              {isDragReject ? (
                <X size={18} className="text-red-500" />
              ) : isDragActive ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-blue-500"
                >
                  <path d="M12 2v14M12 2L8 6M12 2L16 6" />
                  <path d="M2 17v3a2 2 0 002 2h16a2 2 0 002-2v-3" />
                </svg>
              ) : (
                <Upload size={18} className="text-slate-400" />
              )}
            </div>

            <div className="text-center space-y-0.5">
              <p
                className={`text-sm font-semibold ${
                  isDragReject
                    ? "text-red-600"
                    : isDragActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {isDragReject
                  ? "File type not supported"
                  : isDragActive
                    ? "Drop to upload"
                    : "Click or drag images here"}
              </p>
              <p className="text-xs text-slate-400">
                PNG, JPG, WebP · Max {Math.round(maxSize / 1024 / 1024)}MB ·{" "}
                <span className="font-semibold text-slate-500">
                  {remaining}
                </span>{" "}
                slots left
              </p>
            </div>

            {isDragActive && !isDragReject && (
              <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Release to upload
              </div>
            )}

            {isDragReject && (
              <div className="flex items-center gap-1.5 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                <X size={10} />
                Invalid file type
              </div>
            )}
          </div>

          {isDragActive && !isDragReject && (
            <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-blue-400 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}
