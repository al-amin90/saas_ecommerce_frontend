import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col animate-pulse">
      {/* ── Image area ── */}
      <div className="relative bg-gray-100 h-64">
        <div className="w-full h-full p-3">
          <div className="w-full h-full bg-gray-200 rounded-2xl" />
        </div>

        {/* floating buttons (ghost style) */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex gap-2 items-center">
            <div className="h-5 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Button */}
        <div className="mt-2">
          <div className="h-11 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
