"use client";

import { useState } from "react";
import Image from "next/image";

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
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className="w-3 h-3" viewBox="0 0 24 24">
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
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill={filled ? "#ef4444" : "none"}
      stroke={filled ? "#ef4444" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeColor, setActiveColor] = useState(0);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-gray-50 "
        style={{ height: 240 }}
      >
        {/* Product image */}
        <div className="relative w-full h-full rounded-xl">
          <Image
            src={product.image}
            fill
            alt={product.name}
            className="w-full h-full object-cover p-3 transition-transform duration-500 rounded-2xl group-hover:scale-105"
          />
        </div>

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500 border border-gray-300 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist + Quick view — slide in from right */}
        <div
          className={`absolute bottom-3 right-3 flex  gap-1.5 transition-all duration-300 ${
            hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 hover:scale-110 transition-all duration-200"
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon filled={wishlisted} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 cursor-pointer rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all duration-200"
            title="Quick view"
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="p-3.5 flex flex-col gap-.5 flex-1">
        {/* Name */}
        <h3
          className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2"
          style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
        >
          {product.name}
        </h3>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-extrabold text-base"
              style={{
                color: "#E07B1A",
                fontFamily: "'Syne', system-ui, sans-serif",
              }}
            >
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.unit && (
            <span className="text-[10px] text-gray-400 font-medium">
              {product.unit}
            </span>
          )}
        </div>

        <button
          disabled={product.inStock === false}
          className={`mt-2 w-full cursor-pointer flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg border transition-all duration-300 ${
            product.inStock === false
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500"
          }`}
        >
          <>
            <CartIcon />
            {product.inStock === false ? "Out of Stock" : "Choose"}
          </>
        </button>
      </div>
    </div>
  );
}
