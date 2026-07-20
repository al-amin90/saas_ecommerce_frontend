"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ShoppingCart,
  Zap,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IProduct,
  IVariant,
  IStock,
} from "@/src/interface/dashboard/product.interface";
import Link from "next/link";
import { useGetSingleProductQuery } from "@/src/redux/features/product/productApi";

import { useAppDispatch } from "@/src/redux/store";
import { toast } from "sonner";
import { addToCart } from "@/src/redux/features/cart/cartSlice";
import BuyNowModal from "@/src/components/dashboard/common/modal/BuyNowModal";
import SizeChartSection from "@/src/components/home/common/product/SizeChartSection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopulatedVariant extends Omit<IVariant, "color"> {
  color: { _id: string; name: string; color: string };
  imageIndex: number;
  _id: string;
}

type SizeQuantityEntry = {
  size: string;
  quantity: number;
  image: string;
};

interface PopulatedProduct extends Omit<
  IProduct,
  "variant" | "categoryID" | "sizeChartId"
> {
  variant: PopulatedVariant[];
  sizeChartId: {
    _id: string;
    chartName: string;
    brand?: string;
    targetGroup?: string;
    rows: {
      size: number;
      innerLength?: string;
      feetLength?: string;
      ageRange?: string;
      note?: string;
    }[];
  };
  categoryID: { _id: string; name: string } | string;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="w-full aspect-square rounded-2xl" />
        <div className="space-y-5">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-5 w-1/4 rounded-lg" />
          <Skeleton className="h-6 w-1/3 rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(title === "Product Description");
  return (
    <div className="border-t border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-slate-800 hover:text-black transition-colors"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {open && (
        <div className="pb-4 text-sm text-slate-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const dispatch = useAppDispatch();
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  const { data, isLoading } = useGetSingleProductQuery({
    url: `/product/${slug}`,
  });
  const product = data?.data as PopulatedProduct | undefined;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [sizeQuantities, setSizeQuantities] = useState<
    Record<string, SizeQuantityEntry[]>
  >({});

  console.log("selectedSize", selectedSize);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Product not found.
      </div>
    );
  }

  const images = product.existingImages ?? [];
  const activeVariant = product.variant?.[
    selectedVariantIdx
  ] as PopulatedVariant;

  const stockList: IStock[] = (activeVariant?.stock ?? []) as IStock[];

  console.log("stockList", stockList);
  console.log("activeVariant", activeVariant);

  const fallbackSize = stockList.find((s) => s.quantity > 0)?.size ?? null;
  const effectiveSelectedSize = selectedSize ?? fallbackSize;
  const selectedStock = stockList.find((s) => s.size === effectiveSelectedSize);
  const inStock = stockList.some((s) => s.quantity > 0);
  const hasDiscount =
    typeof product.discountPrice === "number" && product.discountPrice > 0;
  const discount = hasDiscount
    ? Math.round(product.price - (product.discountPrice ?? 0))
    : product.price;
  const categoryName =
    typeof product.categoryID === "object"
      ? (product.categoryID.name ?? "")
      : "";

  const totalSelectedItems = Object.values(sizeQuantities)
    .flat()
    .reduce((sum, s) => sum + s.quantity, 0);

  // -----------) add to cart here
  const handleAddToCart = () => {
    if (totalSelectedItems === 0) {
      toast.warning("Please select at least one size");
      return;
    }

    // সব variant এর সব selected size cart এ যাবে
    Object.entries(sizeQuantities).forEach(([variantId, sizes]) => {
      const variant = product.variant.find((v) => v._id === variantId);
      if (!variant) return;

      const variantImage = images[variant.imageIndex] || images[0] || "";

      sizes.forEach(({ size, quantity }) => {
        if (quantity === 0) return;

        const stock = variant.stock.find((s) => s.size === Number(size));

        dispatch(
          addToCart({
            productId: product._id!,
            productName: product.name,
            productImage: variantImage,
            price: product.price,
            originalPrice: product.originalPrice ?? product.price,
            discountPrice: product.discountPrice ?? 0,
            colorId: variant.color,
            size: String(size),
            quantity,
            stock: stock?.quantity ?? 0,
          }),
        );
      });
    });

    toast.success(
      `${totalSelectedItems} item${totalSelectedItems > 1 ? "s" : ""} added to cart!`,
    );
    setSizeQuantities({});
  };

  // In ProductDetailsPage component

  const handleBuyNow = () => {
    // Check if any size is selected
    const hasSelectedItems = Object.values(sizeQuantities).some(
      (sizes) => sizes.length > 0 && sizes.some((s) => s.quantity > 0),
    );

    if (!hasSelectedItems) {
      toast.error("Please select at least one size");
      return;
    }

    // Set the selected sizes for the modal
    setBuyNowOpen(true);
  };

  // ------------)  size show data methos
  const getSizeChartRow = (size: number) => {
    if (!product.sizeChartId?.rows) return null;

    return product.sizeChartId.rows.find((row) => {
      const inner = row?.innerLength;
      if (!inner) return false;

      const innerStr = String(inner).trim();
      const cleaned = innerStr?.replace(/[^0-9.\-]/g, "")?.trim();

      if (!cleaned) return false;

      if (cleaned.includes("-")) {
        const [min, max] = cleaned.split("-").map(Number);
        return size >= min && size <= max;
      }

      const min = Number.parseFloat(cleaned);
      const max = min + 0.99;

      return size >= min && size <= max;
    });
  };

  const getSizeQuantity = (variantId: string, size: number): number => {
    const sizeKey = String(size);
    return (
      sizeQuantities[variantId]?.find((s) => s.size === sizeKey)?.quantity ?? 0
    );
  };

  const updateSizeQuantity = (
    variantId: string,
    size: number,
    delta: number,
    maxStock: number,
  ) => {
    setSizeQuantities((prev) => {
      const existing = prev[variantId] ?? [];
      const sizeKey = String(size);
      const sizeEntry = existing.find((s) => s.size === sizeKey);
      const currentQty = sizeEntry?.quantity ?? 0;
      const nextQty = Math.min(Math.max(0, currentQty + delta), maxStock);

      let updated: SizeQuantityEntry[];

      if (!sizeEntry) {
        updated = [
          ...existing,
          { size: sizeKey, quantity: nextQty, image: "" },
        ];
      } else {
        updated = existing.map((s) =>
          s.size === sizeKey ? { ...s, quantity: nextQty } : s,
        );
      }

      updated = updated.filter((s) => s.quantity > 0);

      return { ...prev, [variantId]: updated };
    });
  };

  return (
    <div className="min-h-screen max-w-360 mx-auto bg-white">
      {/* Back */}
      <div className="  px-3 sm:px-6 pt-4 sm:pt-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          Back
        </Link>
      </div>

      <div className="   px-3 sm:px-6 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 ">
        {/* ── Left: Images ── */}
        <div className="space-y-2 sm:space-y-3 ">
          {/* Main image */}
          <div className="relative w-full aspect-square rounded-lg sm:rounded-2xl overflow-hidden bg-slate-100">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage] || images[0]}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs sm:text-sm">
                No image
              </div>
            )}
            {/* {discount > 0 && (
              <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black text-white text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )} */}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setSelectedImage(i)}
                  className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl cursor-pointer overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-orange-400"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`thumb-${i}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Details ── */}
        <div className="space-y-3 sm:space-y-5">
          {/* Category */}
          {categoryName && (
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {categoryName}
            </span>
          )}

          {/* Name */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
            {product.name}
          </h1>

          {/* Stock badge */}
          <div className="flex items-center gap-2 flex-wrap">
            {inStock ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs sm:text-sm text-emerald-600 font-medium">
                  In stock
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                <span className="text-xs sm:text-sm text-red-500 font-medium">
                  Out of stock
                </span>
              </>
            )}
            {selectedStock && (
              <span className="text-xs text-slate-400">
                ({selectedStock.quantity} left)
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Tk {discount.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm sm:text-base text-slate-400 line-through">
                Tk {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color variants */}
          {product.variant?.length > 0 && (
            <div className="space-y-2 pt-1 sm:pt-0">
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Color
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.variant.map((v, i) => {
                  const variantImage = images[v.imageIndex] || images[0];

                  return (
                    <button
                      key={v._id ?? i}
                      onClick={() => {
                        setSelectedVariantIdx(i);
                        setSelectedImage(v.imageIndex);
                        setSelectedSize(
                          (product.variant?.[i]?.stock ?? []).find(
                            (s) => s.quantity > 0,
                          )?.size ?? null,
                        );
                      }}
                      className={`flex items-center gap-2 px-3 cursor-pointer   py-2 rounded-lg border-2 transition-all ${
                        selectedVariantIdx === i
                          ? "border-orange-400  bg-[#FF6900] shadow-md"
                          : " border-orange-400 bg-slate-50 hover:bg-white"
                      }`}
                    >
                      {/* Variant Image Thumbnail */}
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        {variantImage ? (
                          <Image
                            src={variantImage}
                            alt={v.color.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-semibold  ${selectedVariantIdx === i ? "text-white" : "text-slate-900"}`}
                        >
                          {v.color.name}
                        </span>

                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 mt-0.5"
                          style={{ backgroundColor: v.color.color }}
                          title={v.color.color}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size */}
          {/* Size */}
          {/* Size */}

          {stockList.length > 0 && (
            <div className="space-y-2 pt-1 sm:pt-0">
              {/* Header */}
              <div className="flex justify-between items-center gap-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Size
                </p>
                <div className="flex gap-3 items-center">
                  {effectiveSelectedSize && (
                    <span className="text-xs text-slate-400">
                      Selected: {effectiveSelectedSize}
                    </span>
                  )}
                  {selectedStock && (
                    <span className="text-xs md:text-sm font-semibold text-emerald-600">
                      {selectedStock.quantity} left
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:gap-2">
                {stockList.map((s) => {
                  const activeVariantId = activeVariant?._id ?? "";
                  const qty = getSizeQuantity(activeVariantId, s.size);
                  const isSelected = qty > 0;
                  const isOutOfStock = s.quantity === 0;

                  return (
                    <div
                      key={s._id ?? s.size}
                      className={`relative gap-1.5 sm:gap-2 flex justify-between items-center`}
                    >
                      {/* Size Button - Click to select/unselect */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            // ✅ If already selected, unselect (set quantity to 0)
                            updateSizeQuantity(
                              activeVariantId,
                              s.size,
                              -qty,
                              s.quantity,
                            );
                            setSelectedSize(s.size);
                          } else {
                            // ✅ If not selected, select (add 1)
                            updateSizeQuantity(
                              activeVariantId,
                              s.size,
                              1,
                              s.quantity,
                            );
                            setSelectedSize(s.size);
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`relative cursor-pointer flex-1 flex justify-between items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                          isSelected
                            ? "bg-[#FF6900] text-white border-orange-400 shadow-md shadow-orange-200/50"
                            : isOutOfStock
                              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                              : "bg-white text-slate-700 border-orange-400 hover:bg-orange-50 hover:border-orange-500"
                        }`}
                      >
                        {getSizeChartRow(s.size)?.size && (
                          <p
                            className={`text-xs font-bold leading-tight mt-0.5 ${
                              isSelected ? "text-white/80" : ""
                            }`}
                          >
                            {getSizeChartRow(s.size)?.size}
                          </p>
                        )}

                        <p className="font-bold">{s.size} cm</p>

                        {getSizeChartRow(s.size)?.ageRange && (
                          <p
                            className={`text-xs font-bold leading-tight mt-0.5 ${
                              isSelected ? "text-white/80" : "text-slate-400"
                            }`}
                          >
                            {getSizeChartRow(s.size)?.ageRange} baby
                          </p>
                        )}
                      </button>

                      {/* Quantity Controls - Only show for selected items */}
                      {!isOutOfStock && isSelected && (
                        <div
                          className={`flex items-center rounded-xl overflow-hidden border lg:border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-[#FF6900] bg-white shadow-sm"
                              : "border-slate-200 bg-white group-hover:border-orange-300"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              updateSizeQuantity(
                                activeVariantId,
                                s.size,
                                -1,
                                s.quantity,
                              );
                            }}
                            disabled={qty === 0}
                            className={`px-2 lg:px-3 py-2 lg:py-[9px] transition-colors ${
                              qty === 0
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-600 hover:bg-orange-50 active:bg-orange-100"
                            }`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className={`lg:px-3 lg:py-2.5 text-sm font-bold  text-center ${
                              qty > 0 ? "text-[#FF6900]" : "text-slate-400"
                            }`}
                          >
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              updateSizeQuantity(
                                activeVariantId,
                                s.size,
                                1,
                                s.quantity,
                              );
                            }}
                            className={`px-2 lg:px-3 py-2 lg:py-[9px] transition-colors ${
                              qty >= s.quantity
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-600 hover:bg-orange-50 active:bg-orange-100"
                            }`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SKU */}
          <p className="text-xs sm:text-sm text-slate-400">
            <span className="font-semibold text-slate-600">SKU:</span>{" "}
            {product.sku}
          </p>

          <div className="flex  gap-3 items-center justify-center  w-full mb-2 lg:mb-3 relative">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              disabled={totalSelectedItems === 0}
              className="group  sm:h-12  cursor-pointer sm:w-[50%] border-2 border-black text-slate-800 hover:bg-black hover:text-white hover:border-black rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 relative overflow-hidden"
            >
              {/* Shimmer effect on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <span className="relative flex items-center justify-center gap-2">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
                <span className="inline">
                  {totalSelectedItems > 0
                    ? `Add ${totalSelectedItems} to cart`
                    : "Add to cart"}
                </span>
              </span>
            </Button>
          </div>

          {/* CTA Buttons */}

          <Button
            onClick={handleBuyNow}
            className="relative cursor-pointer
    hover:animate-none
    animate-pulse-glow
     w-full h-10 sm:h-12 rounded-lg bg-[#FF6900] sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 group border-2 hover:border-0 hover:bg-gradient-to-r hover:from-black hover:via-slate-800 hover:to-black hover:text-white hover:shadow-lg hover:shadow-black/30"
          >
            {/* Continuous pulse animation on hover */}
            <span className="absolute inset-0 rounded-lg sm:rounded-xl border-2  border-black/20  animate-[pulse_2s_ease-in-out_infinite]" />

            {/* Animated underline */}
            <span className="underline-animation" />

            {/* Zoom in/out animation container */}
            <span className="flex items-center justify-center gap-2 group-hover:animate-[zoomInOut_2s_ease-in-out_infinite]">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 scale-110 rotate-12 text-yellow-300" />
              <span className="inline">Buy it now</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs opacity-70 font-normal">
                <span className="w-1 h-1 rounded-full bg-current" />
                Cash On Delivery
              </span>
            </span>
          </Button>

          {/* Accordions */}
          <div className="pt-2 sm:pt-4 space-y-2 sm:space-y-0">
            <Accordion title="Product Description">
              <p className="text-xs sm:text-sm text-slate-600">
                {product.name} — available in multiple sizes and colors. Part of
                the {categoryName} collection.
              </p>
            </Accordion>
            <Accordion title="Shipping">
              <ul className="space-y-1 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                  Standard delivery: 3–5 business days
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                  Express delivery: 1–2 business days
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                  Free returns within 7 days
                </li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Size chart banner */}
      <div className="mt-6 sm:mt-8 bg-slate-100 py-3 sm:py-5 text-center px-3">
        <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-700">
          Please Check Size Chart For Better Fit
        </p>
      </div>

      {/* Size chart section */}
      {product?.sizeChartId ? (
        <SizeChartSection sizeChart={product.sizeChartId} />
      ) : (
        // fallback — chart assign না থাকলে
        <div></div>
      )}

      <BuyNowModal
        open={buyNowOpen}
        onOpenChange={setBuyNowOpen}
        productId={product._id!}
        productName={product.name}
        price={discount}
        images={images}
        variants={product.variant}
        sizeQuantities={sizeQuantities}
      />
    </div>
  );
};

export default ProductDetailsPage;
