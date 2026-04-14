"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { useAppSelector } from "@/redux/store";
// import { selectUser } from "@/redux/features/auth/authSlice";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/doctors": "Doctors",
  "/patients": "Patients",
};

export default function Topbar() {
  // const pathname = usePathname();
  // const user = useAppSelector(selectUser);

  // const title =
  //   Object.entries(pageTitles).find(([k]) => pathname.startsWith(k))?.[1] ??
  //   "Doctor Tracker";

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between pr-6 pl-16 lg:pl-6 shrink-0 sticky top-0 z-30">
      <div className=" ">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          {"title" || "dfd"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold">
              {/* {user?.name?.charAt(0).toUpperCase() ?? "A"} */}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 dark:text-white leading-none">
              {/* {user?.name} */}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {/* {user?.role} */}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
