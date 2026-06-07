"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  LayoutList,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/src/redux/features/order/orderApi";
import DataTable from "@/src/components/dashboard/shared/DataTable";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import Pagination from "@/src/components/dashboard/shared/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────

interface IOrderItem {
  productId: { _id: string; name: string; images: string[]; price: number };
  quantity: number;
  selectedSize: string;
  colorId: { _id: string; name: string; color: string };
  price: number;
}

interface IOrderRow {
  _id: string;
  orderNumber: string;
  guestCheckout: boolean;
  guestEmail?: string;
  guestInfo?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  userId?: { name: string; email: string };
  items: IOrderItem[];
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

interface IMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

// ── Config ────────────────────────────────────────────────────────────────────

// ORDER_STATUSES config update করো — icon যোগ করো
const ORDER_STATUSES = [
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    dot: "bg-yellow-400",
    bar: "bg-yellow-500",
    text: "text-yellow-700",
    activeBg: "bg-yellow-500",
    activeText: "text-white",
  },
  {
    key: "processing",
    label: "Processing",
    icon: Package,
    dot: "bg-blue-400",
    bar: "bg-blue-500",
    text: "text-blue-700",
    activeBg: "bg-blue-600",
    activeText: "text-white",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
    dot: "bg-purple-400",
    bar: "bg-purple-500",
    text: "text-purple-700",
    activeBg: "bg-purple-600",
    activeText: "text-white",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
    dot: "bg-emerald-400",
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    activeBg: "bg-emerald-600",
    activeText: "text-white",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    dot: "bg-red-400",
    bar: "bg-red-500",
    text: "text-red-700",
    activeBg: "bg-red-500",
    activeText: "text-white",
  },
];

const ORDER_STATUS_BADGE: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  shipped:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const PAYMENT_STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

const ORDER_STATUSES_LIST = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES_LIST = ["pending", "completed", "failed"];

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderDetailModal({
  order,
  open,
  onOpenChange,
  onStatusUpdate,
  isUpdating,
}: {
  order: IOrderRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onStatusUpdate: (
    orderId: string,
    orderStatus?: string,
    paymentStatus?: string,
  ) => void;
  isUpdating: boolean;
}) {
  if (!order) return null;

  const customerName =
    order.guestInfo?.fullName ?? order.userId?.name ?? "Unknown";
  const customerEmail = order.guestEmail ?? order.userId?.email ?? "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white text-sm font-mono">
            {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Customer
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {customerName}
            </p>
            <p className="text-xs text-slate-400">{customerEmail}</p>
            {order.guestInfo && (
              <>
                <p className="text-xs text-slate-400">
                  {order.guestInfo.phone}
                </p>
                <p className="text-xs text-slate-400">
                  {order.guestInfo.address}, {order.guestInfo.city}
                  {order.guestInfo.postalCode &&
                    ` - ${order.guestInfo.postalCode}`}
                </p>
              </>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Items ({order.items.length})
            </p>
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                  {item.productId?.images?.[0] ? (
                    <Image
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                    {item.productId?.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300 flex-shrink-0"
                      style={{ backgroundColor: item.colorId?.color }}
                    />
                    <p className="text-xs text-slate-400">
                      {item.colorId?.name} · Size {item.selectedSize} · Qty{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-white flex-shrink-0">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Total
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-white">
              ৳{order.totalPrice.toLocaleString()}
            </span>
          </div>

          {/* Status Update */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Order Status
              </p>
              <Select
                defaultValue={order.orderStatus}
                onValueChange={(v) => onStatusUpdate(order._id, v, undefined)}
                disabled={isUpdating}
              >
                <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  {ORDER_STATUSES_LIST.map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="capitalize text-sm"
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Payment Status
              </p>
              <Select
                defaultValue={order.paymentStatus}
                onValueChange={(v) => onStatusUpdate(order._id, undefined, v)}
                disabled={isUpdating}
              >
                <SelectTrigger className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  {PAYMENT_STATUSES_LIST.map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="capitalize text-sm"
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<IOrderRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit: 10,
    orderStatus,
    paymentStatus,
    sortBy: "createdAt",
    sortOrder,
  });

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orders: IOrderRow[] = data?.data ?? [];
  const meta = data?.meta as IMeta | undefined;

  // ── Client-side search ────────────────────────────────────────────────────
  const filteredOrders = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      (o.guestInfo?.fullName ?? "").toLowerCase().includes(q) ||
      (o.guestEmail ?? "").toLowerCase().includes(q) ||
      (o.guestInfo?.phone ?? "").includes(q)
    );
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStatusFilter = (key: string) => {
    setOrderStatus(key);
    setPage(1);
  };

  const handleStatusUpdate = async (
    orderId: string,
    newOrderStatus?: string,
    newPaymentStatus?: string,
  ) => {
    try {
      await updateOrderStatus({
        orderId,
        orderStatus: newOrderStatus,
        paymentStatus: newPaymentStatus,
      }).unwrap();
      toast.success("Status updated");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? "Failed to update");
    }
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    {
      key: "orderNumber",
      label: "Order",
      render: (row: IOrderRow) => (
        <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (row: IOrderRow) => (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {row.guestInfo?.fullName ?? row.userId?.name ?? "Unknown"}
          </p>
          <p className="text-xs text-slate-400">{row.guestInfo?.city ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row: IOrderRow) => (
        <div className="flex items-center gap-1.5">
          {row.items[0]?.productId?.images?.[0] && (
            <div className="relative w-7 h-7 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
              <Image
                src={row.items[0].productId.images[0]}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
              {row.items[0]?.productId?.name}
            </p>
            {row.items.length > 1 && (
              <p className="text-xs text-slate-400">
                +{row.items.length - 1} more
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "totalPrice",
      label: "Total",
      render: (row: IOrderRow) => (
        <span className="text-sm font-bold text-slate-800 dark:text-white">
          ৳{row.totalPrice.toLocaleString()}
        </span>
      ),
    },
    {
      key: "orderStatus",
      label: "Status",
      render: (row: IOrderRow) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ORDER_STATUS_BADGE[row.orderStatus]}`}
        >
          {row.orderStatus}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (row: IOrderRow) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${PAYMENT_STATUS_BADGE[row.paymentStatus]}`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row: IOrderRow) => (
        <span className="text-xs text-slate-400">
          {format(new Date(row.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      headClassName: "text-right",
      render: (row: IOrderRow) => (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(row);
              setDetailOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeadingTitle name="Orders" meta={{ total: meta?.total ?? 0 }} />
      </div>

      {/* ── Status Tab Navigation ── */}
      {/* ── Status Navigation ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 flex gap-1 flex-wrap">
        {ORDER_STATUSES.map((s) => {
          const Icon = s.icon;
          const count =
            s.key === "all"
              ? meta?.total
              : (meta?.[s.key as keyof IMeta] as number | undefined);
          const isActive = orderStatus === s.key;

          return (
            <button
              key={s.key}
              onClick={() => handleStatusFilter(s.key)}
              className={`relative flex items-center cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex-1 min-w-fit justify-center sm:justify-start ${
                isActive
                  ? `${s.activeBg} ${s.activeText} shadow-md shadow-black/10 scale-[1.02]`
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {/* Icon */}
              <Icon
                className={`h-3.5 w-3.5 flex-shrink-0 ${
                  isActive ? s.activeText : s.text
                }`}
              />

              {/* Label */}
              <span className="hidden sm:block capitalize whitespace-nowrap">
                {s.label}
              </span>

              {/* Count badge */}
              <span
                className={`ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-white/25 text-white"
                    : `bg-slate-100 dark:bg-slate-800 ${s.text}`
                }`}
              >
                {count ?? 0}
              </span>

              {/* Active bottom bar */}
              {isActive && (
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 ${s.bar} rounded-full`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Filters Row ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, order #, phone..."
            className="pl-9 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          />
        </div>

        {/* Payment filter */}
        <select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-300"
        >
          <option value="all">All Payment</option>
          {PAYMENT_STATUSES_LIST.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* Sort toggle */}
        <button
          onClick={() => setSortOrder((p) => (p === "desc" ? "asc" : "desc"))}
          className="h-9 px-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:border-slate-400 transition-colors"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {sortOrder === "desc" ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* ── Table ── */}
      <DataTable
        data={filteredOrders}
        columns={columns}
        isLoading={isLoading}
        rowKey={(r) => r._id}
        emptyMessage="No orders found."
        onRowClick={(row) => {
          setSelectedOrder(row);
          setDetailOpen(true);
        }}
      />

      {/* ── Pagination ── */}
      {meta && meta.totalPage > 1 && (
        <Pagination
          page={page}
          totalPage={meta.totalPage}
          onPageChange={setPage}
        />
      )}

      {/* ── Detail Modal ── */}
      <OrderDetailModal
        order={selectedOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
}
