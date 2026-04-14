"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/src/redux/features/auth/authApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/src/redux/store";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

const PRIMARY = "#1A3C34";
const ACCENT = "#E07B1A";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    const subdomain =
      (process.env.NEXT_PUBLIC_TENANCY_TYPE as string) === "multi"
        ? parts[0]
        : "bazar";

    const postData = { email, password, subdomain };

    try {
      const res = await login(postData).unwrap();

      dispatch(
        setUser({
          // user: res.data.user,
          accessToken: res.data.accessToken,
        }),
      );

      toast.success("Welcome back!");
      router.replace("/dashboard");
    } catch (err: unknown) {
      console.log("errf", err);
      const errorMessage = err?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F7F6F2]">
      {/* ── Left panel (image + brand) ─────────────────────────────── */}
      <div
        className="hidden md:flex w-[45%] flex-shrink-0 flex-col justify-center items-center px-8 relative overflow-hidden"
        style={{ background: PRIMARY }}
      >
        {/* decorative circles */}
        <div
          className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="absolute bottom-[-60px] right-[-60px] w-60 h-60 rounded-full"
          style={{ background: "rgba(224,123,26,0.15)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-4 mb-12 relative z-10">
          <div
            className="w-16 h-16 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ background: ACCENT }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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
          <div>
            <h1
              className="font-['Syne'] font-black text-2xl text-white tracking-wide leading-tight"
              style={{ letterSpacing: "0.06em" }}
            >
              GHORER
            </h1>
            <h1
              className="font-['Syne'] font-black text-2xl tracking-wide leading-tight"
              style={{ color: ACCENT, letterSpacing: "0.06em" }}
            >
              BAZAR
            </h1>
          </div>
        </div>

        <h2
          className="font-['Syne'] font-black text-4xl text-white text-center leading-tight mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Welcome Back!
        </h2>
        <p className="font-['DM_Sans'] text-lg text-white/60 text-center max-w-sm leading-relaxed">
          Sign in to access your orders, wishlist, and exclusive member deals.
        </p>

        {/* Feature pills */}
        <div className="space-y-3 mt-8 w-full max-w-sm">
          {[
            "Free delivery on ৳3,000+",
            "100% authentic products",
            "Easy 30-day returns",
          ].map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 rounded-lg px-4 py-3 w-full"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: ACCENT }}
              />
              <p className="font-['DM_Sans'] text-base text-white/75">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: ACCENT }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              </svg>
            </div>
            <h1
              className="font-['Syne'] font-black text-xl"
              style={{ color: ACCENT }}
            >
              GHORER BAZAR
            </h1>
          </div>

          <h1
            className="font-['Syne'] font-black text-4xl mb-8"
            style={{
              color: PRIMARY,
              letterSpacing: "-0.02em",
            }}
          >
            Sign In
          </h1>

          {/* Email */}
          <div className="mb-3">
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-transparent focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": PRIMARY } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-12 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-transparent focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": PRIMARY } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="text-right mb-6">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold font-['DM_Sans'] transition-colors hover:opacity-80"
              style={{ color: ACCENT }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full py-4 text-base font-bold cursor-pointer tracking-wider rounded-lg transition-all"
            style={{
              background: PRIMARY,
              color: "white",
              fontFamily: "'Syne', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0F2820";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,60,52,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = PRIMARY;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="mt-6 text-center text-xs text-gray-600 font-['DM_Sans']">
            By continuing you agree to our{" "}
            <Link href="#" className="hover:text-gray-800 transition-colors">
              Terms
            </Link>
            {" & "}
            <Link href="#" className="hover:text-gray-800 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
