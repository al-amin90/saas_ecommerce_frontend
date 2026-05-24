"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/src/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotal);

  console.log("cartItems", cartItems);

  // ── Empty state ──────────────────────────────────────────────────────────

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
          <ShoppingBag className="h-9 w-9 text-orange-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">
            Your cart is empty
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Add some products to get started
          </p>
        </div>
        <Button
          onClick={() => router.push("/products")}
          className="bg-black hover:bg-slate-800 text-white rounded-xl px-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
    );
  }

  // ── Calculations ─────────────────────────────────────────────────────────

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalDiscount = cartItems.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {totalItems} items in cart
            </p>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, i) => {
              const discountedPrice =
                item.price > (item.discountPrice || 0)
                  ? Math.round(item.price - (item.discountPrice || 0))
                  : item.price;

              return (
                <div
                  key={`${item.productId}-${item?.colorId?._id}-${item.size}`}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 items-center shadow-sm"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {item.productName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">
                        Size: {item.size}
                      </span>
                      <span className="text-slate-200">|</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        Color:
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-slate-200"
                          style={{
                            backgroundColor: item?.colorId?.color ?? "#ccc",
                          }}
                        />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-slate-800">
                        ৳{discountedPrice}
                      </span>
                      {item?.discountPrice > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          ৳{item.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {/* Remove */}
                    <button
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            productId: item.productId,
                            colorId: item.colorId,
                            size: item.size,
                          }),
                        )
                      }
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Qty control */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              colorId: item.colorId,
                              size: item.size,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1.5 hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-slate-700 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              colorId: item.colorId,
                              size: item.size,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                        disabled={item.quantity >= item.stock}
                        className="px-2.5 py-1.5 hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-sm font-bold text-orange-500">
                      ৳{discountedPrice * item.quantity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order Summary ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 sticky top-6">
            <h2 className="font-bold text-slate-800 text-base">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({totalItems} items)</span>
                <span>
                  ৳
                  {cartItems
                    .reduce((s, i) => s + i.price * i.quantity, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-৳{totalDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 flex justify-between font-bold text-slate-800 text-base">
                <span>Total</span>
                <span className="text-orange-500">
                  ৳{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              className="w-full h-11 bg-black hover:bg-slate-800 text-white rounded-xl font-semibold text-sm gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>

            <button
              onClick={() => router.push("/products")}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
