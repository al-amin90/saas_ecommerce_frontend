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
}

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
      innerLength?: number;
      feetLength?: number;
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
  const [quantity, setQuantity] = useState(1);

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

  // -----------) add to cart here
  const handleAddToCart = () => {
    if (!effectiveSelectedSize) {
      toast.warning("Please select a size");
      return;
    }

    console.log("activeVariant", activeVariant);

    dispatch(
      addToCart({
        productId: product._id!,
        productName: product.name,
        productImage: product.existingImages?.[0] ?? "",
        price: product.price,
        originalPrice: product.originalPrice ?? product.price,
        discountPrice: product.discountPrice ?? 0,
        colorId: activeVariant.color,
        size: effectiveSelectedSize,
        quantity,
        stock: selectedStock?.quantity ?? 0,
      }),
    );

    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!effectiveSelectedSize) {
      toast.error("Please select a size");
      return;
    }
    setBuyNowOpen(true);
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
                  // Get the image for this variant
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
                          ? "border-orange-400 bg-white shadow-md"
                          : "border-slate-200 hover:border-orange-400 bg-slate-50 hover:bg-white"
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

                      {/* Color name */}
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-900">
                          {v.color.name}
                        </span>
                        {/* Optional: Show color swatch */}
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
          {stockList.length > 0 && (
            <div className="space-y-2 pt-1 sm:pt-0">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Size
                </p>
                {effectiveSelectedSize && (
                  <span className="text-xs text-slate-400">
                    Selected: {effectiveSelectedSize}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {stockList.map((s) => (
                  <button
                    key={s._id ?? s.size}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={s.quantity === 0}
                    className={`px-3 py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                      effectiveSelectedSize === s.size
                        ? "bg-black text-white border-orange-400 "
                        : s.quantity === 0
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                          : "bg-white text-slate-700 border-slate-200 hover:border-orange-400 "
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SKU */}
          <p className="text-xs sm:text-sm text-slate-400">
            <span className="font-semibold text-slate-600">SKU:</span>{" "}
            {product.sku}
          </p>

          <div className="flex gap-3 items-center justify-center  w-full mb-3 relative">
            {/* Quantity */}
            <div className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-0">
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Qty
              </span>
              <div className="flex items-center border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 sm:px-3 py-2.5 sm:py-3 hover:bg-slate-100 transition-colors text-slate-600"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <span className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold min-w-8 sm:min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2 sm:px-3 py-2.5 sm:py-3 hover:bg-slate-100 transition-colors text-slate-600"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="group flex-1 h-10 sm:h-12 border-2 border-black text-slate-800 hover:bg-black hover:text-white hover:border-black rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 relative overflow-hidden"
            >
              {/* Shimmer effect on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <span className="relative flex items-center justify-center gap-2">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
                <span className="inline">Add to cart</span>
              </span>
            </Button>
          </div>

          {/* CTA Buttons */}

          <Button
            onClick={handleBuyNow}
            className="relative cursor-pointer
    hover:animate-none
    animate-pulse-glow
     w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 group border-2 border-black hover:border-0 hover:bg-gradient-to-r hover:from-black hover:via-slate-800 hover:to-black hover:text-white hover:shadow-lg hover:shadow-black/30"
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
        discountPrice={product.discountPrice ?? 0}
        selectedSize={effectiveSelectedSize!}
        selectedColor={activeVariant.color}
        quantity={quantity}
      />
    </div>
  );
};

export default ProductDetailsPage;
