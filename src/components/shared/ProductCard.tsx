"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeColor?: "green" | "red" | "orange" | "dark";
  colors?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  unit?: string;
}

const badgeStyles: Record<string, string> = {
  green: "bg-emerald-500 text-white",
  red: "bg-red-500 text-white",
  orange: "bg-orange-500 text-white",
  dark: "bg-gray-900 text-white",
};

function StarRating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={i <= Math.round(value) ? "#E07B1A" : "none"}
              stroke={i <= Math.round(value) ? "#E07B1A" : "#D1D5DB"}
              strokeWidth="1.5"
            />
          </svg>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-50 h-64">
        {/* Product image */}
        <div className="relative w-full h-full rounded-lg">
          <Image
            src={product.image}
            fill
            alt={product.name}
            className="w-full h-full object-cover p-3 transition-transform duration-500 rounded-2xl group-hover:scale-110"
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold ${badgeStyles[product.badgeColor || "orange"]}`}
          >
            {product.badge}
          </div>
        )}

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="text-sm font-bold tracking-wide uppercase text-white border border-white px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist + Quick view — slide in from right */}
        <div
          className={`absolute bottom-4 right-4 flex gap-2 transition-all duration-300 ${
            hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:scale-110 transition-all duration-200"
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all duration-200"
            title="Quick view"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>

      {/* ── Content ──���─────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Name */}
        <h3
          className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 flex-1"
          style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
        >
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span
              className="font-bold text-lg"
              style={{
                color: "#E07B1A",
                fontFamily: "'Syne', system-ui, sans-serif",
              }}
            >
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
                {discount && (
                  <span className="text-xs font-bold text-red-500 ml-1">
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
          className="mt-3 w-full gap-2 text-base font-semibold py-3"
          variant={product.inStock === false ? "outline" : "default"}
          style={
            product.inStock !== false
              ? { background: "#E07B1A", color: "white" }
              : {}
          }
        >
          <ShoppingCart size={20} />
          {product.inStock === false ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
