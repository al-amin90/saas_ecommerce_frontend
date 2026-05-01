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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDynamicQuery } from "@/src/redux/features/dynamic/dynamicApi";
import {
  IProduct,
  IVariant,
  IStock,
} from "@/src/interface/dashboard/product.interface";
import Link from "next/link";
import { useGetSingleProductQuery } from "@/src/redux/features/product/productApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopulatedVariant extends Omit<IVariant, "color"> {
  color: { _id: string; name: string; color: string } | string;
}

interface PopulatedProduct extends Omit<IProduct, "variant" | "categoryID"> {
  variant: PopulatedVariant[];
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

  const { data, isLoading } = useGetSingleProductQuery({
    url: `/product/${slug}`,
  });
  const product = data?.data as PopulatedProduct | undefined;

  console.log(product);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Product not found.
      </div>
    );

  const images = product.existingImages ?? [];
  const activeVariant = product.variant?.[selectedVariantIdx] as
    | PopulatedVariant
    | undefined;
  const stockList: IStock[] = (activeVariant?.stock ?? []) as IStock[];
  const selectedStock = stockList.find((s) => s.size === selectedSize);
  const inStock = stockList.some((s) => s.quantity > 0);
  const discount =
    product.price > product.discountPrice
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : product.price;
  const categoryName =
    typeof product.categoryID === "object" ? product.categoryID.name : "";

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto bg-white">
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
                src={images[selectedImage]}
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
            {discount > 0 && (
              <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black text-white text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl cursor-pointer overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-black"
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
              Tk {product.discountPrice.toLocaleString()}.00
            </span>
            {discount > 0 && (
              <span className="text-sm sm:text-base text-slate-400 line-through">
                Tk {product.price.toLocaleString()}.00
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
                  const colorObj = typeof v.color === "object" ? v.color : null;
                  return (
                    <button
                      key={v._id ?? i}
                      onClick={() => {
                        setSelectedVariantIdx(i);
                        setSelectedSize(null);
                      }}
                      title={colorObj?.name ?? "Color"}
                      className={`w-6 h-6 sm:w-8 sm:h-8 cursor-pointer rounded-full border-2 transition-all ${
                        selectedVariantIdx === i
                          ? "border-black scale-110 shadow-md"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                      style={{
                        backgroundColor: colorObj?.color ?? "#ccc",
                      }}
                    />
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
                {selectedSize && (
                  <span className="text-xs text-slate-400">
                    Selected: {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {stockList.map((s) => (
                  <button
                    key={s._id ?? s.size}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={s.quantity === 0}
                    className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                      selectedSize === s.size
                        ? "bg-black text-white border-black"
                        : s.quantity === 0
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                          : "bg-white text-slate-700 border-slate-200 hover:border-black"
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

          {/* Quantity */}
          <div className="flex gap-3 items-center justify-center  w-full mb-3 relative">
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
                <span className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold min-w-[2rem] sm:min-w-[2.5rem] text-center">
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
              disabled={!selectedSize || !inStock}
              className="flex-1  h-10 sm:h-12 bg-black hover:bg-slate-800 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold gap-2 transition-all"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Add to cart</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          {/* CTA Buttons */}

          <Button
            disabled={!selectedSize || !inStock}
            variant="outline"
            className="w-full h-10 sm:h-12 border-black text-black hover:bg-black hover:text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold gap-2 transition-all"
          >
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Buy it now</span>
            <span className="sm:hidden">Buy</span>
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
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
                  Standard delivery: 3–5 business days
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
                  Express delivery: 1–2 business days
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
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

      <div className="relative w-full h-52 sm:h-96 md:h-[28rem] lg:h-[40rem]">
        <Image
          src={"/ladning/shoe-size.webp"}
          alt={"product shoe size"}
          fill
          className="object-contain "
          priority
        />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
