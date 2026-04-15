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

const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
});

type CategoryFormData = z.infer<typeof categorySchema>;
type DoctorFormData = z.infer<typeof doctorSchema>;

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
  doctors = [],
  onCancel,
}: {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  defaultValues?: Partial<CategoryFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  doctors?: ICategory[];
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

// ─────────────────────────────────────────────────────────────────────────────

function DoctorVariant({
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
  onCancel,
}: {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  defaultValues?: Partial<DoctorFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues]);

  const textFields: {
    name: keyof DoctorFormData;
    label: string;
    placeholder: string;
  }[] = [
    { name: "name", label: "Doctor Name", placeholder: "Dr. John Doe" },
    {
      name: "specialization",
      label: "Specialization",
      placeholder: "e.g. Cardiologist",
    },
    { name: "phone", label: "Phone", placeholder: "Enter phone number" },
    { name: "email", label: "Email", placeholder: "doctor@hospital.com" },
  ];

  return (
    <form
      onSubmit={handleSubmit((d) => onSubmit(d as Record<string, unknown>))}
      className="space-y-3 py-2"
    >
      {textFields.map((f) => (
        <div key={f.name} className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300 text-sm">
            {f.label}
          </Label>
          <Input
            {...register(f.name)}
            placeholder={f.placeholder}
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {errors[f.name] && (
            <p className="text-xs text-red-500">{errors[f.name]?.message}</p>
          )}
        </div>
      ))}

      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-200 dark:border-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading
            ? mode === "create"
              ? "Adding..."
              : "Saving..."
            : mode === "create"
              ? "Add Doctor"
              : "Save"}
        </Button>
      </DialogFooter>
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
  doctors,
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
            doctors={doctors}
            onCancel={() => onOpenChange(false)}
          />
        );

      case "color":
        return (
          <DoctorVariant
            onSubmit={onSubmit}
            defaultValues={defaultValues as Partial<DoctorFormData>}
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
