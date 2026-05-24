"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";

// import { logoutUser, selectUser } from "@/redux/features/auth/authSlice";
// import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  LayoutDashboard,
  Palette,
  ChartBarStacked,
  FolderKanban,
  ShoppingCart,
  Package,
  Clock,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Truck,
} from "lucide-react";

type NavChild = {
  href: string;
  label: string;
  icon: React.ElementType;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/category", label: "Category", icon: ChartBarStacked },
  { href: "/dashboard/color", label: "Color", icon: Palette },
  { href: "/dashboard/product", label: "Product", icon: FolderKanban },
  {
    href: "/dashboard/manual-order",
    label: "Manual Order",
    icon: ShoppingCart,
  },
  {
    href: "/dashboard/order",
    label: "Orders",
    icon: Package,
    // children: [
    //   { href: "/dashboard/orders", label: "All Orders", icon:  },
    //   { href: "/dashboard/orders/pending", label: "Pending", icon: Clock },
    // ],
  },
  {
    href: "/dashboard/delivery-method",
    label: "Delivery Methods",
    icon: Truck,
  },
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

  const SidebarContent = () => {
    const [openMenus, setOpenMenus] = useState<string[]>(() => {
      return navItems
        .filter((item) =>
          item.children?.some(
            (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
          ),
        )
        .map((item) => item.href);
    });

    const toggleMenu = (href: string) => {
      setOpenMenus((prev) =>
        prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
      );
    };

    // active parent check
    const isParentActive = (item: NavItem) => {
      if (pathname === item.href) return true;
      if (
        item.children?.some(
          (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
        )
      )
        return true;
      return false;
    };
    return (
      <div className="flex flex-col h-full">
        {/* Brand */}
        <Link
          href={"/"}
          className={cn(
            "flex items-center gap-3 px-4 py-5 border-b border-white/10",
            collapsed && "justify-center px-2",
          )}
        >
          <div className="relative rounded-full w-5 h-5 md:w-8 md:h-8  flex-shrink-0">
            <Image
              src="/logo.jpeg"
              fill
              className="object-contain rounded-full"
              alt="Logo"
            />
          </div>
          {!collapsed && (
            <span className="text-white font-bold text-lg tracking-tight">
              Shoes Bazar
            </span>
          )}
        </Link>

        {/* Nav */}

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children?.length;

            // শুধু exact match বা direct child active হলে parent active
            const parentActive =
              (!hasChildren && pathname === item.href) ||
              (hasChildren &&
                !!item.children?.some(
                  (c) =>
                    pathname === c.href || pathname.startsWith(c.href + "/"),
                ));

            // শুধু openMenus state দিয়ে control — parentActive দিয়ে না
            const isOpen = openMenus.includes(item.href);

            return (
              <div key={item.href}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleMenu(item.href)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      parentActive
                        ? "bg-blue-500/20 text-white border border-blue-400/20"
                        : "text-blue-200/70 hover:bg-white/5 hover:text-white",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        parentActive ? "text-blue-300" : "text-blue-200/70",
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            isOpen ? "rotate-0" : "-rotate-90",
                            parentActive ? "text-blue-300" : "text-blue-200/40",
                          )}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      // exact match only — startsWith সরিয়ে দিলাম
                      pathname === item.href
                        ? "bg-blue-500/20 text-white border border-blue-400/20"
                        : "text-blue-200/70 hover:bg-white/5 hover:text-white",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        pathname === item.href
                          ? "text-blue-300"
                          : "text-blue-200/70",
                      )}
                    />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                  </Link>
                )}

                {/* Children */}
                {hasChildren && isOpen && !collapsed && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      // child active — exact match only
                      const childActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                            childActive
                              ? "bg-blue-500/20 text-white border border-blue-400/10"
                              : "text-blue-200/50 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <ChildIcon
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              childActive
                                ? "text-blue-300"
                                : "text-blue-200/50",
                            )}
                          />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
  };

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
