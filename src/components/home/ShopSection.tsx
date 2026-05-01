"use client";
import { useEffect, useRef, useState } from "react";
import { Filter, SplineIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import ProductCard from "../shared/ProductCard";
import { useGetProductQuery } from "@/src/redux/features/product/productApi";
import { IProduct } from "@/src/interface/dashboard/product.interface";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "./common/skeleton/ProductCardSkeleton";

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useGetProductQuery({
    url: `product`,
    params: { page, limit: "9" },
  });

  console.log("products.data", data);

  useEffect(() => {
    if (data?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllProducts((prev) =>
        page === 1 ? data.data : [...prev, ...data.data],
      );
    }
  }, [data]);

  const meta = data?.meta;
  const hasMore = page < (meta?.totalPage ?? 1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  return (
    <section id="shop" className="py-20 md:py-32 bg-[#FAFAF8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="font-['DM_Sans'] text-sm font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: "#C8A97E" }}
          >
            Our Collection
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Shop All Shoes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-['DM_Sans']">
            Premium footwear for every occasion, style, and stride.
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Filter Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter size={20} />
            <span>Filters</span>
          </Button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-base font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="new">New Arrivals</option>
          </select>

          {/* Active Filters Count */}
          {(selectedBrands.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 10000) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-['DM_Sans']">
                {selectedBrands.length > 0 &&
                  `${selectedBrands.length} brand${selectedBrands.length !== 1 ? "s" : ""}`}
              </span>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {allProducts.map((product) => (
            <div key={product.slug}>
              <ProductCard product={product} />
            </div>
          ))}

          {/* এই div টা viewport এ আসলেই next page fetch হবে */}
          <div ref={loaderRef} className="py-4 text-center">
            {isFetching && <ProductCardSkeleton />}
          </div>
        </div>

        {/* No Results */}
        {allProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg font-['DM_Sans']">
              No products found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {/* Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-[320px] bg-white p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold font-['Syne']">
              Filters
            </SheetTitle>
          </SheetHeader>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-['Syne'] font-bold text-sm tracking-[0.08em] uppercase mb-4">
              Price Range
            </h3>
            <div className="px-2 mb-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={10000}
                step={500}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm font-['DM_Sans'] text-gray-700">
              <span>৳{priceRange[0].toLocaleString()}</span>
              <span>৳{priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6" />

          {/* Brands */}
          {/* <div className="mb-8">
            <h3 className="font-['Syne'] font-bold text-sm tracking-[0.08em] uppercase mb-4">
              Brands
            </h3>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center gap-3">
                  <Checkbox
                    id={brand}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label
                    htmlFor={brand}
                    className="text-base font-['DM_Sans'] cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Buttons */}
          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 text-base"
              onClick={() => {
                setSelectedBrands([]);
                setPriceRange([0, 10000]);
              }}
            >
              Clear All
            </Button>
            <Button
              className="flex-1 text-base"
              style={{ background: "#1A1A1A" }}
              onClick={() => setFilterOpen(false)}
            >
              Apply
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
