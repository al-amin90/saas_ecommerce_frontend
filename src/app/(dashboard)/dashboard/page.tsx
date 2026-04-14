"use client";

import { ShoppingCart, Users, TrendingUp, Package } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/src/components/dashboard/chart/StatsCard";
import PatientsPerDoctorChart from "@/src/components/dashboard/chart/PatientsPerDoctorChart";
import DailyRegistrationChart from "@/src/components/dashboard/chart/DailyRegistrationChart";
import ConditionBreakdownChart from "@/src/components/dashboard/chart/ConditionBreakdownChart";

// Static E-commerce Data
const staticStats = {
  totalOrders: 1247,
  totalCustomers: 584,
  totalRevenue: 2847500,
  averageOrderValue: 2284,
  ordersToday: 23,
  newCustomersToday: 8,
  topProducts: [
    { name: "Nike Air Max 90", orders: 156, revenue: 468000 },
    { name: "Adidas Ultraboost", orders: 142, revenue: 426000 },
    { name: "New Balance 990v6", orders: 128, revenue: 384000 },
    { name: "Vans Old Skool", orders: 115, revenue: 345000 },
    { name: "Clarks Desert Boot", orders: 98, revenue: 294000 },
    { name: "Skechers Go Walk", orders: 87, revenue: 261000 },
    { name: "Timberland 6 Inch", orders: 76, revenue: 228000 },
    { name: "Birkenstock Arizona", orders: 65, revenue: 195000 },
    { name: "Converse Chuck Taylor", orders: 54, revenue: 162000 },
    { name: "Puma RS-X", orders: 48, revenue: 144000 },
  ],
  dailyOrders: [
    { date: "2025-04-05", orders: 18, revenue: 41200 },
    { date: "2025-04-06", orders: 22, revenue: 50300 },
    { date: "2025-04-07", orders: 19, revenue: 43400 },
    { date: "2025-04-08", orders: 25, revenue: 57100 },
    { date: "2025-04-09", orders: 28, revenue: 63900 },
    { date: "2025-04-10", orders: 31, revenue: 70800 },
    { date: "2025-04-11", orders: 26, revenue: 59400 },
    { date: "2025-04-12", orders: 29, revenue: 66200 },
    { date: "2025-04-13", orders: 24, revenue: 54800 },
    { date: "2025-04-14", orders: 23, revenue: 52600 },
  ],
  categoryBreakdown: [
    { category: "Running Shoes", count: 342, percentage: 27.4 },
    { category: "Casual Shoes", count: 298, percentage: 23.9 },
    { category: "Boots", count: 210, percentage: 16.8 },
    { category: "Sandals", count: 187, percentage: 15.0 },
    { category: "Heels & Pumps", count: 168, percentage: 13.5 },
    { category: "Accessories", count: 42, percentage: 3.4 },
  ],
  recentOrders: [
    {
      _id: "ORD-001",
      customerName: "Rahim Ahmed",
      product: "Nike Air Max 90",
      amount: 3890,
      status: "Delivered",
      createdAt: new Date("2025-04-13"),
    },
    {
      _id: "ORD-002",
      customerName: "Fatima Khan",
      product: "Adidas Ultraboost",
      amount: 4500,
      status: "Processing",
      createdAt: new Date("2025-04-13"),
    },
    {
      _id: "ORD-003",
      customerName: "Muhammad Hasan",
      product: "New Balance 990v6",
      amount: 3200,
      status: "Shipped",
      createdAt: new Date("2025-04-12"),
    },
    {
      _id: "ORD-004",
      customerName: "Aisha Begum",
      product: "Vans Old Skool",
      amount: 2890,
      status: "Delivered",
      createdAt: new Date("2025-04-12"),
    },
    {
      _id: "ORD-005",
      customerName: "Hassan Ali",
      product: "Clarks Desert Boot",
      amount: 3100,
      status: "Processing",
      createdAt: new Date("2025-04-11"),
    },
  ],
  recentCustomers: [
    {
      _id: "CUST-001",
      name: "Rahim Ahmed",
      email: "rahim@example.com",
      orders: 5,
      createdAt: new Date("2025-04-10"),
    },
    {
      _id: "CUST-002",
      name: "Fatima Khan",
      email: "fatima@example.com",
      orders: 3,
      createdAt: new Date("2025-04-11"),
    },
    {
      _id: "CUST-003",
      name: "Muhammad Hasan",
      email: "hasan@example.com",
      orders: 8,
      createdAt: new Date("2025-04-12"),
    },
    {
      _id: "CUST-004",
      name: "Aisha Begum",
      email: "aisha@example.com",
      orders: 2,
      createdAt: new Date("2025-04-12"),
    },
    {
      _id: "CUST-005",
      name: "Hassan Ali",
      email: "hassan@example.com",
      orders: 6,
      createdAt: new Date("2025-04-13"),
    },
  ],
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400";
    case "Shipped":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400";
    case "Processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-400";
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value={staticStats.totalOrders}
          subtitle="All time orders"
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Total Customers"
          value={staticStats.totalCustomers}
          subtitle="Registered users"
          icon={Users}
          color="emerald"
        />
        <StatsCard
          title="Total Revenue"
          value={`৳${(staticStats.totalRevenue / 100000).toFixed(1)}L`}
          subtitle="All time revenue"
          icon={TrendingUp}
          color="violet"
        />
        <StatsCard
          title="Avg Order Value"
          value={`৳${staticStats.averageOrderValue.toLocaleString()}`}
          subtitle="Average per order"
          icon={Package}
          color="amber"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              Top Products
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Products by order count
            </p>
          </div>
          <PatientsPerDoctorChart
            data={staticStats.topProducts.map((p) => ({
              name: p.name,
              value: p.orders,
            }))}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              Daily Orders
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Last 10 days performance
            </p>
          </div>
          <DailyRegistrationChart
            data={staticStats.dailyOrders.map((d) => ({
              date: d.date,
              patients: d.orders,
            }))}
          />
        </div>
      </div>

      {/* Charts Row 2 + Recent Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              Category Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Orders by category</p>
          </div>
          <ConditionBreakdownChart
            data={staticStats.categoryBreakdown.map((c) => ({
              condition: c.category,
              count: c.count,
            }))}
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              Recent Orders
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest 5 orders</p>
          </div>
          <div className="space-y-3">
            {staticStats.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {order.product}
                  </p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <p className="text-xs text-slate-400">
                    ৳{order.amount.toLocaleString()}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs h-4 px-1.5 mt-0.5 font-normal ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              Recent Customers
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest 5 registrations
            </p>
          </div>
          <div className="space-y-3">
            {staticStats.recentCustomers.map((customer) => (
              <div key={customer._id} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {customer.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs h-4 px-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-normal"
                  >
                    {customer.orders} orders
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 shrink-0">
                  {format(customer.createdAt, "MMM d")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
