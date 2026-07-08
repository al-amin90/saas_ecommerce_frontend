"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const trackSchema = z.object({
  email: z.string().email("Invalid email"),
  orderId: z.string().min(1, "Order ID is required"),
});

type TrackForm = z.infer<typeof trackSchema>;

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

export default function TrackOrderClient({
  initialOrderId,
}: {
  initialOrderId?: string;
}) {
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
      orderId: initialOrderId ?? "",
    },
  });

  const onTrack = async (form: TrackForm) => {
    try {
      const res = await fetchOrder({
        url: "order/guest",
        data: { email: form.email, orderId: form.orderId },
      }).unwrap();
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
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-slate-800">Track Your Order</h1>

        <form
          onSubmit={handleSubmit(onTrack)}
          className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
        >
          {/* <div className="space-y-1">
            <Label className="text-sm text-slate-600">Email Address</Label>
            <Input
              {...register("email")}
              placeholder="customer@example.com"
              className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:border-black"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div> */}

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

        {order && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-slate-400">Order Number</p>
                  <p className="font-mono font-semibold text-slate-800 text-sm">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="flex gap-2">
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
            </div>

            <div className="space-y-4 bg-white rounded-2xl border border-slate-200 p-6">
              <div className="space-y-3">
                <p className="font-semibold text-slate-800">Delivery address</p>
                <p className="text-sm text-slate-600">
                  {order.guestInfo.fullName}
                  <br />
                  {order.guestInfo.phone}
                  <br />
                  {order.guestInfo.address}, {order.guestInfo.city}
                  <br />
                  {order.guestInfo.postalCode}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-800">Order items</p>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.productId._id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 relative">
                        <Image
                          src={item.productId.images[0] ?? "/placeholder.png"}
                          alt={item.productId.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {item.productId.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-800">Order summary</p>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Total price</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
