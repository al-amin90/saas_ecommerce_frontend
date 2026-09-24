"use client";

import { useState } from "react";
import { Trash2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateOrderMutation } from "@/src/redux/features/order/orderApi";
import { useGetDynamicQuery } from "@/src/redux/features/dynamic/dynamicApi";
import {
  ORDER_STATUSES_LIST,
  PAYMENT_STATUSES_LIST,
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  OrderStatus,
  PaymentStatus,
} from "@/src/constants/order.constants";

// ── Types ─────────────────────────────────────────────────────────────────────

interface IStock {
  size: number;
  quantity: number;
  _id?: string;
}

interface IVariant {
  _id?: string;
  imageIndex?: number;
  color: string | { _id?: string; name?: string; color?: string };
  stock: IStock[];
}

interface IProduct {
  _id?: string;
  name: string;
  sku?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  variant: IVariant[];
}

interface IEditItem {
  productId: string;
  colorId: string;
  selectedSize: string;
  quantity: number;
  price: number;
  image: string;
}

interface IOrderItem {
  _id?: string;
  image?: string;
  quantity: number;
  price: number;
  selectedSize: string;
  productId?: { _id: string; name: string; price?: number; images?: string[] };
  colorId?: { _id: string; name: string; color: string };
}

interface IOrderRow {
  _id: string;
  orderNumber: string;
  orderType: "manual" | "online";
  guestCheckout?: boolean;
  guestEmail?: string;
  guestInfo?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  userId?: { name: string; email: string } | null;
  items: IOrderItem[];
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const toHex = (color: IVariant["color"]): string =>
  typeof color === "string" ? "" : color?.color ?? "";
const toColorName = (color: IVariant["color"]): string =>
  typeof color === "string" ? "" : color?.name ?? "";
const toColorId = (color: IVariant["color"]): string =>
  typeof color === "string" ? color : color?._id ?? "";

const getProductImage = (product: IProduct, variant?: IVariant): string =>
  variant?.imageIndex !== undefined
    ? product.images?.[variant.imageIndex!] ?? product.images?.[0] ?? ""
    : product.images?.[0] ?? "";

const getEffectivePrice = (product: IProduct): number =>
  product.discountPrice && product.price > product.discountPrice
    ? Math.round(product.price - product.discountPrice)
    : product.price;

// ── Component ─────────────────────────────────────────────────────────────────

export default function OrderEditModal({
  order,
  open,
  onOpenChange,
}: {
  order: IOrderRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [updateOrder, { isLoading: isSaving }] = useUpdateOrderMutation();

  const [customer, setCustomer] = useState(() => ({
    fullName: order?.guestInfo?.fullName ?? order?.userId?.name ?? "",
    phone: order?.guestInfo?.phone ?? "",
    address: order?.guestInfo?.address ?? "",
    city: order?.guestInfo?.city ?? "",
    postalCode: order?.guestInfo?.postalCode ?? "",
    email: order?.guestEmail ?? order?.userId?.email ?? "",
  }));

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    order?.orderStatus ?? "pending",
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order?.paymentStatus ?? "pending",
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    order?.paymentMethod ?? "cash",
  );

  const [items, setItems] = useState<IEditItem[]>(
    order?.items.map((i) => ({
      productId: i.productId?._id ?? "",
      colorId: i.colorId?._id ?? "",
      selectedSize: i.selectedSize,
      quantity: i.quantity,
      price: i.price,
      image: i.image ?? i.productId?.images?.[0] ?? "",
    })) ?? [],
  );

  // ── Products (admin picker) ────────────────────────────────────────────────
  const { data: productData } = useGetDynamicQuery(
    { url: "/product", params: { limit: 500 } },
    { skip: !open },
  );
  const products: IProduct[] = productData?.data ?? [];

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const productOptions = [...products];
  // Ensure current items always render in the select even if not in the page
  items.forEach((it) => {
    if (!productOptions.some((p) => p._id === it.productId)) {
      const orderItem = order?.items.find((oi) => oi.productId?._id === it.productId);
      if (orderItem?.productId) {
        productOptions.push({
          _id: orderItem.productId._id,
          name: orderItem.productId.name,
          price: orderItem.productId.price ?? it.price,
          images: orderItem.productId.images,
          variant: [],
        });
      }
    }
  });

  const updateItem = (idx: number, patch: Partial<IEditItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const handleProductChange = (idx: number, productId: string) => {
    const product = products.find((p) => p._id === productId);
    updateItem(idx, {
      productId,
      colorId: "",
      selectedSize: "",
      price: product ? getEffectivePrice(product) : 0,
      image: product ? getProductImage(product) : "",
    });
  };

  const handleColorChange = (idx: number, productId: string, colorId: string) => {
    const product = products.find((p) => p._id === productId);
    const variant = product?.variant.find((v) => toColorId(v.color) === colorId);
    updateItem(idx, {
      colorId,
      selectedSize: "",
      image: product ? getProductImage(product, variant) : "",
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { productId: "", colorId: "", selectedSize: "", quantity: 1, price: 0, image: "" },
    ]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error("At least one item is required");
      return;
    }

    const invalid = items.find(
      (i) => !i.productId || !i.colorId || !i.selectedSize,
    );
    if (invalid) {
      toast.error("Complete every item (product, color, size) before saving");
      return;
    }

    try {
      await updateOrder({
        orderId: order?._id ?? "",
        data: {
          guestEmail: customer.email,
          guestInfo: {
            fullName: customer.fullName,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            postalCode: customer.postalCode,
          },
          items: items.map((i) => ({
            productId: i.productId,
            colorId: i.colorId,
            selectedSize: i.selectedSize,
            quantity: i.quantity,
            price: i.price,
            image: i.image,
          })),
          totalPrice,
          paymentMethod: paymentMethod as "cod" | "card",
          orderStatus,
          paymentStatus,
        },
      }).unwrap();

      toast.success("Order updated successfully");
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? "Failed to update order");
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white text-sm font-mono flex items-center gap-2">
            <span>Edit {order.orderNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* ── Customer ── */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Customer Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs text-slate-500">Full Name</span>
                <Input
                  value={customer.fullName}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, fullName: e.target.value }))
                  }
                  className="h-9 text-sm bg-white dark:bg-slate-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-slate-500">Phone</span>
                <Input
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, phone: e.target.value }))
                  }
                  className="h-9 text-sm bg-white dark:bg-slate-900"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs text-slate-500">Address</span>
                <Input
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, address: e.target.value }))
                  }
                  className="h-9 text-sm bg-white dark:bg-slate-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-slate-500">City</span>
                <Input
                  value={customer.city}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, city: e.target.value }))
                  }
                  className="h-9 text-sm bg-white dark:bg-slate-900"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-slate-500">Postal Code</span>
                <Input
                  value={customer.postalCode}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, postalCode: e.target.value }))
                  }
                  className="h-9 text-sm bg-white dark:bg-slate-900"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs text-slate-500">Email</span>
                <Input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, email: e.target.value }))
                  }
                  className="h-9 text-sm bg-white dark:bg-slate-900"
                />
              </label>
            </div>
          </div>

          {/* ── Items ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Items
              </p>
              <Button
                type="button"
                onClick={addItem}
                variant="outline"
                className="h-8 px-3 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => {
                const product = products.find((p) => p._id === item.productId);
                const variants = product?.variant ?? [];
                const sizes = variants.find(
                  (v) => toColorId(v.color) === item.colorId,
                )?.stock;

                return (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Select
                          value={item.productId || undefined}
                          onValueChange={(v) => handleProductChange(idx, v)}
                        >
                          <SelectTrigger className="h-9 text-sm w-full bg-white dark:bg-slate-900">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-900">
                            {productOptions.map((p) => (
                              <SelectItem key={p._id} value={p._id ?? ""} className="text-sm">
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {/* Color */}
                      <Select
                        value={item.colorId || undefined}
                        onValueChange={(v) =>
                          handleColorChange(idx, item.productId, v)
                        }
                      >
                        <SelectTrigger className="h-9 text-sm bg-white dark:bg-slate-900">
                          <SelectValue placeholder="Color" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900">
                          {variants.map((v) => (
                            <SelectItem
                              key={toColorId(v.color)}
                              value={toColorId(v.color)}
                              className="text-sm"
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full border border-slate-300"
                                  style={{ backgroundColor: toHex(v.color) }}
                                />
                                {toColorName(v.color)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Size */}
                      <Select
                        value={item.selectedSize || undefined}
                        onValueChange={(v) => updateItem(idx, { selectedSize: v })}
                      >
                        <SelectTrigger className="h-9 text-sm bg-white dark:bg-slate-900">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900">
                          {(sizes ?? []).map((s) => (
                            <SelectItem
                              key={s.size}
                              value={String(s.size)}
                              className="text-sm"
                              disabled={s.quantity === 0}
                            >
                              {s.size}
                              {s.quantity === 0 ? " (out of stock)" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Qty */}
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(idx, {
                            quantity: Math.max(1, Math.floor(Number(e.target.value) || 1)),
                          })
                        }
                        className="h-9 text-sm bg-white dark:bg-slate-900"
                      />

                      {/* Price */}
                      <Input
                        type="number"
                        min={0}
                        value={item.price}
                        onChange={(e) =>
                          updateItem(idx, {
                            price: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="h-9 text-sm bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Total ── */}
          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Total
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-white">
              ৳{totalPrice.toLocaleString()}
            </span>
          </div>

          {/* ── Status & Payment ── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Order Status
              </p>
              <Select
                value={orderStatus}
                onValueChange={(v) => setOrderStatus(v as OrderStatus)}
              >
                <SelectTrigger className="h-9 bg-white dark:bg-slate-900 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  {ORDER_STATUSES_LIST.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize text-sm">
                      {ORDER_STATUS_CONFIG[s]?.label || s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Payment Status
              </p>
              <Select
                value={paymentStatus}
                onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}
              >
                <SelectTrigger className="h-9 bg-white dark:bg-slate-900 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  {PAYMENT_STATUSES_LIST.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize text-sm">
                      {PAYMENT_STATUS_CONFIG[s]?.label || s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Payment Method
              </p>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-9 bg-white dark:bg-slate-900 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  <SelectItem value="cod" className="capitalize text-sm">
                    Cash on Delivery
                  </SelectItem>
                  <SelectItem value="card" className="capitalize text-sm">
                    Card
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-sm gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-9 px-4 text-sm gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}