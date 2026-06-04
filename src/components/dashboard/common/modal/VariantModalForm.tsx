/* eslint-disable @typescript-eslint/no-explicit-any */
// ─── Sub-forms ────────────────────────────────────────────────────────────────

import {
  CategoryFormData,
  categorySchema,
  ColorFormData,
  colorSchema,
  DeliveryMethodFormData,
  deliveryMethodSchema,
  ProductFormData,
  productSchema,
} from "@/src/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { ICategory, IColor } from "@/src/interface/dashboard/dashboard";

import { Upload, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type VariantProps<T> = {
  onSubmit: (data: T, defaultValues?: Partial<T>) => Promise<void>;
  defaultValues?: Partial<T>;
  isLoading?: boolean;
  mode?: "create" | "edit";
  onCancel: () => void;
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

export function VariantBlock({
  vIdx,
  control,
  register,
  watch,
  setValue,
  errors,
  colors,
  imagePreviews, // Local new image previews
  existingImages,
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
  imagePreviews: string[]; // New images
  existingImages: string[];
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    fields: stockFields,
    append: appendStock,
    remove: removeStock,
  } = useFieldArray({ control, name: `variant.${vIdx}.stock` });

  const selectedImageIndex = watch(`variant.${vIdx}.imageIndex`);

  // Combine all images: existing + new
  const allImages = [...(existingImages || []), ...imagePreviews];
  const imageLabel = (index: number) => {
    if (index < existingImages.length) {
      return `Existing Image ${index + 1}`;
    } else {
      return `New Image ${index - existingImages.length + 1}`;
    }
  };

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

      {/* IMAGE SELECTION - SELECT INPUT */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300 text-xs">
          Product Image
        </Label>
        {allImages.length > 0 ? (
          <Select
            value={
              selectedImageIndex !== undefined ? String(selectedImageIndex) : ""
            }
            onValueChange={(v) =>
              setValue(`variant.${vIdx}.imageIndex`, parseInt(v))
            }
          >
            <SelectTrigger className="h-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm">
              <SelectValue placeholder="Select image" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900">
              {allImages.map((img, idx) => (
                <SelectItem key={idx} value={String(idx)}>
                  <div className="flex items-center gap-2">
                    {/* Thumbnail preview */}
                    <img
                      src={img}
                      alt={`${imageLabel(idx)}`}
                      className="w-6 h-6 rounded object-cover"
                    />
                    <span className="text-sm">{imageLabel(idx)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Upload images first to select variant image
          </p>
        )}
        {errors?.variant?.[vIdx]?.imageIndex && (
          <p className="text-xs text-red-500">
            {errors.variant[vIdx].imageIndex.message}
          </p>
        )}
      </div>

      {/* Stock rows */}
      <div className="space-y-2">
        <div className="flex flex-col">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => appendStock({})}
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

export function ProductVariant({
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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
    },
  });

  useEffect(() => {
    if (defaultValues) {
      const categoryId =
        typeof defaultValues.categoryID === "object"
          ? (defaultValues.categoryID as any)?._id
          : defaultValues.categoryID;

      reset({
        ...defaultValues,
        categoryID: categoryId,
        variant: (defaultValues?.variant &&
          defaultValues?.variant.map((v) => ({
            color: typeof v.color === "object" ? (v.color as any)?._id : "",
            imageIndex: v.imageIndex ?? 0, // ← Ensure imageIndex is set
            stock: v.stock,
          }))) || [{ color: "", imageIndex: 0, stock: [{}] }],
      });
    }

    if (defaultValues && mode === "edit") {
      if (
        defaultValues.existingImages &&
        Array.isArray(defaultValues.existingImages)
      ) {
        setExistingImages(defaultValues.existingImages);
      }
    }
  }, [defaultValues, reset, mode]);

  // Handle image uploads
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...images, ...files];

    // Limit to 10 images
    if (newFiles.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    setImages(newFiles);

    // Create previews
    const previews: string[] = [];
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === newFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });

    // Update form state with image files
    setValue("images", newFiles);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    setValue("images", newImages);
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);

    // Update the form with remaining existing images
    setValue("existingImages", updatedImages);
  };

  // variant field array
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variant" });

  const handleFormSubmit = async (form: ProductFormData) => {
    if (mode === "edit") {
      await onSubmit(form, defaultValues ?? {});
    } else {
      await onSubmit(form);
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
            className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 rounded-lg"
          />
          {errors.discountPrice && (
            <p className="text-xs text-red-500">
              {errors.discountPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Images Upload ── */}
      <div className="space-y-2">
        <Label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
          Product Images
        </Label>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              Current Images ({existingImages.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((image, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={image}
                    alt={`Existing ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <Upload size={24} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* New Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              New Images ({imagePreviews.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={preview}
                    alt={`New ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500">
          Total: {existingImages.length + imagePreviews.length}/10 images
        </p>
        {errors.images && (
          <p className="text-xs text-red-500">{errors.images.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description
        </label>
        <Textarea
          placeholder="Enter Description"
          {...register("description")}
          rows={3}
        />
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
            imagePreviews={imagePreviews} // ← PASS new images
            existingImages={existingImages} // ← PASS existing images
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
