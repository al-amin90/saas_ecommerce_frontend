"use client";
import { useState } from "react";
import {
  Search,
  Menu,
  ShoppingCart,
  User,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useAppSelector } from "@/src/redux/store";
import { selectCartItems } from "@/src/redux/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { selectToken } from "@/src/redux/features/auth/authSlice";
import { DecodedToken } from "@/src/redux/types";
import { jwtDecode } from "jwt-decode";

const PRIMARY = "#1A3C34";
const ACCENT = "#E07B1A";

type NavbarCategory = {
  label: string;
  href: string;
  children?: string[];
};

const categories: NavbarCategory[] = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Kids", href: "/" },
  { label: "Boys", href: "/" },
  { label: "Girls", href: "/" },
  { label: "Unisex", href: "/" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);
  const accessToken = useAppSelector(selectToken);

  const decoded = accessToken ? jwtDecode<DecodedToken>(accessToken) : null;
  const isSuperAdmin = decoded?.role === "super_admin";

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* ── Row 1: Logo / Search / Icons ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white">
        <div className="max-w-[1440px] mx-auto pl-4 pr-0 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-4 md:py-6">
            {/* Logo */}
            <Link
              href={"/"}
              className="relative rounded-full w-11 h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0 mr-3"
            >
              <Image
                src="/logo.jpeg"
                fill
                className="object-contain rounded-full"
                alt="Logo"
              />
            </Link>

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
              {accessToken ? (
                <div className="flex flex-col items-center gap-1">
                  {isSuperAdmin && (
                    <Link
                      href="/dashboard"
                      className="flex flex-col items-center cursor-pointer px-1 sm:px-2 transition-colors hover:opacity-80"
                    >
                      <LayoutDashboard
                        size={20}
                        className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                        style={{ color: PRIMARY }}
                      />
                      <span
                        className="text-sm hidden lg:block font-medium mt-1"
                        style={{
                          color: PRIMARY,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Dashboard
                      </span>
                    </Link>
                  )}
                  {/* <Link
                    href="/profile"
                    className="flex flex-col items-center cursor-pointer px-1 sm:px-2 transition-colors hover:opacity-80"
                  >
                    <User
                      size={20}
                      className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                      style={{ color: PRIMARY }}
                    />
                    <span
                      className="text-sm hidden lg:block font-medium mt-1"
                      style={{
                        color: PRIMARY,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Profile
                    </span>
                  </Link> */}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex flex-col items-center cursor-pointer px-1 sm:px-2 transition-colors hover:opacity-80"
                >
                  <User
                    size={20}
                    className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                    style={{ color: PRIMARY }}
                  />
                  <span
                    className="text-sm hidden lg:block font-medium mt-1"
                    style={{
                      color: PRIMARY,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Sign In
                  </span>
                </Link>
              )}

              {/* Wishlist */}
              {/* <div className="flex flex-col items-center cursor-pointer px-2 transition-colors hover:opacity-80">
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
              </div> */}

              {/* Cart */}
              <Link
                href={"/cart"}
                className="flex flex-col items-center cursor-pointer px-1 sm:px-2 transition-colors hover:opacity-80"
              >
                <div className="relative">
                  <ShoppingCart
                    size={20}
                    className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                    style={{ color: PRIMARY }}
                  />
                  {itemCount > 0 && (
                    <div
                      className="absolute -top-3 -right-2 h-4 w-4 sm:h-6 sm:w-6 flex items-center justify-center rounded-full text-[8px] sm:text-xs font-bold"
                      style={{ background: ACCENT, color: "white" }}
                    >
                      {itemCount ?? "0"}
                    </div>
                  )}
                </div>
                <span
                  className="text-xs hidden lg:block sm:text-sm font-medium mt-1"
                  style={{
                    color: PRIMARY,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Cart
                </span>
              </Link>

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
              KidsHut BD
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
