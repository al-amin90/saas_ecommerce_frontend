"use client";

import { useEffect, useRef, useState } from "react";
import { useGetDynamicQuery } from "@/src/redux/features/dynamic/dynamicApi";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { IBanner } from "@/src/interface/dashboard/dashboard";

// ─── Types ──────────────────────────────────────────────────────────────────
interface TransformedSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  accent: string;
  description: string;
  productLink?: string;
  productName?: string;
}

// ─── Helper: Transform API banner to slide format ─────────────────────────
const transformBannerToSlide = (banner: IBanner): TransformedSlide => {
  // Generate a vibrant accent color based on banner colorHex or use dynamic gradient
  const accentColor = banner.colorHex || "#C8A97E";

  // Create tag from banner status or default
  const tag = banner.isActive ? "Limited Offer" : "Featured";

  // Create CTA text based on product link availability
  const cta = banner.productID ? "Shop Now" : "Learn More";

  return {
    id: banner._id || Math.random().toString(),
    image:
      banner.image ||
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85",
    tag: tag,
    title: banner.title || "Special Collection",
    subtitle: banner.subTitle || "Discover our latest arrivals",
    cta: cta,
    accent: accentColor,
    description: banner.description || "",
    productLink:
      banner.productID && typeof banner.productID === "object"
        ? `/products/${banner.productID._id}`
        : undefined,
    productName:
      banner.productID && typeof banner.productID === "object"
        ? banner.productID.name
        : undefined,
  };
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div
    className="relative w-full overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800"
    style={{ height: "88vh", minHeight: 480, maxHeight: 800 }}
  >
    <div className="absolute inset-0 animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
      <div className="absolute inset-0 bg-black/50" />

      {/* Skeleton Content */}
      <div className="relative z-20 flex flex-col justify-center h-full mx-8 md:mx-16 lg:mx-24">
        <div className="max-w-xl space-y-6">
          <div className="h-8 w-32 bg-white/20 rounded animate-pulse" />
          <div className="space-y-4">
            <div className="h-20 w-96 bg-white/20 rounded animate-pulse" />
            <div className="h-20 w-80 bg-white/20 rounded animate-pulse" />
          </div>
          <div className="h-6 w-64 bg-white/20 rounded animate-pulse" />
          <div className="h-12 w-48 bg-white/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Arrow Icons ─────────────────────────────────────────────────────────────
const ChevronLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── Particle Effect Component ─────────────────────────────────────────────
const ParticleEffect = ({
  isActive,
  accent,
}: {
  isActive: boolean;
  accent: string;
}) => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -50],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: 2,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

// ─── Glowing Text Effect ───────────────────────────────────────────────────
const GlowingText = ({
  text,
  accent,
  className,
}: {
  text: string;
  accent: string;
  className?: string;
}) => {
  const words = text.split(" ");

  return (
    <div className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          whileHover={{
            textShadow: `0 0 20px ${accent}`,
            scale: 1.05,
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ImageSlider() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 6000; // 6 seconds per slide

  // ── Drag/Swipe state ──────────────────────────────────────────────────
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [draggedDistance, setDraggedDistance] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetch banners from API
  const { data, isLoading, error } = useGetDynamicQuery({
    url: "/banner/active",
  });

  // Transform API data to slides
  const banners: IBanner[] = data?.data ?? [];
  const slides: TransformedSlide[] = banners.map(transformBannerToSlide);

  // Fallback slides if no banners from API
  const fallbackSlides: TransformedSlide[] = [
    {
      id: "1",
      tag: "New Season",
      title: "Step Into\nYour Story",
      subtitle: "Premium footwear crafted for every stride.",
      cta: "Shop Collection",
      accent: "#C8A97E",
      description: "Discover the perfect blend of comfort and style",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85",
    },
    {
      id: "2",
      tag: "Running Series",
      title: "Born for\nthe Streets",
      subtitle: "Performance meets style in every step.",
      cta: "Explore Now",
      accent: "#81C784",
      description: "Engineered for maximum performance",
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=85",
    },
    {
      id: "3",
      tag: "Classic Collection",
      title: "Timeless\nElegance",
      subtitle: "Where tradition meets modern comfort.",
      cta: "Discover More",
      accent: "#F06292",
      description: "Handcrafted for the discerning few",
      image:
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=85",
    },
  ];

  const displaySlides = slides.length > 0 ? slides : fallbackSlides;

  const goTo = (index: number, dir: "left" | "right") => {
    if (isAnimating) return;
    setPrev(active);
    setAnimDir(dir);
    setActive(index);
    setIsAnimating(true);
    setProgress(0);
    setTimeout(() => {
      setPrev(null);
      setIsAnimating(false);
    }, 700);
  };

  const next = () => goTo((active + 1) % displaySlides.length, "right");
  const back = () =>
    goTo((active - 1 + displaySlides.length) % displaySlides.length, "left");

  // ── Mouse Drag Handlers ──────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setDraggedDistance(0);
    setIsSwiping(false);
    sliderRef.current?.style.setProperty("cursor", "grabbing");

    // Pause autoplay while dragging
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const diff = startX - currentX;
    setDraggedDistance(diff);

    // Check if it's a horizontal swipe (not vertical)
    const currentY = e.clientY;
    const yDiff = Math.abs(startY - currentY);
    if (Math.abs(diff) > yDiff && Math.abs(diff) > 10) {
      setIsSwiping(true);
    }

    // Visual feedback for drag
    if (sliderRef.current && isSwiping) {
      const dragPercent = (diff / window.innerWidth) * 100;
      sliderRef.current.style.setProperty("--drag-offset", `${dragPercent}px`);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    sliderRef.current?.style.setProperty("cursor", "default");

    const threshold = 50; // Minimum pixels to trigger slide change
    const diff = startX - e.clientX;

    // Reset drag offset
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--drag-offset", "0px");
    }

    if (isSwiping && Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left -> next slide
        handleNav(next);
      } else {
        // Swipe right -> previous slide
        handleNav(back);
      }
    } else {
      // Reset autoplay if no slide change
      resetAutoplay();
    }

    setDraggedDistance(0);
    setIsSwiping(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      sliderRef.current?.style.setProperty("cursor", "default");
      if (sliderRef.current) {
        sliderRef.current.style.setProperty("--drag-offset", "0px");
      }
      resetAutoplay();
      setDraggedDistance(0);
      setIsSwiping(false);
    }
  };

  // ── Touch Handlers for Mobile ────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setDraggedDistance(0);
    setIsSwiping(false);

    // Pause autoplay while touching
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;

    const touch = e.touches[0];
    const currentX = touch.clientX;
    const diff = startX - currentX;
    setDraggedDistance(diff);

    // Check if it's a horizontal swipe
    const yDiff = Math.abs(startY - touch.clientY);
    if (Math.abs(diff) > yDiff && Math.abs(diff) > 10) {
      setIsSwiping(true);
      // Prevent vertical scroll when swiping horizontally
      e.preventDefault();
    }

    // Visual feedback for drag
    if (sliderRef.current && isSwiping) {
      const dragPercent = (diff / window.innerWidth) * 100;
      sliderRef.current.style.setProperty("--drag-offset", `${dragPercent}px`);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    const diff = startX - (e.changedTouches[0]?.clientX || startX);

    // Reset drag offset
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--drag-offset", "0px");
    }

    if (isSwiping && Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNav(next);
      } else {
        handleNav(back);
      }
    } else {
      resetAutoplay();
    }

    setDraggedDistance(0);
    setIsSwiping(false);
  };

  const handleTouchCancel = () => {
    if (isDragging) {
      setIsDragging(false);
      if (sliderRef.current) {
        sliderRef.current.style.setProperty("--drag-offset", "0px");
      }
      resetAutoplay();
      setDraggedDistance(0);
      setIsSwiping(false);
    }
  };

  // Autoplay + progress bar
  useEffect(() => {
    if (displaySlides.length <= 1) return;

    const tick = DURATION / 100;
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        return p + 1;
      });
    }, tick);
    autoplayRef.current = setInterval(() => {
      setActive((a) => {
        const n = (a + 1) % displaySlides.length;
        setPrev(a);
        setAnimDir("right");
        setIsAnimating(true);
        setProgress(0);
        setTimeout(() => {
          setPrev(null);
          setIsAnimating(false);
        }, 700);
        return n;
      });
    }, DURATION);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [displaySlides.length]);

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    const tick = DURATION / 100;
    progressRef.current = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, tick);
    autoplayRef.current = setInterval(() => {
      setActive((a) => {
        const n = (a + 1) % displaySlides.length;
        setPrev(a);
        setAnimDir("right");
        setIsAnimating(true);
        setProgress(0);
        setTimeout(() => {
          setPrev(null);
          setIsAnimating(false);
        }, 700);
        return n;
      });
    }, DURATION);
  };

  const handleNav = (fn: () => void) => {
    fn();
    resetAutoplay();
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    console.error("Failed to load banners:", error);
  }

  const slide = displaySlides[active];
  const prevSlide = prev !== null ? displaySlides[prev] : null;

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-auto lg:h-[84vh] overflow-hidden bg-black select-none group touch-pan-y"
      style={
        {
          cursor: isDragging ? "grabbing" : "grab",
          "--drag-offset": "0px",
          touchAction: isSwiping ? "none" : "pan-y",
        } as React.CSSProperties
      }
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* ── Slides ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: isDragging && isSwiping ? `var(--drag-offset)` : 0,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: isDragging ? 0 : 0.7,
            ease: isDragging ? "linear" : "easeInOut",
          }}
          className="relative w-full aspect-[16/9] lg:aspect-auto lg:absolute lg:inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-fill pointer-events-none"
            priority
            style={{
              transform: isDragging ? "scale(1.02)" : "scale(1.04)",
              transition: `transform ${isDragging ? "0.1s" : "8s"} ease-out`,
            }}
          />
        </motion.div>
      </AnimatePresence>
      {/* Particle Effect */}
      <ParticleEffect isActive={!isAnimating} accent={slide.accent} />
      <ParticleEffect isActive={!isAnimating} accent={slide.accent} />{" "}
      <ParticleEffect isActive={!isAnimating} accent={slide.accent} />
      {/* ── Slide counter with animation ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute hidden bottom-8 left-8 md:left-16 lg:left-24 z-20 lg:flex items-end gap-4"
      >
        <motion.span
          key={active}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-black text-white/90 tabular-nums"
          style={{ fontSize: "3rem", lineHeight: 1, letterSpacing: "-0.04em" }}
        >
          {String(active + 1).padStart(2, "0")}
        </motion.span>
        <span
          className="font-medium text-white/40 tabular-nums mb-1.5"
          style={{ fontSize: "1.1rem" }}
        >
          / {String(displaySlides.length).padStart(2, "0")}
        </span>
      </motion.div>
      {/* ── Thumbnail strip with hover effects ─────────────────────────── */}
      <div className="hidden lg:flex absolute bottom-8 right-8 md:right-16 z-20  gap-3">
        {displaySlides.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() =>
              handleNav(() => goTo(i, i > active ? "right" : "left"))
            }
            onMouseEnter={() => setHoveredThumb(i)}
            onMouseLeave={() => setHoveredThumb(null)}
            className="relative w-full h-full overflow-hidden rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            style={{
              width: i === active ? 80 : 56,
              height: 64,
              outline:
                i === active
                  ? `3px solid ${displaySlides[active].accent}`
                  : "2px solid transparent",
              outlineOffset: 2,
              opacity: i === active ? 1 : 0.5,
            }}
          >
            <Image
              src={s.image}
              alt=""
              fill
              className="w-full h-full object-cover"
            />

            {/* Hover overlay */}
            {hoveredThumb === i && i !== active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </motion.div>
            )}

            {/* Progress bar for active thumbnail */}
            {i === active && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r"
                style={{ background: slide.accent }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            )}
          </motion.button>
        ))}
      </div>
      {/* ── Dot indicators (mobile) ──────────────────────────────────── */}
      <div className="absolute left-1/2 bottom-9 -translate-x-1/2 z-20 flex gap-2 md:hidden">
        {displaySlides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() =>
              handleNav(() => goTo(i, i > active ? "right" : "left"))
            }
            className="rounded-full transition-all duration-300"
            whileHover={{ scale: 1.2 }}
            style={{
              width: i === active ? 28 : 8,
              height: 8,
              background:
                i === active
                  ? displaySlides[active].accent
                  : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
      {/* ── Nav arrows with hover effects ──────────────────────────────── */}
      <motion.button
        onClick={() => handleNav(back)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hidden md:flex"
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </motion.button>
      <motion.button
        onClick={() => handleNav(next)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hidden md:flex"
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </motion.button>
    </div>
  );
}
