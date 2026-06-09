"use client";

import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/src/components/dashboard/chart/StatsCard";
import DailyRegistrationChart from "@/src/components/dashboard/chart/DailyRegistrationChart";
import ConditionBreakdownChart from "@/src/components/dashboard/chart/ConditionBreakdownChart";

import { useGetOrderStatsQuery } from "@/src/redux/features/order/orderApi";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

interface IDashboardStats {
  dateRange: string;
  dateRangeDisplay: string;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    avgOrderValue: number;
  };
  breakdown: {
    status: {
      pending: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };
    paymentMethod: Record<string, number>;
    topProducts: Array<{
      productId: string;
      name: string;
      image: string;
      quantity: number;
      revenue: number;
    }>;
  };
  charts: {
    dailyOrders: { date: string; orders: number; revenue: number }[];
  };
  recentOrders: {
    _id: string;
    orderNumber: string;
    guestInfo?: { fullName: string };
    totalPrice: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    items: {
      productId: { name: string; images: string[] };
      quantity: number;
    }[];
  }[];
}

// ── Status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  },
  shipped: {
    label: "Shipped",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400",
  },
  delivered: {
    label: "Delivered",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
  },
};

// ── Date Range Options ────────────────────────────────────────────────────────

const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "last15days", label: "Last 15 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "lastMonth", label: "Last Month" },
  { value: "thisYear", label: "This Year" },
  { value: "lastYear", label: "Last Year" },
  { value: "lifetime", label: "Lifetime" },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

// ── Date Range Selector ───────────────────────────────────────────────────────

function DateRangeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-slate-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {dateRangeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("lifetime");

  const { data, isLoading, refetch } = useGetOrderStatsQuery(dateRange);
  const stats = data?.data as IDashboardStats | undefined;

  // Handle date range change
  const handleDateRangeChange = (newRange: string) => {
    setDateRange(newRange);
    refetch();
  };

  // Status breakdown chart data
  const statusChartData = useMemo(() => {
    if (!stats?.breakdown?.status) return [];
    return Object?.entries(stats.breakdown?.status).map(([key, value]) => ({
      condition: statusConfig[key]?.label ?? key,
      count: value,
    }));
  }, [stats]);

  // Daily orders chart data
  const dailyChartData = useMemo(() => {
    if (!stats?.charts?.dailyOrders) return [];
    return stats.charts.dailyOrders.map((d) => ({
      date: d.date,
      patients: d.orders,
    }));
  }, [stats]);

  if (isLoading) return <DashboardSkeleton />;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* ── Header with Date Range Selector ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {stats.dateRangeDisplay || "Order Statistics"}
          </p>
        </div>
        <DateRangeSelector value={dateRange} onChange={handleDateRangeChange} />
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value={stats.summary?.totalOrders}
          subtitle={`${stats.dateRangeDisplay}`}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Total Customers"
          value={stats.summary?.totalCustomers}
          subtitle="Unique customers"
          icon={Users}
          color="emerald"
        />
        <StatsCard
          title="Total Revenue"
          value={`৳${stats.summary?.totalRevenue.toLocaleString()}`}
          subtitle={`${stats.dateRangeDisplay}`}
          icon={TrendingUp}
          color="violet"
        />
        <StatsCard
          title="Avg Order Value"
          value={`৳${stats.summary?.avgOrderValue.toLocaleString()}`}
          subtitle="Average per order"
          icon={Package}
          color="amber"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Daily Orders Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              Orders Overview
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {stats.dateRangeDisplay}
            </p>
          </div>
          <DailyRegistrationChart data={dailyChartData} />
        </div>

        {/* Status Breakdown Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              Order Status Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">By current status</p>
          </div>
          <ConditionBreakdownChart data={statusChartData} />
        </div>
      </div>

      {/* ── Additional Insights (Optional) ── */}
      {stats.breakdown?.topProducts &&
        stats.breakdown?.topProducts.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                Top Products
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Best selling products in {stats.dateRangeDisplay}
              </p>
            </div>
            <div className="space-y-3">
              {stats.breakdown?.topProducts.map((product, idx) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-3"
                >
                  <div className="text-sm font-bold text-slate-400 w-6">
                    #{idx + 1}
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {product.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Package className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Sold: {product.quantity} units
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    ৳{product.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* ── Status Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {Object?.entries(stats.breakdown?.status).map(([key, value]) => {
          const icons: Record<string, React.ElementType> = {
            pending: Clock,
            processing: Package,
            shipped: Truck,
            delivered: CheckCircle2,
            cancelled: XCircle,
          };
          const Icon = icons[key] ?? Package;
          const cfg = statusConfig[key];
          return (
            <div
              key={key}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center space-y-1"
            >
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}
              >
                <Icon className="h-3 w-3" />
                {cfg.label}
              </span>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              Recent Orders
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest 5 orders • {stats.dateRangeDisplay}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {stats.recentOrders.map((order) => (
            <div key={order._id} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 overflow-hidden">
                {order.items[0]?.productId?.images?.[0] ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={order.items[0].productId.images[0]}
                      alt={order.items[0].productId.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {order.guestInfo?.fullName ?? "Registered User"}
                </p>
                <p className="text-xs text-slate-400 truncate font-mono">
                  {order.orderNumber}
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  ৳{order.totalPrice.toLocaleString()}
                </p>
                <Badge
                  variant="secondary"
                  className={`text-xs h-4 px-1.5 font-normal ${statusConfig[order.orderStatus]?.color}`}
                >
                  {statusConfig[order.orderStatus]?.label}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 shrink-0 hidden sm:block">
                {format(new Date(order.createdAt), "MMM d")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
