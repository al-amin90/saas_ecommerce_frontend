"use client";
import { useState } from "react";
import {
  Search,
  Menu,
  X,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

const PRIMARY = "#1A3C34";
const ACCENT = "#E07B1A";

const categories = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Boishakhi Dhamaka Offer!", href: "/" },
  { label: "Samba Craze", href: "/" },
  { label: "Kids", href: "/" },
  { label: "Sandals", href: "/" },
  { label: "Sneakers", href: "/" },
];

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
}

export default function Navbar({
  cartCount = 3,
  wishlistCount = 2,
}: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  return (
    <>
      {/* ── Row 1: Logo / Search / Icons ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white ">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-4 md:py-6">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0 mr-3">
              <div
                className="w-14 h-14 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: ACCENT }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 9.5L12 3l9 6.5V21H3V9.5z"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21v-7h6v7"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="1.5" fill="#fff" />
                </svg>
              </div>
              <div className="hidden sm:block leading-none">
                <h1
                  className="font-black text-lg tracking-widest uppercase leading-tight"
                  style={{ color: ACCENT, fontFamily: "'Syne', sans-serif" }}
                >
                  Ghorer
                </h1>
                <h1
                  className="font-black text-lg tracking-widest uppercase leading-tight"
                  style={{ color: ACCENT, fontFamily: "'Syne', sans-serif" }}
                >
                  Bazar
                </h1>
              </div>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="relative w-[350px] max-w-full">
                <Input
                  type="text"
                  placeholder="Search in..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-4 pr-14 py-3 text-sm border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": ACCENT } as React.CSSProperties}
                />
                <button
                  onClick={() => {
                    /* handle search */
                  }}
                  className="absolute right-0 top-0 h-full w-14 rounded-r-lg flex items-center justify-center cursor-pointer transition-colors hover:opacity-90"
                  style={{ background: ACCENT }}
                >
                  <Search size={24} color="#fff" />
                </button>
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2 md:gap-3 ml-auto">
              {/* Sign In */}
              <Link
                href="/login"
                className="hidden md:flex flex-col items-center cursor-pointer px-2 text-decoration-none transition-colors hover:opacity-80"
              >
                <User size={28} style={{ color: PRIMARY }} />
                <span
                  className="text-sm font-medium mt-1"
                  style={{
                    color: PRIMARY,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Sign In
                </span>
              </Link>

              {/* Wishlist */}
              <div className="flex flex-col items-center cursor-pointer px-2 transition-colors hover:opacity-80">
                <div className="relative">
                  <Heart size={28} style={{ color: PRIMARY }} />
                  {wishlistCount > 0 && (
                    <Badge
                      className="absolute -top-3 -right-2 h-6 w-6 flex items-center justify-center text-xs font-bold"
                      style={{ background: ACCENT, color: "white" }}
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </div>
                <span
                  className="text-sm font-medium mt-1"
                  style={{
                    color: PRIMARY,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Wishlist
                </span>
              </div>

              {/* Cart */}
              <div className="flex flex-col items-center cursor-pointer px-2 transition-colors hover:opacity-80">
                <div className="relative">
                  <ShoppingCart size={28} style={{ color: PRIMARY }} />
                  {cartCount > 0 && (
                    <Badge
                      className="absolute -top-3 -right-2 h-6 w-6 flex items-center justify-center text-xs font-bold"
                      style={{ background: ACCENT, color: "white" }}
                    >
                      {cartCount}
                    </Badge>
                  )}
                </div>
                <span
                  className="text-sm font-medium mt-1"
                  style={{
                    color: PRIMARY,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Cart
                </span>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="lg"
                className="md:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <Menu size={32} style={{ color: PRIMARY }} />
              </Button>
            </div>
          </div>

          {/* ── Row 2: Category nav ─────────────────────────────────────── */}
        </div>
        <nav
          className="hidden md:block border-t"
          style={{ background: PRIMARY }}
        >
          <div className="flex max-w-[1440px] mx-auto items-center gap-0">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="relative group"
                onMouseEnter={() => cat.children && setOpenDrop(cat.label)}
                onMouseLeave={() => setOpenDrop(null)}
              >
                <Link
                  href={cat.href}
                  className="flex items-center gap-1 px-5 py-4 text-white/90 text-sm font-normal tracking-wide whitespace-nowrap transition-colors hover:text-yellow-100"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {cat.label}
                  {cat.children && (
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        openDrop === cat.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {cat.children && openDrop === cat.label && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-b-lg shadow-lg min-w-[200px] z-50 py-3 animate-in fade-in slide-in-from-top-2">
                    {cat.children.map((child) => (
                      <Link
                        key={child}
                        href="#"
                        className="block px-5 py-3 text-sm text-gray-800 hover:bg-orange-50 transition-colors font-medium"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = ACCENT;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#1f2937";
                        }}
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer ────────────────────────────────────────────── */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-[300px] bg-gray-50 p-6">
          <SheetHeader className="mb-8">
            <SheetTitle
              className="text-2xl font-black tracking-wide"
              style={{
                color: ACCENT,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Ghorer Bazar
            </SheetTitle>
          </SheetHeader>

          {/* Mobile search */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full text-sm h-11"
            />
          </div>

          <div className="border-t border-gray-300 mb-6" />

          {/* Mobile nav */}
          <nav className="space-y-0 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="flex items-center justify-between py-4 px-0 border-b border-gray-200 text-sm font-normal transition-colors hover:text-orange-500"
                style={{
                  color: PRIMARY,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span>{cat.label}</span>
                {cat.children && (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile buttons */}
          <div className="space-y-4 flex flex-col">
            <Button
              asChild
              className="w-full uppercase font-bold tracking-wider text-white h-12 text-sm"
              style={{ background: PRIMARY }}
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full uppercase font-bold tracking-wider h-12 text-sm"
              style={{
                borderColor: PRIMARY,
                color: PRIMARY,
              }}
            >
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
