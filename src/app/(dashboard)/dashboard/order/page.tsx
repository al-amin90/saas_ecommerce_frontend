"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  useGetDynamicQuery,
  usePatchDynamicMutation,
} from "@/src/redux/features/dynamic/dynamicApi";
import DataTable from "@/src/components/dashboard/shared/DataTable";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import Image from "next/image";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/src/redux/features/order/orderApi";

// ── Types ─────────────────────────────────────────────────────────────────────

interface IOrderItem {
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  selectedSize: string;
  selectedColor: string;
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

// ── Config ────────────────────────────────────────────────────────────────────

const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const paymentStatuses = ["pending", "completed", "failed"];

const orderStatusColor: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
  processing:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  shipped:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
};

const paymentStatusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

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
          <DialogTitle className="text-slate-800 dark:text-white text-sm">
            Order —{" "}
            <span className="font-mono text-blue-600">{order.orderNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer info */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
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
                  {order.guestInfo.address}, {order.guestInfo.city}{" "}
                  {order.guestInfo.postalCode}
                </p>
              </>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Items
            </p>
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
              >
                {item.productId?.images?.[0] ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                    <Image
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                    {item.productId?.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Size: {item.selectedSize} · Color: {item.selectedColor} ·
                    Qty: {item.quantity}
                  </p>
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
              <p className="text-xs font-semibold text-slate-500">
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
                  {orderStatuses.map((s) => (
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
              <p className="text-xs font-semibold text-slate-500">
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
                  {paymentStatuses.map((s) => (
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
  const [selectedOrder, setSelectedOrder] = useState<IOrderRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAllOrdersQuery(undefined);

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  console.log("data", data);
  const orders: IOrderRow[] = data?.data ?? [];

  // ── Filter ────────────────────────────────────────────────────────────────

  const filteredOrders = orders.filter((o) => {
    const matchStatus =
      statusFilter === "all" || o.orderStatus === statusFilter;

    const searchLower = search.toLowerCase();
    const customerName = (
      o.guestInfo?.fullName ??
      o.userId?.name ??
      ""
    ).toLowerCase();
    const matchSearch =
      !search ||
      customerName.includes(searchLower) ||
      o.orderNumber.toLowerCase().includes(searchLower) ||
      (o.guestEmail ?? "").toLowerCase().includes(searchLower);

    return matchStatus && matchSearch;
  });

  // ── Status update handler ─────────────────────────────────────────────────

  const handleStatusUpdate = async (
    orderId: string,
    orderStatus?: string,
    paymentStatus?: string,
  ) => {
    try {
      await updateOrderStatus({ orderId, orderStatus, paymentStatus }).unwrap();
      toast.success("Status updated");
    } catch (err: unknown) {
      console.log("err", err);
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
        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
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
          <p className="text-xs text-slate-400">
            {row.guestEmail ?? row.userId?.email ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row: IOrderRow) => (
        <span className="text-sm text-slate-500">
          {row.items.length} item{row.items.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "totalPrice",
      label: "Total",
      render: (row: IOrderRow) => (
        <span className="text-sm font-semibold text-slate-800 dark:text-white">
          ৳{row.totalPrice.toLocaleString()}
        </span>
      ),
    },
    {
      key: "orderStatus",
      label: "Order Status",
      render: (row: IOrderRow) => (
        <Badge
          variant="secondary"
          className={`text-xs capitalize ${orderStatusColor[row.orderStatus]}`}
        >
          {row.orderStatus}
        </Badge>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (row: IOrderRow) => (
        <Badge
          variant="secondary"
          className={`text-xs capitalize ${paymentStatusColor[row.paymentStatus]}`}
        >
          {row.paymentStatus}
        </Badge>
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(row);
              setDetailOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeadingTitle
          name="Orders"
          meta={{ total: filteredOrders.length }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, order #, email..."
            className="pl-9 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          />
        </div>

        {/* Status filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-44 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900">
            <SelectItem value="all">All Status</SelectItem>
            {orderStatuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
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

      {/* Detail Modal */}
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
