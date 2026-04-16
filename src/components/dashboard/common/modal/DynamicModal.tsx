"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/src/interface/dashboard/dashboard";
import ModalFooter from "./ModalFooter";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const colorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;
type ColorFormData = z.infer<typeof colorSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "category" | "color";

type DynamicModalProps = {
  // Modal control
  open: boolean;
  onOpenChange: (v: boolean) => void;

  // Variant determines which form renders
  variant?: Variant;

  // Trigger button props
  btnName?: string;
  btnVariant?:
    | "default"
    | "outline"
    | "ghost"
    | "secondary"
    | "destructive"
    | "link";
  hasEndIcon?: boolean;
  btnClassName?: string;
  // Pass this if you want to control open/close via button inside component
  withTrigger?: boolean;

  // Form state
  mode?: "create" | "edit";
  isLoading?: boolean;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  defaultValues?: Partial<T> | Partial<DoctorFormData>;

  // Patient-specific
  doctors?: IDoctor[];
  defaultDoctorId?: string;
  hideDoctorField?: boolean;

  // Extensible: add more variant-specific props here as needed
};

// ─── Sub-forms ────────────────────────────────────────────────────────────────

function CategoryVariant({
  isLoading,
  onSubmit,
  defaultValues,
  mode = "create",
  onCancel,
}: {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  defaultValues?: Partial<CategoryFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset({ ...defaultValues });
  }, [defaultValues]);

  const textFields: {
    name: keyof CategoryFormData;
    label: string;
    type?: string;
    placeholder: string;
  }[] = [
    {
      name: "name",
      label: "Name",
      placeholder: "Enter category name",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit((d) =>
        onSubmit({ ...d } as Record<string, unknown>),
      )}
      className="space-y-3 py-2"
    >
      {textFields.map((f) => (
        <div key={f.name} className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300 text-sm">
            {f.label}
          </Label>
          <Input
            {...register(f.name)}
            type={f.type ?? "text"}
            placeholder={f.placeholder}
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {errors[f.name] && (
            <p className="text-xs text-red-500">{errors[f.name]?.message}</p>
          )}
        </div>
      ))}

      <ModalFooter
        isLoading={isLoading}
        mode={mode}
        onCancel={onCancel}
        name="Category"
      ></ModalFooter>
    </form>
  );
}

function ColorVariant({
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
  onCancel,
}: {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  defaultValues?: Partial<ColorFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ColorFormData>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({ ...defaultValues });
  }, [defaultValues]);

  const pickedColor = watch("color");
  console.log("pickedColor", pickedColor);

  return (
    <form
      onSubmit={handleSubmit((d) => onSubmit(d as Record<string, unknown>))}
      className="space-y-3 py-2"
    >
      {/* Name */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Color Name
        </Label>
        <Input
          {...register("name")}
          placeholder="e.g. Red, Ocean Blue"
          className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Color Picker */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Color
        </Label>
        <div className="flex items-center gap-3">
          {/* Native color input */}
          <input
            value={pickedColor || "#000000"}
            onChange={(e) => setValue("color", e.target.value)}
            type="color"
            className="w-28 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent p-0.5"
          />
          {/* Hex value display */}
          <Input
            {...register("color")}
            placeholder="#000000"
            className="h-9 font-mono bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {/* Live preview swatch */}
          <span
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
            style={{ backgroundColor: pickedColor || "#000000" }}
          />
        </div>
        {errors.color && (
          <p className="text-xs text-red-500">{errors.color.message}</p>
        )}
      </div>

      <ModalFooter
        isLoading={isLoading}
        mode={mode}
        onCancel={onCancel}
        name="Color"
      ></ModalFooter>
    </form>
  );
}
// ─── Title map ────────────────────────────────────────────────────────────────

const defaultTitleMap: Record<Variant, Record<"create" | "edit", string>> = {
  category: { create: "Add New Category", edit: "Edit Category" },
  color: { create: "Add New Color", edit: "Edit Color" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DynamicModal = ({
  open,
  onOpenChange,
  variant = "category",
  btnName,
  btnVariant = "default",
  hasEndIcon = true,
  btnClassName,
  withTrigger = false,
  mode = "create",
  isLoading,
  onSubmit,
  defaultValues,
}: DynamicModalProps) => {
  const title = defaultTitleMap[variant][mode];

  console.log("open", open);

  const renderVariant = () => {
    switch (variant) {
      case "category":
        return (
          <CategoryVariant
            onSubmit={onSubmit}
            defaultValues={defaultValues as Partial<CategoryFormData>}
            mode={mode}
            onCancel={() => onOpenChange(false)}
          />
        );

      case "color":
        return (
          <ColorVariant
            onSubmit={onSubmit}
            defaultValues={defaultValues as Partial<ColorFormData>}
            isLoading={isLoading}
            mode={mode}
            onCancel={() => onOpenChange(false)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {withTrigger && (
        <Button
          variant={btnVariant}
          onClick={() => onOpenChange(true)}
          className={btnClassName}
        >
          {btnName ?? "Open"}
          {hasEndIcon && <Plus size={18} className="ml-1" />}
        </Button>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-800 dark:text-white">
              {title}
            </DialogTitle>
          </DialogHeader>

          {renderVariant()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicModal;
