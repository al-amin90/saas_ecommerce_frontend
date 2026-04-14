"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { logoutUser, selectUser } from "@/redux/features/auth/authSlice";
// import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [logout] = useLogoutMutation();
  // const user = useAppSelector(selectUser);

  // const handleLogout = async () => {
  //   await logout({});
  //   dispatch(logoutUser());
  //   toast.success("Logged out");
  //   router.push("/login");
  // };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-white/10",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="bg-blue-500/30 rounded-xl p-2 shrink-0">
          <Stethoscope className="h-5 w-5 text-blue-300" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">
            DoctorTracker
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-blue-500/30 text-white shadow-sm border border-blue-400/20"
                  : "text-blue-200/70 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-blue-300" : "",
                )}
              />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-3 w-3 text-blue-300" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      {/* <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-blue-500/30 text-blue-200 text-xs font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user.name}
              </p>
              <p className="text-blue-300/60 text-xs truncate">{user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors",
            collapsed ? "px-2 justify-center" : "justify-start gap-3",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div> */}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-slate-900 to-blue-950 border-r border-white/10">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col justify-between transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="absolute top-4 -right-3 z-10 hidden lg:flex bg-blue-600 hover:bg-blue-500 text-white rounded-full p-1 shadow-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <Menu className="h-3 w-3" />
          )}
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-2 shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-gradient-to-b from-slate-900 to-blue-950 border-r border-white/10 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}
