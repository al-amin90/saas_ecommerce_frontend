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
  quantity: z.number(),
});

export const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price required"),
  discountPrice: z.number().optional(),
  originalPrice: z.number().optional(),
  categoryID: z.string().min(1, "Category required"),
  images: z.array(z.instanceof(File)).optional(),
  existingImages: z.array(z.string()).optional(),
  sku: z.string().min(1, "SKU required"),

  variant: z.array(
    z.object({
      color: z.string().min(1, "Color is required"),
      imageIndex: z.number().min(0, "Color Image is required"),
      stock: z.array(stockSchema),
    }),
  ),
});

export const deliveryMethodSchema = z.object({
  name: z.string().min(1, "Delivery method name is required"),
  type: z.enum(["PATHAO", "REDX", "STEDFAST", "CARRYBEE", "OTHERS"]),
  accountPhone: z.string().min(1, "Account phone number is required"),
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client secret is required"),
  clientEmail: z.string().email("Invalid email address"),
  clientPassword: z.string().min(1, "Client password is required"),
  clientStoreId: z.string().min(1, "Client store ID is required"),
  merchantId: z.string(),
  defaultShippingNote: z.string().optional(),
  isActive: z.boolean().default(true),
});

// ----------------size chart
const chartRowSchema = z.object({
  size: z.number().min(1, "Required"),
  innerLength: z.number().optional(),
  feetLength: z.number().optional(),
  ageRange: z.string().optional(),
  note: z.string().optional(),
});

export const sizeChartSchema = z.object({
  chartName: z.string().min(1, "Chart name is required"),
  brand: z.string().optional(),
  region: z.string().optional(),
  targetGroup: z.enum(["kids", "men", "women", "unisex"]),
  rows: z.array(chartRowSchema),
});

export type ProductFormData = z.infer<typeof productSchema>;

export type CategoryFormData = z.infer<typeof categorySchema>;
export type ColorFormData = z.infer<typeof colorSchema>;
export type DeliveryMethodFormData = z.infer<typeof deliveryMethodSchema>;
export type SizeChartFormData = z.infer<typeof sizeChartSchema>;
