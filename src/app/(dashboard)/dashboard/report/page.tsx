"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Printer,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRevenueReportQuery } from "@/src/redux/features/order/orderApi";

// ── Constants ─────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = [
  { label: "Jan", value: 1 },
  { label: "Feb", value: 2 },
  { label: "Mar", value: 3 },
  { label: "Apr", value: 4 },
  { label: "May", value: 5 },
  { label: "Jun", value: 6 },
  { label: "Jul", value: 7 },
  { label: "Aug", value: 8 },
  { label: "Sep", value: 9 },
  { label: "Oct", value: 10 },
  { label: "Nov", value: 11 },
  { label: "Dec", value: 12 },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface IReportRow {
  label: string | number;
  revenue: number;
  profit: number;
  orders: number;
}

interface IReportData {
  type: "monthly" | "yearly";
  year?: number;
  data: IReportRow[];
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function RevenueReportPage() {
  const printRef = useRef<HTMLDivElement>(null);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [reportType, setReportType] = useState<"monthly" | "yearly">("monthly");
  const [selectedYears, setSelectedYears] = useState<number[]>([CURRENT_YEAR]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [showProfit, setShowProfit] = useState(false);

  // monthly mode তে শুধু একটা year
  const toggleYear = (year: number) => {
    if (reportType === "monthly") {
      setSelectedYears([year]);
    } else {
      setSelectedYears((prev) =>
        prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
      );
    }
  };

  const toggleMonth = (month: number) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

  // ── API call ──────────────────────────────────────────────────────────────
  const { data, isLoading } = useGetRevenueReportQuery({
    type: reportType,
    years: selectedYears.join(","),
    months: selectedMonths.join(","),
  });

  const report = data?.data as IReportData | undefined;

  // ── Print ─────────────────────────────────────────────────────────────────
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Revenue Report - ${reportType} - ${new Date().toLocaleDateString()}`,
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            Revenue Report
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track revenue and profit over time
          </p>
        </div>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="gap-2 border-slate-200 text-sm"
        >
          <Printer className="h-4 w-4" />
          Print Report
        </Button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
          Filters
        </h2>

        {/* Report type toggle */}
        <div className="flex gap-2">
          {(["monthly", "yearly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setReportType(t);
                setSelectedMonths([]);
                if (t === "monthly") setSelectedYears([CURRENT_YEAR]);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                reportType === t
                  ? "bg-black text-white border-black"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Year select */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500">
            {reportType === "monthly"
              ? "Select Year (one only)"
              : "Select Years (multi)"}
          </p>
          <div className="flex gap-2 flex-wrap">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => toggleYear(year)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedYears.includes(year)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Month select — only for monthly mode */}
        {reportType === "monthly" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Select Months (optional — empty = all)
              </p>
              {selectedMonths.length > 0 && (
                <button
                  onClick={() => setSelectedMonths([])}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {MONTHS.map((month) => (
                <button
                  key={month.value}
                  onClick={() => toggleMonth(month.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedMonths.includes(month.value)
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                  }`}
                >
                  {month.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Printable section ── */}
      <div ref={printRef} className="space-y-5">
        {/* Print header — only visible on print */}
        <div className="hidden print:block mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Revenue Report</h1>
          <p className="text-sm text-slate-500">
            {reportType === "monthly"
              ? `Monthly — ${report?.year}`
              : "Yearly Comparison"}
            {" · "}
            Printed on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : report ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Revenue"
              value={`৳${report.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
            />
            <StatCard
              label="Total Profit"
              value={`৳${report.totalProfit.toLocaleString()}`}
              icon={TrendingUp}
              color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              label="Total Orders"
              value={report.totalOrders.toLocaleString()}
              icon={ShoppingCart}
              color="bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
            />
          </div>
        ) : null}

        {/* Chart + Table */}
        {isLoading ? (
          <Skeleton className="h-72 rounded-2xl" />
        ) : report?.data?.length ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            {/* Toggle */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {reportType === "monthly"
                  ? `Monthly Breakdown — ${report.year}`
                  : "Yearly Breakdown"}
              </h3>
              <button
                onClick={() => setShowProfit((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-400 transition-all"
              >
                {showProfit ? (
                  <ToggleRight className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-slate-400" />
                )}
                {showProfit ? "Showing Profit" : "Showing Revenue"}
              </button>
            </div>

            {/* Bar chart */}
            <div className="h-64 print:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.data} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `৳${v.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `৳${value.toLocaleString()}`,
                      showProfit ? "Profit" : "Revenue",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey={showProfit ? "profit" : "revenue"}
                    fill={showProfit ? "#10b981" : "#3b82f6"}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {reportType === "monthly" ? "Month" : "Year"}
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Orders
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Revenue
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Profit
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Margin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.data.map((row, i) => {
                    const margin =
                      row.revenue > 0
                        ? Math.round((row.profit / row.revenue) * 100)
                        : 0;
                    return (
                      <tr
                        key={i}
                        className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">
                          {row.label}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">
                          {row.orders}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-blue-600">
                          ৳{row.revenue.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">
                          ৳{row.profit.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge
                            className={`text-xs ${
                              margin >= 30
                                ? "bg-emerald-100 text-emerald-700"
                                : margin >= 15
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            } hover:bg-opacity-100`}
                          >
                            {margin}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Total row */}
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-white">
                      Total
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800 dark:text-white">
                      {report.totalOrders}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-blue-600">
                      ৳{report.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600">
                      ৳{report.totalProfit.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs">
                        {report.totalRevenue > 0
                          ? Math.round(
                              (report.totalProfit / report.totalRevenue) * 100,
                            )
                          : 0}
                        %
                      </Badge>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center text-slate-400">
            No data found for selected filters
          </div>
        )}
      </div>
    </div>
  );
}
