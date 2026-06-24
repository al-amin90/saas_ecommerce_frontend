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
    <div className="relative w-full h-auto lg:h-[84vh] overflow-hidden bg-black select-none group">
      {/* ── Slides ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="relative w-full aspect-[16/9] lg:aspect-auto lg:absolute lg:inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-fill"
            priority
            style={{
              transform: "scale(1.04)",
              transition: "transform 8s ease-out",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Animated Gradient Overlay */}
      {/* <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.3) 10%, transparent 100%)`,
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 50%)`,
        }}
      /> */}

      {/* Particle Effect */}
      <ParticleEffect isActive={!isAnimating} accent={slide.accent} />
      <ParticleEffect isActive={!isAnimating} accent={slide.accent} />

      {/* ── Content ─────────────────────────────────────────────────── */}
      {/* <div className="relative z-20 flex flex-col justify-center h-full mx-8 md:mx-16 lg:mx-24">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-4 px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full"
            style={{
              background: `${slide.accent}22`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${slide.accent}44`,
              color: slide.accent,
            }}
          >
            <Sparkles className="w-3 h-3" />
            {slide.subtitle}
          </motion.div>

          <GlowingText
            text={slide.title}
            accent={slide.accent}
            className="text-white font-black text-[clamp(2.8rem,6vw,5.5rem)] tracking-[-0.03em] whitespace-pre-line leading-none mb-4"
          />

          {slide.description && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/60 mb-8 text-sm"
              style={{ maxWidth: 400 }}
            >
              {slide.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {slide.productLink ? (
              <Link href={slide.productLink}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase text-black rounded-full transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}dd)`,
                    boxShadow: `0 10px 30px ${slide.accent}66`,
                  }}
                >
                  {slide.cta}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase text-black rounded-full transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}dd)`,
                  boxShadow: `0 10px 30px ${slide.accent}66`,
                }}
              >
                {slide.cta}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                >
                  →
                </motion.span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </div> */}

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
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
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
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
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

      {/* Floating elements for extra coolness */}
      {/* <motion.div
        className="absolute top-20 right-20 z-10 opacity-20 pointer-events-none"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
        }}
      >
        <Clock className="w-24 h-24 text-white" />
      </motion.div> */}
    </div>
  );
}
