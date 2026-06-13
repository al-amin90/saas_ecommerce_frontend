/* eslint-disable @typescript-eslint/no-explicit-any */
// ─── Sub-forms ────────────────────────────────────────────────────────────────

import {
  BannerFormData,
  bannerSchema,
  CategoryFormData,
  categorySchema,
  ColorFormData,
  colorSchema,
  DeliveryMethodFormData,
  deliveryMethodSchema,
  ProductFormData,
  productSchema,
  SizeChartFormData,
  sizeChartSchema,
} from "@/src/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ModalFooter from "./ModalFooter";
import {
  ICategory,
  IColor,
  ISizeChart,
} from "@/src/interface/dashboard/dashboard";

import { Loader, Plus, Trash2, Upload, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  IImageItem,
  IProduct,
} from "@/src/interface/dashboard/product.interface";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableImage from "../../utils/SortableImage";
import Image from "next/image";
import ImageDropzone from "../ui/ImageDropzone";
import { useGetDynamicQuery } from "@/src/redux/features/dynamic/dynamicApi";
import { useGetProductQuery } from "@/src/redux/features/product/productApi";

type VariantProps<T> = {
  onSubmit: (data: T, defaultValues?: Partial<T>) => Promise<void>;
  defaultValues?: Partial<T>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  onCancel: () => void;
  open?: boolean;
};

type BannerVariantProps = Omit<VariantProps<BannerFormData>, "onSubmit"> & {
  onSubmit: (
    data: FormData,
    defaultValues?: Partial<BannerFormData>,
  ) => Promise<void>;
};

export function CategoryVariant({
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
    console.log("defaultValues", defaultValues);
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
      onSubmit={handleSubmit((d) => onSubmit({ ...d } as CategoryFormData))}
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

export function ColorVariant({
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
      onSubmit={handleSubmit((d) => onSubmit(d as ColorFormData))}
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
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
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

export function SizeChartVariant({
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
  onCancel,
}: VariantProps<SizeChartFormData>) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<SizeChartFormData>({
    resolver: zodResolver(sizeChartSchema),
    defaultValues: {
      targetGroup: "unisex",
      rows: [{ size: "0" }],
      ...defaultValues,
    },
  });

  console.log("errors", errors);

  console.log("defaultValues", defaultValues);

  useEffect(() => {
    reset({ targetGroup: "unisex", rows: [{ size: "0" }], ...defaultValues });
  }, [defaultValues]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  return (
    <form
      onSubmit={handleSubmit((d) => onSubmit(d as SizeChartFormData))}
      className="space-y-4 py-2"
    >
      {/* Chart Name */}
      <div className="space-y-1">
        <Label className="text-sm text-slate-600 dark:text-slate-400">
          Chart Name *
        </Label>
        <Input
          {...register("chartName")}
          placeholder="e.g. EU Kids Standard"
          className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
        />
        {errors.chartName && (
          <p className="text-xs text-red-500">{errors.chartName.message}</p>
        )}
      </div>

      {/* Brand + Region */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-sm text-slate-600 dark:text-slate-400">
            Brand
          </Label>
          <Input
            {...register("brand")}
            placeholder="Nike, Adidas..."
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
        </div>
        {/* Target Group */}
        <div className="space-y-1">
          <Label className="text-sm text-slate-600 dark:text-slate-400">
            Target Group
          </Label>
          <Select
            value={watch("targetGroup")}
            onValueChange={(v) =>
              setValue("targetGroup", v as SizeChartFormData["targetGroup"])
            }
          >
            <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900">
              {["kids", "men", "women", "unisex"].map((g) => (
                <SelectItem key={g} value={g} className="capitalize">
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
            Chart Rows
          </Label>
          <button
            type="button"
            onClick={() => append({ size: "0" })}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Row
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-6 gap-1.5 px-1">
          {["Size*", "Inner", "Feet", "Age", "Note", ""].map((h) => (
            <p key={h} className="text-xs text-slate-400 font-medium">
              {h}
            </p>
          ))}
        </div>

        {/* Row inputs */}
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="grid grid-cols-6 gap-1.5 items-center"
            >
              <Input
                {...register(`rows.${idx}.size`)}
                placeholder="38"
                className="h-8 w-full text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
              />
              <Input
                {...register(`rows.${idx}.innerLength`)}
                step="0.1"
                placeholder="24.0"
                className="h-8 w-full text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
              />
              <Input
                {...register(`rows.${idx}.feetLength`)}
                step="0.1"
                placeholder="23.5"
                className="h-8 w-full text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
              />
              <Input
                {...register(`rows.${idx}.ageRange`)}
                placeholder="12-15m"
                className="h-8 w-full text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
              />
              <Input
                {...register(`rows.${idx}.note`)}
                placeholder="..."
                className="h-8 w-full text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                disabled={fields.length === 1}
                className="flex justify-center text-red-400 hover:text-red-600 disabled:opacity-20"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {errors.rows && (
          <p className="text-xs text-red-500">{errors.rows.message}</p>
        )}
      </div>

      <ModalFooter
        isLoading={isLoading}
        mode={mode}
        onCancel={onCancel}
        name="Chart"
      />
    </form>
  );
}

export function VariantBlock({
  vIdx,
  control,
  register,
  watch,
  setValue,
  errors,
  colors,
  imageItems,
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
  imageItems: IImageItem[];
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    fields: stockFields,
    append: appendStock,
    remove: removeStock,
  } = useFieldArray({ control, name: `variant.${vIdx}.stock` });

  const selectedImageIndex = watch(`variant.${vIdx}.imageIndex`);

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

      <div className="grid grid-cols-2 gap-4">
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
                <SelectItem key={c._id} value={c._id as string}>
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

        {/* Image selection */}
        <div className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300 text-xs">
            Variant Image
          </Label>

          {imageItems.length > 0 ? (
            <>
              <Select
                value={
                  selectedImageIndex !== undefined
                    ? String(selectedImageIndex)
                    : ""
                }
                onValueChange={(v) =>
                  setValue(`variant.${vIdx}.imageIndex`, parseInt(v))
                }
              >
                <SelectTrigger className="h-9 w-fit bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                  <SelectValue placeholder="Select image" />
                </SelectTrigger>

                <SelectContent className="bg-white  dark:bg-slate-900">
                  {imageItems.map((img, idx) => (
                    <SelectItem key={img.id} value={String(idx)}>
                      <div className="flex  items-center gap-2">
                        <Image
                          src={img.preview}
                          alt={`Photo ${idx + 1}`}
                          height={28}
                          width={28}
                          className="rounded-md object-cover shrink-0 border border-slate-200"
                        />
                        <div className="flex gap-3 items-center">
                          <span className="text-sm font-medium">
                            {idx === 0 ? "Main Photo" : `Photo ${idx + 1}`}
                          </span>
                          <span
                            className={`text-xs ${
                              img.type === "existing"
                                ? "text-slate-400"
                                : "text-green-600"
                            }`}
                          >
                            {img.type === "existing" ? "Saved" : "New"}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <div className="h-9 flex items-center px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <p className="text-xs text-slate-400 italic">
                Upload images first
              </p>
            </div>
          )}

          {errors?.variant?.[vIdx]?.imageIndex && (
            <p className="text-xs text-red-500">
              {errors.variant[vIdx].imageIndex.message}
            </p>
          )}
        </div>
      </div>

      {/* Stock rows */}
      <div className="space-y-2">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => appendStock({ size: 0, quantity: 0 })}
            className="text-xs text-blue-600 cursor-pointer hover:text-blue-700"
          >
            + Add Size
          </button>
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
          <div key={stockField.id} className="flex items-center gap-2">
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
                className="text-red-400 hover:text-red-500 text-xs shrink-0 p-1"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductVariant({
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
  onCancel,
  categories = [],
  colors = [],
  sizeCharts = [],
  open,
}: VariantProps<ProductFormData> & {
  categories: ICategory[];
  colors: IColor[];
  sizeCharts: ISizeChart[];
}) {
  const [images, setImages] = useState<IImageItem[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

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
      ...defaultValues,
      categoryID:
        typeof defaultValues?.categoryID === "object"
          ? (defaultValues.categoryID as any)?._id
          : defaultValues?.categoryID,
      sizeChartId:
        typeof defaultValues?.sizeChartId === "object"
          ? (defaultValues.sizeChartId as any)?._id
          : defaultValues?.sizeChartId,
      variant: defaultValues?.variant?.map((v) => ({
        color: typeof v.color === "object" ? (v.color as any)?._id : "",
        imageIndex: v.imageIndex ?? 0,
        stock: v.stock,
      })) || [{ color: "", imageIndex: 0, stock: [{}] }],
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && Array.isArray(defaultValues?.existingImages)) {
      setImages(
        defaultValues.existingImages.map((url: string, i: number) => ({
          id: `existing-${i}-${url}`,
          type: "existing" as const,
          url,
          preview: url,
        })),
      );
    } else {
      setImages([]); // create mode এ reset
    }
  }, [open, defaultValues, mode]);

  // categories আর sizeCharts load হলে re-trigger করো
  useEffect(() => {
    if (!defaultValues || mode !== "edit") return;

    const categoryId =
      typeof defaultValues.categoryID === "object"
        ? (defaultValues.categoryID as any)?._id
        : defaultValues.categoryID;

    const sizeChartId =
      typeof defaultValues.sizeChartId === "object"
        ? (defaultValues.sizeChartId as any)?._id
        : defaultValues.sizeChartId;

    // categories load হলে set করো
    if (categories.length > 0 && categoryId) {
      setValue("categoryID", categoryId, { shouldValidate: false });
    }

    // sizeCharts load হলে set করো
    if (sizeCharts.length > 0 && sizeChartId) {
      setValue("sizeChartId", sizeChartId, { shouldValidate: false });
    }
  }, [categories, sizeCharts, defaultValues, mode, setValue, open]);

  // Handle image uploads
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems: IImageItem[] = files.map((file) => ({
      id: `new-${Date.now()}-${file.name}`,
      type: "new",
      url: "",
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newItems].slice(0, 10));
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // variant field array
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variant" });

  const handleFormSubmit = async (form: ProductFormData) => {
    // images state থেকে collect করো
    const existingUrls = images
      .filter((img) => img.type === "existing")
      .map((img) => img.url);

    const newFiles = images
      .filter((img) => img.type === "new")
      .map((img) => img.file!);

    // form এর ভেতরেই দাও — আলাদা argument না
    const enrichedForm: ProductFormData = {
      ...form,
      existingImages: existingUrls,
      images: newFiles,
    };

    if (mode === "edit") {
      await onSubmit(enrichedForm, defaultValues ?? {});
    } else {
      await onSubmit(enrichedForm);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // 5px move করলে drag শুরু হবে
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((prev) => {
        const oldIndex = prev.findIndex((img) => img.id === active.id);
        const newIndex = prev.findIndex((img) => img.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 py-2 pr-1"
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
            placeholder="00"
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300 text-sm">
            Original Price
          </Label>
          <Input
            {...register("originalPrice", { valueAsNumber: true })}
            type="number"
            placeholder="00"
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {errors.originalPrice && (
            <p className="text-xs text-red-500">
              {errors.originalPrice.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300 text-sm">
            Category
          </Label>
          <Select
            value={watch("categoryID") || ""} // ← Ensure it always has a string value
            onValueChange={(v) => setValue("categoryID", v)}
          >
            <SelectTrigger className="h-9 w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900">
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id as string}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryID && (
            <p className="text-xs text-red-500">{errors.categoryID.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300 text-sm">
            Discount Price
          </Label>
          <Input
            {...register("discountPrice", { valueAsNumber: true })}
            type="number"
            placeholder="00"
            defaultValue={0}
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {errors.discountPrice && (
            <p className="text-xs text-red-500">
              {errors.discountPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* Shoe size */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Select Shoe Chart
        </Label>
        <Select
          value={watch("sizeChartId") || ""} // ← Ensure it always has a string value
          onValueChange={(v) => setValue("sizeChartId", v)}
        >
          <SelectTrigger className="h-9 w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
            <SelectValue placeholder="Select size chart" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900">
            {sizeCharts.map((c) => (
              <SelectItem key={c._id} value={c._id as string}>
                {c.chartName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sizeChartId && (
          <p className="text-xs text-red-500">{errors.sizeChartId.message}</p>
        )}
      </div>

      {/* ── Images Upload ── */}
      {/* ── Images Upload ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
            Product Images
          </Label>
        </div>

        <ImageDropzone
          value={images}
          onChange={setImages}
          maxFiles={10}
          maxSize={5 * 1024 * 1024}
        />

        {errors.images && (
          <p className="text-xs text-red-500">{errors.images.message}</p>
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
              appendVariant({
                color: "",
                imageIndex: 0, // ← Initialize with 0
                stock: [{ size: 0, quantity: 0 }],
              })
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
            imageItems={images}
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
      ></ModalFooter>
    </form>
  );
}

export type DeliveryMethodVariantProps = {
  onSubmit: (
    data: DeliveryMethodFormData,
    defaultValues?: Partial<DeliveryMethodFormData>,
  ) => Promise<void>;
  defaultValues?: Partial<DeliveryMethodFormData>;
  isLoading?: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
};

export function DeliveryMethodVariant({
  onSubmit,
  defaultValues,
  isLoading,
  mode,
  onCancel,
}: DeliveryMethodVariantProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(deliveryMethodSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? "PATHAO",
      accountPhone: defaultValues?.accountPhone ?? "",
      clientId: defaultValues?.clientId ?? "",
      clientSecret: defaultValues?.clientSecret ?? "",
      clientEmail: defaultValues?.clientEmail ?? "",
      clientPassword: defaultValues?.clientPassword ?? "",
      clientStoreId: defaultValues?.clientStoreId ?? "",
      merchantId: defaultValues?.merchantId ?? "",
      defaultShippingNote: defaultValues?.defaultShippingNote ?? "",
      isActive: defaultValues?.isActive ?? false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset(defaultValues);
    }
  }, [mode, defaultValues, reset]);

  const loading = isLoading || isSubmitting;
  const isActive = watch("isActive");

  const submitForm = handleSubmit((data) => onSubmit(data, defaultValues));

  return (
    <form onSubmit={submitForm} className="space-y-4 ">
      {/* Remove the overflow-y-auto and pr-4 from here */}
      {/* Delivery Method Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Delivery Method Name
        </label>
        <Input
          placeholder="e.g., Pathao Express"
          {...register("name")}
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.name?.message)}
          </p>
        )}
      </div>

      {/* Delivery Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Delivery Type
        </label>
        <Select
          onValueChange={(value) =>
            setValue(
              "type",
              value as "PATHAO" | "REDX" | "STEDFAST" | "CARRYBEE" | "OTHERS",
            )
          }
          defaultValue={watch("type")}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select delivery type" />
          </SelectTrigger>
          <SelectContent>
            {["PATHAO", "REDX", "STEDFAST", "CARRYBEE", "OTHERS"].map(
              (type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.type?.message)}
          </p>
        )}
      </div>

      {/* Account Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Account Phone Number
        </label>
        <Input
          placeholder="+880123456789"
          {...register("accountPhone")}
          disabled={loading}
        />
        {errors.accountPhone && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.accountPhone?.message)}
          </p>
        )}
      </div>

      {/* Client ID */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Client ID
        </label>
        <Input
          placeholder="Enter client ID"
          {...register("clientId")}
          disabled={loading}
        />
        {errors.clientId && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.clientId?.message)}
          </p>
        )}
      </div>

      {/* Client Secret */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Client Secret
        </label>
        <Input
          placeholder="Enter client secret"
          type="password"
          {...register("clientSecret")}
          disabled={loading}
        />
        {errors.clientSecret && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.clientSecret?.message)}
          </p>
        )}
      </div>

      {/* Client Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Client Email
        </label>
        <Input
          placeholder="admin@delivery.com"
          type="email"
          {...register("clientEmail")}
          disabled={loading}
        />
        {errors.clientEmail && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.clientEmail?.message)}
          </p>
        )}
      </div>

      {/* Client Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Client Password
        </label>
        <Input
          placeholder="Enter client password"
          type="password"
          {...register("clientPassword")}
          disabled={loading}
        />
        {errors.clientPassword && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.clientPassword?.message)}
          </p>
        )}
      </div>

      {/* Client Store ID */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Client Store ID
        </label>
        <Input
          placeholder="Enter store ID"
          {...register("clientStoreId")}
          disabled={loading}
        />
        {errors.clientStoreId && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.clientStoreId?.message)}
          </p>
        )}
      </div>

      {/* merchantId ID */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Merchant ID
        </label>
        <Input
          placeholder="Enter merchant ID"
          {...register("merchantId")}
          disabled={loading}
        />
        {errors.merchantId && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors.merchantId?.message)}
          </p>
        )}
      </div>

      {/* Default Shipping Note */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Default Shipping Note
        </label>
        <Textarea
          placeholder="Enter default shipping note"
          {...register("defaultShippingNote")}
          disabled={loading}
          rows={3}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          This note will be added to deliveries using this method.
        </p>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Active
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            If you want to activate this delivery method, turn this on.
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(value) => setValue("isActive", value)}
          disabled={loading}
        />
      </div>

      <ModalFooter
        isLoading={isLoading}
        mode={mode}
        onCancel={onCancel}
        name="Delivery Method"
      ></ModalFooter>
      {/* Footer */}
    </form>
  );
}

// Banner Variant
export function BannerVariant({
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
  onCancel,
  open,
}: BannerVariantProps) {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch products for product selection
  const { data: productsData } = useGetProductQuery({
    url: "/product",
    params: { limit: 100 },
  });

  const products = productsData?.data ?? [];
  console.log("products", products);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      subTitle: defaultValues?.subTitle || "",
      colorHex: defaultValues?.colorHex || "#ffffff",
      description: defaultValues?.description || "",
      productID:
        typeof defaultValues?.productID === "object"
          ? (defaultValues.productID as any)?._id
          : defaultValues?.productID || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      setImagePreview("");
      setImageFile(null);
      return;
    }

    if (mode === "edit" && defaultValues?.image) {
      setImagePreview(defaultValues.image as string);
    }
  }, [open, mode, defaultValues, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (form: BannerFormData) => {
    const formData = new FormData();

    // Append all text fields
    formData.append("title", form.title);
    if (form.subTitle) formData.append("subTitle", form.subTitle);
    if (form.colorHex) formData.append("colorHex", form.colorHex);
    if (form.description) formData.append("description", form.description);
    if (form.productID) formData.append("productID", form.productID);
    if (form.isActive !== undefined)
      formData.append("isActive", String(form.isActive));

    // Append image file if new one selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onSubmit(formData, defaultValues);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 py-2 pr-1"
    >
      {/* Title */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Banner Title <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("title")}
          placeholder="e.g. Summer Sale 2024"
          className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Subtitle */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Subtitle
        </Label>
        <Input
          {...register("subTitle")}
          placeholder="e.g. Up to 50% off"
          className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
        />
        {errors.subTitle && (
          <p className="text-xs text-red-500">{errors.subTitle.message}</p>
        )}
      </div>

      {/* Color Hex */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Text Color
        </Label>
        <div className="flex gap-2">
          <Input
            {...register("colorHex")}
            placeholder="#ffffff"
            className="h-9 flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg font-mono"
          />
          <input
            type="color"
            value={watch("colorHex") || "#ffffff"}
            onChange={(e) => setValue("colorHex", e.target.value)}
            className="h-9 w-12 rounded-md border border-slate-200 dark:border-slate-700 cursor-pointer"
          />
        </div>
        {errors.colorHex && (
          <p className="text-xs text-red-500">{errors.colorHex.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Banner Image
        </Label>

        <div className="flex items-center gap-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-24 h-24 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
              <Image
                src={imagePreview}
                alt="Banner preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Upload Button */}
          <div className="flex-1">
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Upload className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {imagePreview ? "Change Image" : "Upload Image"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-slate-500 mt-1">
              Recommended size: 1920x600px. Max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Description
        </Label>
        <textarea
          {...register("description")}
          placeholder="Detailed description of the banner offer..."
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-sm">
          Link to Product (Optional)
        </Label>

        <Controller
          name="productID"
          control={control}
          render={({ field }) => (
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <SelectTrigger className="h-9 w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 max-h-64">
                <SelectItem value="none">None (No product link)</SelectItem>
                {products.map((product: IProduct) => (
                  <SelectItem
                    key={product._id ?? product.name}
                    value={product._id ?? ""}
                  >
                    <div className="flex items-center gap-2">
                      {product?.images?.[0] && (
                        <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span>{product.name}</span>
                      <span className="text-slate-400">- ${product.price}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <p className="text-xs text-slate-500">
          Select a product to link this banner to
        </p>
      </div>
      {/* Active Status (Only for edit mode) */}
      {mode === "edit" && (
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300 text-sm">
            Active Status
          </Label>
          <Switch
            checked={watch("isActive")}
            onCheckedChange={(checked) => setValue("isActive", checked)}
          />
        </div>
      )}

      {/* Modal Footer */}
      <ModalFooter
        isLoading={isLoading}
        mode={mode}
        onCancel={onCancel}
        name="Banner"
      />
    </form>
  );
}
