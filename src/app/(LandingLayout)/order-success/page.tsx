"use client";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Home,
  Truck,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { useGetDynamicQuery } from "@/src/redux/features/dynamic/dynamicApi";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const id = useSearchParams().get("orderId");

  const { data: orderData, isLoading } = useGetDynamicQuery(
    {
      url: `/order/${id}`,
    },
    { skip: !id },
  );

  const order = orderData?.data;
  const orderId = order?.orderNumber || id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full space-y-4">
        {/* Warm SMS Style Success Message */}
        <div className="bg-gradient-to-r from-[#e07b1a] to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">🎉 Order Confirmed!</h2>
              <p className="text-white/90 text-sm">
                Thank you for shopping with us
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span>
                Dear {order?.guestInfo?.fullName || "Valued Customer"},
              </span>
            </p>
            <p>
              Your order has been successfully placed and is now being
              processed.
            </p>
            <p className="font-mono bg-white/10 px-3 py-1.5 rounded-lg inline-block">
              Order #: {orderId}
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-100 p-5 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-500" />
              Order Summary
            </h3>
          </div>

          {/* Order Info Grid */}
          <div className="p-5 space-y-5">
            {/* Order Status */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-1">Order Status</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {order?.orderStatus === "pending"
                    ? "⏳ Pending"
                    : order?.orderStatus}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Payment Method</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1 capitalize">
                  <CreditCard className="w-3.5 h-3.5" />
                  {order?.paymentMethod || "Cash on Delivery"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Payment Status</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {order?.paymentStatus === "pending"
                    ? "💰 Pending"
                    : order?.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Order Date</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            {order?.guestInfo && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery Address
                </p>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-slate-800">
                    {order.guestInfo.fullName}
                  </p>
                  <p className="text-slate-600">{order.guestInfo.address}</p>
                  <p className="text-slate-600">
                    {order.guestInfo.city}{" "}
                    {order.guestInfo.postalCode &&
                      `- ${order.guestInfo.postalCode}`}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {order.guestInfo.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Items Ordered
              </p>
              <div className="space-y-3">
                {order?.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-3 border-b border-slate-100 pb-3 last:border-0"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.productId?.images?.[0] && (
                        <img
                          src={item.productId.images[0]}
                          alt={item.productId.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">
                        {item.productId?.name}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                        {item.selectedSize && (
                          <span>Size: {item.selectedSize}</span>
                        )}
                        <span>Qty: {item.quantity}</span>
                        {/* <span>
                          Price: ৳{item.price || item.productId?.price}
                        </span> */}
                      </div>
                    </div>
                    {/* <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        ৳
                        {(
                          (item.price || item.productId?.price) * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div> */}
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Amount</span>
                <span className="text-xl font-bold text-emerald-600">
                  ৳{order?.totalPrice?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next - SMS Style */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">📦 What's Next?</p>
              <ul className="text-sm text-amber-700 mt-2 space-y-1">
                <li>• We'll send you an SMS when your order is confirmed</li>
                <li>• You'll receive a tracking link once shipped</li>
                <li>• Delivery expected within 3-5 business days</li>
                <li>
                  • Keep this Order ID for tracking:{" "}
                  <span className="font-mono font-semibold">{orderId}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {orderId && (
            <Link
              href={`/track-order?orderId=${encodeURIComponent(orderId)}`}
              className="flex items-center justify-center gap-2 flex-1 h-11 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <Package className="h-4 w-4" />
              Track Your Order
            </Link>
          )}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 flex-1 h-11 rounded-xl text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <Home className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-slate-400">
          Need help? Contact our support team at support@shop.com
        </p>
      </div>
    </div>
  );
}
