import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden flex flex-col animate-pulse">
      {/* ── Image area ── */}
      <div className="relative bg-gray-100 h-40 sm:h-48 md:h-56 lg:h-64">
        <div className="w-full h-full p-2 sm:p-3">
          <div className="w-full h-full bg-gray-200 rounded-md sm:rounded-2xl" />
        </div>

        {/* floating buttons (ghost style) */}
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex gap-1.5 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200" />
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1">
        {/* Title */}
        <div className="space-y-1 sm:space-y-2">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-gray-100">
          <div className="flex gap-1.5 sm:gap-2 items-center">
            <div className="h-4 sm:h-5 w-12 sm:w-16 bg-gray-200 rounded" />
            <div className="h-3 sm:h-4 w-10 sm:w-12 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Button */}
        <div className="mt-1.5 sm:mt-2">
          <div className="h-8 sm:h-9 md:h-10 w-full bg-gray-200 rounded-md sm:rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
