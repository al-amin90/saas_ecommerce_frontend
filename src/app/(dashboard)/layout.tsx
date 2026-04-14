"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import Sidebar from "@/src/components/dashboard/layout/Sidebar";
import Topbar from "@/src/components/dashboard/layout/Topbar";

// import { setUser } from "@/redux/features/auth/authSlice";
// import { useGetMeQuery } from "@/redux/features/auth/authApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const dispatch = useAppDispatch();
  // const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  // const { data, isError } = useGetMeQuery();

  // useEffect(() => {
  //   if (isError) router.replace("/login");
  // }, [isError, router]);

  // if (!isAuthenticated && !data) {
  //   return (
  //     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
