"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/src/interface/dashboard/product.interface";

const badgeStyles: Record<string, string> = {
  green: "bg-emerald-500 text-white",
  red: "bg-red-500 text-white",
  orange: "bg-orange-500 text-white",
  dark: "bg-gray-900 text-white",
};

export default function ProductCard({ product }: { product: IProduct }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;

  console.log(product);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-50 h-32 sm:h-48 md:h-56 lg:h-64">
        {/* Product image */}
        <div className="relative w-full  h-full rounded-lg">
          <Image
            src={product?.images?.[0] ?? ""}
            fill
            alt={product.name}
            className="w-full h-full object-cover p-0 md:p-3 transition-transform duration-500 rounded-xl md:rounded-2xl group-hover:scale-110  "
          />
        </div>

        {/* Badge */}
        {/* {product.badge && (
          <div
            className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold ${badgeStyles[product.badgeColor || "orange"]}`}
          >
            {product.badge}
          </div>
        )} */}

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white border border-white px-2 sm:px-4 py-1 sm:py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist + Quick view — slide in from right */}
        <div
          className={`absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex gap-1.5 sm:gap-2 transition-all duration-300 ${
            hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:scale-110 transition-all duration-200"
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className="sm:w-5 sm:h-5"
              fill={wishlisted ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all duration-200"
            title="Quick view"
          >
            <Eye size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1">
        {/* Name */}
        <h3
          className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 leading-tight line-clamp-2 flex-1"
          style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
        >
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center justify-between mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span
              className="font-bold text-sm sm:text-lg md:text-xl"
              style={{
                color: "#E07B1A",
                fontFamily: "'Syne', system-ui, sans-serif",
              }}
            >
              ৳{product.discountPrice || product.price}
            </span>
            {discount && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
                {discount && (
                  <span className="text-xs font-bold text-red-500">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Add to cart button */}
        <Button
          disabled={product.inStock === false}
          className="mt-1.5 sm:mt-2 w-full gap-1 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold py-2 sm:py-2.5 md:py-3 px-2 sm:px-3"
          variant={product.inStock === false ? "outline" : "default"}
          style={
            product.inStock !== false
              ? { background: "#E07B1A", color: "white" }
              : {}
          }
        >
          <ShoppingCart size={14} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">
            {product.inStock === false ? "Out of Stock" : "Add to Cart"}
          </span>
          <span className="sm:hidden">
            {product.inStock === false ? "Out" : "Add"}
          </span>
        </Button>
      </div>
    </div>
  );
}
