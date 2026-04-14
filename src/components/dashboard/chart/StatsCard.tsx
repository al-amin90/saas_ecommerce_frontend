"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "blue" | "emerald" | "violet" | "amber";
  isLoading?: boolean;
};

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    border: "border-blue-100 dark:border-blue-900/50",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-100 dark:border-emerald-900/50",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    icon: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    badge:
      "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
    border: "border-violet-100 dark:border-violet-900/50",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    badge:
      "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
    border: "border-amber-100 dark:border-amber-900/50",
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
  isLoading,
}: Props) {
  const c = colorMap[color];

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        c.bg,
        c.border,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          {isLoading ? (
            <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {value}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3 shrink-0", c.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              c.badge,
            )}
          >
            {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
