"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Slide {
  id: number;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  accent: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const slides: Slide[] = [
  {
    id: 1,
    tag: "New Season",
    title: "Step Into\nYour Story",
    subtitle: "Premium footwear crafted for every stride.",
    cta: "Shop Collection",
    accent: "#C8A97E",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85",
  },
  {
    id: 2,
    tag: "Running Series",
    title: "Born for\nthe Streets",
    subtitle: "Performance meets style in every step.",
    cta: "Explore Now",
    accent: "#81C784",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=85",
  },
  {
    id: 3,
    tag: "Premium Leather",
    title: "Walk With\nConfidence",
    subtitle: "Handcrafted boots for the discerning individual.",
    cta: "View Boots",
    accent: "#90CAF9",
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=85",
  },
  {
    id: 4,
    tag: "Summer Edit",
    title: "Light as\nAir",
    subtitle: "Breathable sandals for warm sunny days.",
    cta: "Shop Sandals",
    accent: "#FFB74D",
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1200&q=85",
  },
];

// ─── Arrow Icons ─────────────────────────────────────────────────────────────
const ChevronLeft = () => (
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

const ChevronRight = () => (
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ImageSlider() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 5000;

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

  const next = () => goTo((active + 1) % slides.length, "right");
  const back = () => goTo((active - 1 + slides.length) % slides.length, "left");

  // Autoplay + progress bar
  useEffect(() => {
    const tick = DURATION / 100;
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        return p + 1;
      });
    }, tick);

    autoplayRef.current = setInterval(() => {
      setActive((a) => {
        const n = (a + 1) % slides.length;
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
  }, []);

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
        const n = (a + 1) % slides.length;
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

  const slide = slides[active];
  const prevSlide = prev !== null ? slides[prev] : null;

  // Translate classes based on direction
  const enterClass =
    animDir === "right" ? "translate-x-full" : "-translate-x-full";
  const exitClass =
    animDir === "right" ? "-translate-x-full" : "translate-x-full";

  return (
    <div
      className="relative w-full overflow-hidden bg-black select-none"
      style={{ height: "88vh", minHeight: 480, maxHeight: 800 }}
    >
      {/* ── Slides ─────────────────────────────────────────────────────── */}
      {/* Previous slide (exiting) */}
      {prevSlide && (
        <SlideLayer
          slide={prevSlide}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            isAnimating ? exitClass : "translate-x-0"
          }`}
          isActive={false}
        />
      )}

      {/* Active slide (entering) */}
      <SlideLayer
        slide={slide}
        className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
          prev !== null && isAnimating
            ? `${enterClass} translate-start`
            : "translate-x-0"
        }`}
        isActive={true}
        style={
          prev !== null && isAnimating
            ? {
                transform: `translateX(${animDir === "right" ? "100%" : "-100%"})`,
                animation: "slideIn 0.7s cubic-bezier(.77,0,.18,1) forwards",
              }
            : {}
        }
      />

      {/* ── Gradient Overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.2) 55%,transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 40%)",
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col justify-center h-full mx-8 md:mx-16 lg:mx-24">
        <div className="max-w-xl">
          {/* Tag */}
          <div
            key={`tag-${active}`}
            className="inline-block mb-4 px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-sm"
            style={{
              background: slide.accent,
              color: "#111",
              animation: "fadeUp 0.6s 0.1s both",
            }}
          >
            {slide.tag}
          </div>

          {/* Title */}
          <h1
            key={`title-${active}`}
            className="text-white font-black leading-none mb-4"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              letterSpacing: "-0.03em",
              whiteSpace: "pre-line",
              animation: "fadeUp 0.6s 0.2s both",
            }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p
            key={`sub-${active}`}
            className="text-white/60 mb-8 leading-relaxed"
            style={{
              fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
              animation: "fadeUp 0.6s 0.3s both",
              maxWidth: 380,
            }}
          >
            {slide.subtitle}
          </p>

          {/* CTA */}
          <div
            key={`cta-${active}`}
            style={{ animation: "fadeUp 0.6s 0.4s both" }}
          >
            <button
              className="group flex items-center gap-3 px-7 py-3.5 text-sm font-bold tracking-widest uppercase text-black rounded-sm transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: slide.accent,
                boxShadow: `0 8px 30px ${slide.accent}44`,
              }}
            >
              {slide.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Slide counter ───────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 z-20 flex items-end gap-4">
        <span
          className="font-black text-white/90 tabular-nums"
          style={{ fontSize: "3rem", lineHeight: 1, letterSpacing: "-0.04em" }}
        >
          0{active + 1}
        </span>
        <span
          className="font-medium text-white/30 tabular-nums mb-1.5"
          style={{ fontSize: "1.1rem" }}
        >
          / 0{slides.length}
        </span>
      </div>

      {/* ── Thumbnail strip ─────────────────────────────────────────── */}
      <div className="absolute bottom-8 right-8 md:right-16 z-20 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() =>
              handleNav(() => goTo(i, i > active ? "right" : "left"))
            }
            className="relative overflow-hidden rounded-sm transition-all duration-300"
            style={{
              width: i === active ? 64 : 44,
              height: 44,
              outline:
                i === active
                  ? `2px solid ${slides[active].accent}`
                  : "2px solid transparent",
              outlineOffset: 2,
              opacity: i === active ? 1 : 0.5,
            }}
          >
            <img src={s.image} alt="" className="w-full h-full object-cover" />
            {i === active && (
              <div
                className="absolute bottom-0 left-0 h-0.5"
                style={{
                  width: `${progress}%`,
                  background: slides[active].accent,
                  transition: "width 0.1s linear",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Dot indicators ──────────────────────────────────────────── */}
      <div className="absolute left-1/2 bottom-9 -translate-x-1/2 z-20 flex gap-2 md:hidden">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() =>
              handleNav(() => goTo(i, i > active ? "right" : "left"))
            }
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              background:
                i === active ? slides[active].accent : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      {/* ── Nav arrows ──────────────────────────────────────────────── */}
      <button
        onClick={() => handleNav(back)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => handleNav(next)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
        aria-label="Next slide"
      >
        <ChevronRight />
      </button>

      {/* ── Keyframes ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(var(--slide-from, 100%)); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Slide Layer ──────────────────────────────────────────────────────────────
function SlideLayer({
  slide,
  className,
  isActive,
  style,
}: {
  slide: Slide;
  className?: string;
  isActive: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`w-full h-full ${className ?? ""}`} style={style}>
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover"
        style={{
          transform: isActive ? "scale(1.04)" : "scale(1)",
          transition: "transform 6s ease",
        }}
      />
    </div>
  );
}
