"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, Search, ArrowUpDown, RefreshCw, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  useSubmitBulkOrdersMutation,
} from "@/src/redux/features/order/orderApi";
import DataTable from "@/src/components/dashboard/shared/DataTable";
import PageHeadingTitle from "@/src/components/dashboard/shared/PageHeadingTitle";
import Pagination from "@/src/components/dashboard/shared/Pagination";
import {
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  ORDER_STATUS_BADGE,
  PAYMENT_STATUS_BADGE,
  ORDER_STATUSES_LIST,
  PAYMENT_STATUSES_LIST,
  OrderStatus,
  PaymentStatus,
} from "@/src/constants/order.constants";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface IOrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  colorId: {
    _id: string;
    name: string;
    color: string;
  };
  quantity: number;
  price: number;
  selectedSize: string;
}

export interface IOrderRow {
  _id: string;
  orderNumber: string;
  guestCheckout: boolean;
  guestEmail: string;
  guestInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  userId: { name: string; email: string } | null;
  items: IOrderItem[];
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  courier: {
    consignmentId?: string;
  };
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
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
  returned: number;
  delivery_failed: number;
}

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
    orderStatus?: OrderStatus,
    paymentStatus?: PaymentStatus,
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
                onValueChange={(v) =>
                  onStatusUpdate(order._id, v as OrderStatus, undefined)
                }
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
                      {ORDER_STATUS_CONFIG[s]?.label || s}
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
                onValueChange={(v) =>
                  onStatusUpdate(order._id, undefined, v as PaymentStatus)
                }
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
                      {PAYMENT_STATUS_CONFIG[s]?.label || s}
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
  const [orderStatus, setOrderStatus] = useState<string>("all");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<IOrderRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [limit, setLimit] = useState(10);

  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );

  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit,
    orderStatus: orderStatus === "all" ? undefined : orderStatus,
    paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
    sortBy: "createdAt",
    sortOrder,
  });

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const [submitBulkOrders, { isLoading: isSubmittingBulk }] =
    useSubmitBulkOrdersMutation();

  const orders: IOrderRow[] = data?.data ?? [];
  console.log("orders", orders);
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
    newOrderStatus?: OrderStatus,
    newPaymentStatus?: PaymentStatus,
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

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrderIds);

    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }

    setSelectedOrderIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((order) => order._id)));
    }
  };

  const handleSubmitBulk = async () => {
    if (selectedOrderIds.size === 0) {
      toast.error("Select at least one order");
      return;
    }

    try {
      await submitBulkOrders({
        orderIds: Array.from(selectedOrderIds),
      }).unwrap();

      toast.success(`${selectedOrderIds.size} order(s) submitted to courier`);

      setSelectedOrderIds(new Set());
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? "Failed to submit orders");
    }
  };

  // ── Get status configs ────────────────────────────────────────────────────
  const orderStatusConfigs = Object.entries(ORDER_STATUS_CONFIG).map(
    ([key, config]) => ({
      key,
      ...config,
    }),
  );

  const orderStatusList = orderStatusConfigs.map((s) => ({
    key: s.key,
    label: s.label,
    icon: s.icon,
    dot: s.dot,
    bar: s.bar,
    text: s.text,
    activeBg: s.activeBg,
    activeText: s.activeText,
  }));
  const orderStatusList = orderStatusConfigs.map((s) => ({
    key: s.key,
    label: s.label,
    icon: s.icon,
    dot: s.dot,
    bar: s.bar,
    text: s.text,
    activeBg: s.activeBg,
    activeText: s.activeText,
  }));

  // ── Columns ───────────────────────────────────────────────────────────────
  // const columns = [
  //   {
  //     key: "checkbox",
  //     label: (
  //       <Checkbox
  //         checked={
  //           filteredOrders.length > 0 &&
  //           selectedOrderIds.size === filteredOrders.length
  //         }
  //         onCheckedChange={handleSelectAll}
  //         className="rounded"
  //       />
  //     ),
  //     render: (row: IOrderRow) => (
  //       <Checkbox
  //         checked={selectedOrderIds.has(row._id)}
  //         onCheckedChange={() => handleSelectOrder(row._id)}
  //         className="rounded"
  //         onClick={(e) => e.stopPropagation()}
  //       />
  //     ),
  //   },
  //   {
  //     key: "orderNumber",
  //     label: "Order #",
  //     render: (row: IOrderRow) => (
  //       <div>
  //         <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold block">
  //           {row.orderNumber}
  //         </span>
  //         <span className="text-xs text-slate-400">
  //           {format(new Date(row.createdAt), "MMM d, yyyy")}
  //         </span>{" "}
  //         <br />
  //         {row?.courier?.consignmentId && (
  //           <span className="text-xs ">CN#{row.courier.consignmentId}</span>
  //         )}
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "customer",
  //     label: "Customer",
  //     render: (row: IOrderRow) => (
  //       <div className="min-w-[160px]">
  //         <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
  //           {row.guestInfo?.fullName ?? row.userId?.name ?? "Unknown"}
  //         </p>
  //         <p className="text-xs text-slate-400 mt-0.5">
  //           {row.guestEmail || row.userId?.email || "—"}
  //         </p>
  //         <div className="flex items-center gap-1 mt-1">
  //           <span className="text-xs text-slate-500">📍</span>
  //           <span className="text-xs text-slate-500">
  //             {[
  //               row.guestInfo?.address,
  //               row.guestInfo?.city,
  //               row.guestInfo?.postalCode,
  //             ]
  //               .filter(Boolean)
  //               .join(", ")}
  //           </span>
  //         </div>
  //         <p className="text-xs text-slate-400 mt-0.5">
  //           📞 {row.guestInfo?.phone ?? "—"}
  //         </p>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "items",
  //     label: "Order Items",
  //     render: (row: IOrderRow) => (
  //       <div className="flex flex-col gap-2 min-w-[260px] max-w-[320px]">
  //         {row.items.map((item, i) => (
  //           <div key={item._id ?? i} className="flex items-center gap-2">
  //             <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 dark:border-slate-700">
  //               {item.productId?.images?.[0] ? (
  //                 <Image
  //                   src={item.productId.images[0]}
  //                   alt={item.productId?.name ?? ""}
  //                   fill
  //                   className="object-cover"
  //                 />
  //               ) : (
  //                 <div className="w-full h-full flex items-center justify-center text-slate-300 text-lg">
  //                   📦
  //                 </div>
  //               )}
  //             </div>
  //             <div className="flex-1 min-w-0">
  //               <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
  //                 {item.productId?.name ?? "—"}
  //               </p>
  //               <div className="flex items-center gap-2 mt-0.5 flex-wrap">
  //                 {item.colorId?.color && (
  //                   <span className="flex items-center gap-1 text-xs text-slate-400">
  //                     <span
  //                       className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block flex-shrink-0"
  //                       style={{ background: item.colorId.color }}
  //                     />
  //                     {item.colorId.name}
  //                   </span>
  //                 )}
  //                 {item.selectedSize && (
  //                   <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono">
  //                     {item.selectedSize}
  //                   </span>
  //                 )}
  //                 <span className="text-xs text-slate-400">
  //                   ×{item.quantity}
  //                 </span>
  //                 <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
  //                   ৳{(item.price * item.quantity).toLocaleString()}
  //                 </span>
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "totalPrice",
  //     label: "Total",
  //     render: (row: IOrderRow) => (
  //       <div className="min-w-[80px]">
  //         <span className="text-sm font-bold text-slate-800 dark:text-white block">
  //           ৳{row.totalPrice.toLocaleString()}
  //         </span>
  //         <span className="text-xs text-slate-400 capitalize">
  //           {row.paymentMethod}
  //         </span>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "orderStatus",
  //     label: "Status",
  //     render: (row: IOrderRow) => (
  //       <div className="flex flex-col gap-1.5 min-w-[100px]">
  //         <span
  //           className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize w-fit ${ORDER_STATUS_BADGE[row.orderStatus]}`}
  //         >
  //           {ORDER_STATUS_CONFIG[row.orderStatus]?.label || row.orderStatus}
  //         </span>
  //         <span
  //           className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize w-fit ${PAYMENT_STATUS_BADGE[row.paymentStatus]}`}
  //         >
  //           {PAYMENT_STATUS_CONFIG[row.paymentStatus]?.label ||
  //             row.paymentStatus}
  //         </span>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "actions",
  //     label: "",
  //     headClassName: "text-right",
  //     render: (row: IOrderRow) => (
  //       <div className="flex justify-end">
  //         <button
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             setSelectedOrder(row);
  //             setDetailOpen(true);
  //           }}
  //           className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
  //         >
  //           <Eye className="h-4 w-4" />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeadingTitle name="Orders" meta={{ total: meta?.total ?? 0 }} />
      </div>

      {selectedOrderIds.size > 0 && (
        <div className="sticky top-4 z-20">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                📦
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {selectedOrderIds.size} Orders Selected
                </p>
                <p className="text-xs text-slate-500">
                  Ready to submit to courier
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedOrderIds(new Set())}
                className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm"
              >
                Clear
              </button>

              <button
                onClick={handleSubmitBulk}
                disabled={isSubmittingBulk}
                className="h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium"
              >
                {isSubmittingBulk ? "Submitting..." : "Submit Orders"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Status Tab Navigation ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 flex gap-1 flex-wrap">
        {/* All statuses tab */}
        <button
          onClick={() => handleStatusFilter("all")}
          className={`relative flex items-center cursor-pointer gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex-1 min-w-fit justify-center sm:justify-start ${
            orderStatus === "all"
              ? "bg-slate-800 text-white shadow-md shadow-black/10 scale-[1.02]"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <LayoutList className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="hidden sm:block whitespace-nowrap">All</span>
          <span
            className={`ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-black flex items-center justify-center transition-all ${
              orderStatus === "all"
                ? "bg-white/25 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {meta?.total ?? 0}
          </span>
        </button>

        {/* Individual status tabs */}
        {orderStatusList.map((s) => {
          const Icon = s.icon;
          const count = meta?.[s.key as keyof IMeta] as number | undefined;
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
              <Icon
                className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? s.activeText : s.text}`}
              />
              <span className="hidden sm:block capitalize whitespace-nowrap">
                {s.label}
              </span>
              <span
                className={`ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-white/25 text-white"
                    : `bg-slate-100 dark:bg-slate-800 ${s.text}`
                }`}
              >
                {count ?? 0}
              </span>
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
              {PAYMENT_STATUS_CONFIG[s]?.label || s}
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
      {meta && meta.totalPage >= 1 && (
        <Pagination
          page={page}
          totalPage={meta.totalPage}
          total={meta.total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
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
