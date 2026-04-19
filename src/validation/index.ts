import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const colorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

export const stockSchema = z.object({
  size: z.number().min(1, "Size required"),
  quantity: z.number().min(1, "Quantity required"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price required"),
  discountPrice: z.number().min(0, "Discount price required"),
  categoryID: z.string().min(1, "Category required"),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
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

export type ProductFormData = z.infer<typeof productSchema>;

export type CategoryFormData = z.infer<typeof categorySchema>;
export type ColorFormData = z.infer<typeof colorSchema>;
