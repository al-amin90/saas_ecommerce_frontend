"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePostDynamicMutation } from "@/src/redux/features/dynamic/dynamicApi";
import Image from "next/image";
import { IColor } from "@/src/interface/dashboard/dashboard";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ITrackedOrder {
  _id: string;
  orderNumber: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  totalPrice: number;
  createdAt: string;
  guestInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: {
    productId: {
      _id: string;
      name: string;
      images: string[];
      price: number;
    };
    quantity: number;
    price: number;
    selectedSize: string;
    colorId: IColor;
  }[];
}

// ── Schema ────────────────────────────────────────────────────────────────────

const trackSchema = z.object({
  email: z.string().email("Invalid email"),
  orderId: z.string().min(1, "Order ID is required"),
});

type TrackForm = z.infer<typeof trackSchema>;

// ── Status config ─────────────────────────────────────────────────────────────

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const orderSteps = ["pending", "processing", "shipped", "delivered"];

// ─────────────────────────────────────────────────────────────────────────────

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<ITrackedOrder | null>(null);
  const [fetchOrder, { isLoading }] = usePostDynamicMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackForm>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      orderId: searchParams.get("orderId") ?? "",
    },
  });

  const onTrack = async (form: TrackForm) => {
    try {
      const res = await fetchOrder({
        url: "order/guest",
        data: { email: form.email, orderId: form.orderId },
      }).unwrap();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOrder((res as any)?.data);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      import("sonner").then(({ toast }) =>
        toast.error(error?.data?.message || "Order not found"),
      );
    }
  };

  const currentStatusIndex = order ? orderSteps.indexOf(order.orderStatus) : -1;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-slate-800">Track Your Order</h1>

        {/* Search form */}
        <form
          onSubmit={handleSubmit(onTrack)}
          className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
        >
          <div className="space-y-1">
            <Label className="text-sm text-slate-600">Email Address</Label>
            <Input
              {...register("email")}
              placeholder="customer@example.com"
              className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:border-black"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-sm text-slate-600">Order ID</Label>
            <Input
              {...register("orderId")}
              placeholder="Enter your order ID"
              className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:border-black font-mono"
            />
            {errors.orderId && (
              <p className="text-xs text-red-500">{errors.orderId.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-semibold gap-2"
          >
            <Search className="h-4 w-4" />
            {isLoading ? "Searching..." : "Track Order"}
          </Button>
        </form>

        {/* Order result */}
        {order && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-slate-400">Order Number</p>
                  <p className="font-mono font-semibold text-slate-800 text-sm">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Order status badge */}
                  {(() => {
                    const cfg = statusConfig[order.orderStatus];
                    const Icon = cfg.icon;
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </span>
                    );
                  })()}
                  {/* Payment status badge */}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      order.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.paymentStatus === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus === "paid"
                      ? "Paid"
                      : order.paymentStatus === "failed"
                        ? "Failed"
                        : "Pending Payment"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Progress bar — cancelled হলে দেখাবে না */}
              {order.orderStatus !== "cancelled" && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    {orderSteps.map((step, i) => {
                      const cfg =
                        statusConfig[step as keyof typeof statusConfig];
                      const Icon = cfg.icon;
                      const done = i <= currentStatusIndex;
                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center gap-1 flex-1"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              done
                                ? "bg-black text-white"
                                : "bg-slate-100 text-slate-300"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              done ? "text-slate-800" : "text-slate-300"
                            }`}
                          >
                            {cfg.label}
                          </span>
                          {/* connector line */}
                          {i < orderSteps.length - 1 && (
                            <div
                              className={`absolute h-0.5 w-full ${
                                i < currentStatusIndex
                                  ? "bg-black"
                                  : "bg-slate-100"
                              }`}
                              style={{ display: "none" }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Line between steps */}
                  <div className="relative flex items-center mt-1">
                    <div className="w-full h-1 bg-slate-100 rounded-full">
                      <div
                        className="h-1 bg-black rounded-full transition-all"
                        style={{
                          width: `${
                            currentStatusIndex < 0
                              ? 0
                              : (currentStatusIndex / (orderSteps.length - 1)) *
                                100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Items
              </h3>
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  {item.productId?.images?.[0] ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.productId?.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Size: {item.selectedSize} · Color: {item.colorId.name} ·
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 flex-shrink-0">
                    Tk {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-800">
                <span>Total</span>
                <span>Tk {order.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Delivery Address
              </h3>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  {order.guestInfo?.fullName}
                </p>
                <p>{order.guestInfo?.phone}</p>
                <p>{order.guestInfo?.address}</p>
                <p>
                  {order.guestInfo?.city}, {order.guestInfo?.postalCode}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
