/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { ICategory, IColor } from "@/src/interface/dashboard/dashboard";
import ModalFooter from "./ModalFooter";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const colorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

const stockSchema = z.object({
  size: z.number().min(1, "Size required"),
  quantity: z.number().min(1, "Quantity required"),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price required"),
  discountPrice: z.number().min(0, "Discount price required"),
  categoryID: z.string().min(1, "Category required"),
  sku: z.string().min(1, "SKU required"),
  variant: z
    .array(
      z.object({
        color: z.string().min(1, "Color required"),
        stock: z.array(stockSchema).min(1, "At least one size required"),
      }),
    )
    .min(1, "At least one variant required"),
});

type ProductFormData = z.infer<typeof productSchema>;

type CategoryFormData = z.infer<typeof categorySchema>;
type ColorFormData = z.infer<typeof colorSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "category" | "color" | "product";

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
  defaultValues?: unknown;

  options1?: ICategory[];
  options2?: IColor[];

  // Extensible: add more variant-specific props here as needed
};

type VariantProps<T> = {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  defaultValues?: Partial<T>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  onCancel: () => void;
};

// ─── Sub-forms ────────────────────────────────────────────────────────────────

function CategoryVariant({
  isLoading,
  onSubmit,
  defaultValues,
  mode = "create",
  onCancel,
}: VariantProps<CategoryFormData>) {
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
}: VariantProps<ColorFormData>) {
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

function VariantBlock({
  vIdx,
  control,
  register,
  watch,
  setValue,
  errors,
  colors,
  onRemove,
  canRemove,
}: {
  vIdx: number;
  control: any;
  register: any;
  watch: any;
  setValue: any;
  errors: any;
  colors: IColor[];
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    fields: stockFields,
    append: appendStock,
    remove: removeStock,
  } = useFieldArray({ control, name: `variant.${vIdx}.stock` });

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
      {/* Variant header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Variant {vIdx + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      {/* Color select */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-xs">
          Color
        </Label>
        <Select
          value={watch(`variant.${vIdx}.color`)}
          onValueChange={(v) => setValue(`variant.${vIdx}.color`, v)}
        >
          <SelectTrigger className="h-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm">
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900">
            {colors.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-200"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.variant?.[vIdx]?.color && (
          <p className="text-xs text-red-500">
            {errors.variant[vIdx].color.message}
          </p>
        )}
      </div>

      {/* Stock rows */}
      <div className="space-y-2">
        <div className="flex flex-col">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => appendStock({ size: 0, quantity: 1 })}
              className="text-xs text-blue-600 cursor-pointer hover:text-blue-700"
            >
              + Add Size
            </button>
          </div>{" "}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Label className="text-slate-700 dark:text-slate-300 text-xs">
            Size
          </Label>
          <Label className="text-slate-700 dark:text-slate-300 text-xs">
            Quantity
          </Label>
        </div>
        {stockFields.map((stockField, sIdx) => (
          <div key={stockField.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  {...register(`variant.${vIdx}.stock.${sIdx}.size`, {
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Size"
                  className="h-8 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
                {errors.variant?.[vIdx]?.stock?.[sIdx]?.size && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.variant[vIdx]?.stock?.[sIdx]?.size?.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Input
                  {...register(`variant.${vIdx}.stock.${sIdx}.quantity`, {
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Qty"
                  className="h-8 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
                {errors.variant?.[vIdx]?.stock?.[sIdx]?.quantity && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.variant[vIdx]?.stock?.[sIdx]?.quantity?.message}
                  </p>
                )}
              </div>
              {stockFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStock(sIdx)}
                  className="text-red-400 hover:text-red-500 text-xs flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductVariant({
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
  onCancel,
  categories = [],
  colors = [],
}: VariantProps<ProductFormData> & {
  categories: ICategory[];
  colors: IColor[];
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      variant: [{ color: "", stock: [{ size: 0, quantity: 1 }] }],
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues)
      reset({
        variant: [{ color: "", stock: [{ size: 0, quantity: 1 }] }],
        ...defaultValues,
      });
  }, [defaultValues]);

  // variant field array
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variant" });

  return (
    <form
      onSubmit={handleSubmit((d) => onSubmit(d as Record<string, unknown>))}
      className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1"
    >
      {/* Name */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Product Name
        </Label>
        <Input
          {...register("name")}
          placeholder="e.g. Premium Cotton T-Shirt"
          className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* SKU */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          SKU
        </Label>
        <Input
          {...register("sku")}
          placeholder="e.g. TS-BLK-001"
          className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
        />
        {errors.sku && (
          <p className="text-xs text-red-500">{errors.sku.message}</p>
        )}
      </div>

      {/* Price + Discount Price */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300 text-sm">
            Price
          </Label>
          <Input
            {...register("price", { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300 text-sm">
            Discount Price
          </Label>
          <Input
            {...register("discountPrice", { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {errors.discountPrice && (
            <p className="text-xs text-red-500">
              {errors.discountPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Category
        </Label>
        <Select
          value={watch("categoryID")}
          onValueChange={(v) => setValue("categoryID", v)}
        >
          <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900">
            {categories.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryID && (
          <p className="text-xs text-red-500">{errors.categoryID.message}</p>
        )}
      </div>

      {/* ── Variants ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
            Variants
          </Label>
          <button
            type="button"
            onClick={() =>
              appendVariant({ color: "", stock: [{ size: 0, quantity: 1 }] })
            }
            className="text-xs cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Variant
          </button>
        </div>

        {variantFields.map((variantField, vIdx) => (
          <VariantBlock
            key={variantField.id}
            vIdx={vIdx}
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            colors={colors as IColor[]}
            onRemove={() => removeVariant(vIdx)}
            canRemove={variantFields.length > 1}
          />
        ))}
      </div>

      <ModalFooter
        isLoading={isLoading}
        mode={mode}
        onCancel={onCancel}
        name="Product"
      />
    </form>
  );
}

// ─── Title map ────────────────────────────────────────────────────────────────

const defaultTitleMap: Record<Variant, Record<"create" | "edit", string>> = {
  category: { create: "Add New Category", edit: "Edit Category" },
  color: { create: "Add New Color", edit: "Edit Color" },
  product: { create: "Add New Product", edit: "Edit Product" },
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
  options1,
  options2,
}: DynamicModalProps) => {
  const title = defaultTitleMap[variant][mode];

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

      case "product":
        return (
          <ProductVariant
            onSubmit={onSubmit}
            defaultValues={defaultValues as Partial<ProductFormData>}
            isLoading={isLoading}
            mode={mode}
            onCancel={() => onOpenChange(false)}
            categories={options1 as ICategory[]}
            colors={options2 as IColor[]}
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
