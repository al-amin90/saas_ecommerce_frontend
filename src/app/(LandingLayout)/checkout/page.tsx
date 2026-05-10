"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "@/src/redux/features/cart/cartSlice";
import { usePostDynamicMutation } from "@/src/redux/features/dynamic/dynamicApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// ── Schema ────────────────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  paymentMethod: z.enum(["cash_on_delivery", "online"], {
    required_error: "Select payment method",
  }),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const [createOrder, { isLoading }] = usePostDynamicMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cash_on_delivery" },
  });

  const selectedPayment = watch("paymentMethod");

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-400">
        <p className="text-lg font-semibold">Your cart is empty</p>
        <Button onClick={() => router.push("/products")} variant="outline">
          Continue Shopping
        </Button>
      </div>
    );
  }

  const onSubmit = async (form: CheckoutForm) => {
    // Backend payload — service এর IOrder match করে
    const payload = {
      guestCheckout: true,
      guestEmail: form.email,
      guestInfo: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.discountPrice,
        color: item.color,
        size: item.size,
      })),
      totalPrice,
      paymentMethod: form.paymentMethod,
    };

    try {
      const res = await createOrder({ url: "order", data: payload }).unwrap();
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      router.push(`/order-success?orderId=${res?.data?._id}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Checkout</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        >
          {/* ── Left: Form ── */}
          <div className="space-y-5 bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
              Delivery Information
            </h2>

            {[
              {
                name: "name" as const,
                label: "Full Name",
                placeholder: "Al Amin",
              },
              {
                name: "email" as const,
                label: "Email",
                placeholder: "you@example.com",
              },
              {
                name: "phone" as const,
                label: "Phone",
                placeholder: "01XXXXXXXXX",
              },
              {
                name: "address" as const,
                label: "Address",
                placeholder: "House, Road, Area",
              },
              { name: "city" as const, label: "City", placeholder: "Kushtia" },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <Label className="text-sm text-slate-600">{f.label}</Label>
                <Input
                  {...register(f.name)}
                  placeholder={f.placeholder}
                  className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:border-black"
                />
                {errors[f.name] && (
                  <p className="text-xs text-red-500">
                    {errors[f.name]?.message}
                  </p>
                )}
              </div>
            ))}

            {/* Payment Method */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-600">Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "cash_on_delivery", label: "Cash on Delivery" },
                  { value: "online", label: "Online Payment" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setValue(
                        "paymentMethod",
                        opt.value as CheckoutForm["paymentMethod"],
                      )
                    }
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                      selectedPayment === opt.value
                        ? "border-black bg-black text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-xs text-red-500">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                Order Summary
              </h2>

              {cartItems.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  {item.productImage ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-400">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 flex-shrink-0">
                    Tk {(item.discountPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>Tk {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-800 pt-1">
                  <span>Total</span>
                  <span>Tk {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black hover:bg-slate-800 text-white rounded-xl font-semibold text-sm"
            >
              {isLoading ? "Placing Order..." : "Confirm Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
