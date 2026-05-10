"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">Order Placed!</h1>
          <p className="text-slate-500 text-sm">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order ID */}
        {orderId && (
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400 mb-1">Order ID</p>
            <p className="font-mono text-sm font-semibold text-slate-700 break-all">
              {orderId}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="text-left space-y-2 bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
            What's next?
          </p>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• We'll confirm your order shortly</li>
            <li>• Delivery within 3–5 business days</li>
            <li>• Save your Order ID to track your order</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {orderId && (
            <Button
              onClick={() => router.push(`/track-order?orderId=${orderId}`)}
              className="w-full h-11 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-semibold gap-2"
            >
              <Package className="h-4 w-4" />
              Track Order
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full h-11 rounded-xl text-sm font-semibold border-slate-200 gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
