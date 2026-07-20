"use client";
import {
  selectCartItems,
  selectCartTotal,
} from "@/src/redux/features/cart/cartSlice";
import { useAppSelector } from "@/src/redux/store";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartBadge() {
  const totalItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotal);
  const router = useRouter();

  console.log("totalItems", totalItems);
  const itemCount = totalItems.reduce((sum, item) => sum + item.quantity, 0);
  console.log("itemCount", itemCount);

  return (
    <div className="flex flex-col w-fit h-fit items-center  fixed right-1 z-50 top-1/3 -translate-y-1/2">
      {/* Orange Box - Exact sizing */}
      <div
        onClick={() => router.push("/cart")}
        className="relative cursor-pointer w-14 sm:w-16 md:w-20 h-16 sm:h-20 md:h-24 bg-orange-500 rounded-md sm:rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow"
      >
        {/* Cart Icon */}
        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white animate-bounce" />

        {/* Items Text */}
        <span className="text-xs sm:text-sm font-bold text-white leading-tight">
          {itemCount ?? 0} items
        </span>
      </div>

      {/* Vertical Divider */}
      <div className="w-px h-1.5 sm:h-2 bg-gray-300" />

      {/* Price Box - Exact sizing */}
      <div className="w-14 sm:w-16 md:w-20 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg px-2 sm:px-3 py-2 sm:py-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow">
        <p className="text-xs sm:text-sm font-bold text-orange-600 leading-tight">
          ৳{totalPrice || "0.00"}
        </p>
      </div>
    </div>
  );
}
