/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ICategory, IColor } from "@/src/interface/dashboard/dashboard";
import {
  CategoryVariant,
  ColorVariant,
  ProductVariant,
  DeliveryMethodVariant,
  SizeChartVariant,
} from "./VariantModalForm";
import {
  CategoryFormData,
  ColorFormData,
  ProductFormData,
  DeliveryMethodFormData,
  SizeChartFormData,
} from "@/src/validation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant =
  | "category"
  | "color"
  | "product"
  | "deliveryMethod"
  | "sizeChart";

type DynamicModalProps<
  T = Record<string, unknown>,
  O = Record<string, unknown>,
  P = Record<string, unknown>,
> = {
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
  dialogClassName?: string;

  // Pass this if you want to control open/close via button inside component
  withTrigger?: boolean;

  // Form state
  mode?: "create" | "edit";
  isLoading?: boolean;
  onSubmit: (data: T, defaultValues?: Partial<T>) => Promise<void>;
  defaultValues?: Partial<T>;

  options1?: O[];
  options2?: P[];
};

// ─── Title map ────────────────────────────────────────────────────────────────

const defaultTitleMap: Record<Variant, Record<"create" | "edit", string>> = {
  category: { create: "Add New Category", edit: "Edit Category" },
  color: { create: "Add New Color", edit: "Edit Color" },
  product: { create: "Add New Product", edit: "Edit Product" },
  deliveryMethod: {
    create: "Add New Delivery Method",
    edit: "Edit Delivery Method",
  },
  sizeChart: { create: "Create Size Chart", edit: "Edit Size Chart" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DynamicModal = <T, O, P>({
  open,
  onOpenChange,
  variant = "category",
  btnName,
  btnVariant = "default",
  hasEndIcon = true,
  btnClassName,
  dialogClassName = "sm:max-w-2xl",
  withTrigger = false,
  mode = "create",
  isLoading,
  onSubmit,
  defaultValues,
  options1,
  options2,
}: DynamicModalProps<T, O, P>) => {
  const title = defaultTitleMap[variant][mode];

  console.log("defaultValues", defaultValues);

  const renderVariant = () => {
    switch (variant) {
      case "category":
        return (
          <CategoryVariant
            onSubmit={
              onSubmit as (
                data: CategoryFormData,
                defaultValues?: Partial<CategoryFormData>,
              ) => Promise<void>
            }
            defaultValues={defaultValues as Partial<CategoryFormData>}
            mode={mode}
            onCancel={() => onOpenChange(false)}
          />
        );

      case "color":
        return (
          <ColorVariant
            onSubmit={
              onSubmit as (
                data: ColorFormData,
                defaultValues?: Partial<ColorFormData>,
              ) => Promise<void>
            }
            defaultValues={defaultValues as Partial<ColorFormData>}
            isLoading={isLoading}
            mode={mode}
            onCancel={() => onOpenChange(false)}
          />
        );

      case "product":
        return (
          <ProductVariant
            onSubmit={
              onSubmit as (
                data: ProductFormData,
                defaultValues?: Partial<ProductFormData>,
              ) => Promise<void>
            }
            defaultValues={defaultValues as Partial<ProductFormData>}
            isLoading={isLoading}
            mode={mode}
            onCancel={() => onOpenChange(false)}
            categories={options1 as ICategory[]}
            colors={options2 as IColor[]}
          />
        );

      case "deliveryMethod":
        return (
          <DeliveryMethodVariant
            onSubmit={
              onSubmit as (
                data: DeliveryMethodFormData,
                defaultValues?: Partial<DeliveryMethodFormData>,
              ) => Promise<void>
            }
            defaultValues={defaultValues}
            isLoading={isLoading}
            mode={mode}
            onCancel={() => onOpenChange(false)}
          />
        );

      case "sizeChart":
        return (
          <SizeChartVariant
            onSubmit={
              onSubmit as (
                data: SizeChartFormData,
                defaultValues?: Partial<SizeChartFormData>,
              ) => Promise<void>
            }
            defaultValues={defaultValues as Partial<SizeChartFormData>}
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
        <DialogContent
          className={`sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`}
        >
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
