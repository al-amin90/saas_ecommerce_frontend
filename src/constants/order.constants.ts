/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// ============================================================
// 1. STATUS ARRAYS (Must match backend exactly)
// ============================================================

export const VALID_ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "delivery_failed",
] as const;

export const VALID_PAYMENT_STATUSES = [
  "pending",
  "completed",
  "paid",
  "refunded",
  "failed",
] as const;

// ============================================================
// 2. TYPE DEFINITIONS
// ============================================================

export type OrderStatus = (typeof VALID_ORDER_STATUSES)[number];
export type PaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

// ============================================================
// 3. ORDER STATUS CONFIG
// ============================================================

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    icon: any;
    dot: string;
    bar: string;
    text: string;
    activeBg: string;
    activeText: string;
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    dot: "bg-yellow-400",
    bar: "bg-yellow-500",
    text: "text-yellow-700",
    activeBg: "bg-yellow-500",
    activeText: "text-white",
  },
  processing: {
    label: "Processing",
    icon: Package,
    dot: "bg-blue-400",
    bar: "bg-blue-500",
    text: "text-blue-700",
    activeBg: "bg-blue-600",
    activeText: "text-white",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    dot: "bg-purple-400",
    bar: "bg-purple-500",
    text: "text-purple-700",
    activeBg: "bg-purple-600",
    activeText: "text-white",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    dot: "bg-emerald-400",
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    activeBg: "bg-emerald-600",
    activeText: "text-white",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    dot: "bg-red-400",
    bar: "bg-red-500",
    text: "text-red-700",
    activeBg: "bg-red-500",
    activeText: "text-white",
  },
  returned: {
    label: "Returned",
    icon: RefreshCw,
    dot: "bg-orange-400",
    bar: "bg-orange-500",
    text: "text-orange-700",
    activeBg: "bg-orange-500",
    activeText: "text-white",
  },
  delivery_failed: {
    label: "Delivery Failed",
    icon: AlertCircle,
    dot: "bg-rose-400",
    bar: "bg-rose-500",
    text: "text-rose-700",
    activeBg: "bg-rose-500",
    activeText: "text-white",
  },
};

// ============================================================
// 4. PAYMENT STATUS CONFIG
// ============================================================

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  {
    label: string;
    badge: string;
    icon?: any;
  }
> = {
  pending: {
    label: "Pending",
    badge:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  paid: {
    label: "Paid",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  refunded: {
    label: "Refunded",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    icon: RefreshCw,
  },
  failed: {
    label: "Failed",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    icon: XCircle,
  },
};

// ============================================================
// 5. BADGE MAPPINGS (Quick access for tables)
// ============================================================

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  shipped:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  returned:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  delivery_failed:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
};

export const PAYMENT_STATUS_BADGE: Record<PaymentStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  refunded:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

// ============================================================
// 6. STATUS LISTS (For Select dropdowns)
// ============================================================

export const ORDER_STATUSES_LIST = VALID_ORDER_STATUSES;
export const PAYMENT_STATUSES_LIST = VALID_PAYMENT_STATUSES;

// ============================================================
// 7. HELPER FUNCTIONS
// ============================================================

/**
 * Check if a string is a valid order status
 */
export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return VALID_ORDER_STATUSES.includes(status as OrderStatus);
};

/**
 * Check if a string is a valid payment status
 */
export const isValidPaymentStatus = (
  status: string,
): status is PaymentStatus => {
  return VALID_PAYMENT_STATUSES.includes(status as PaymentStatus);
};

/**
 * Get order status label
 */
export const getOrderStatusLabel = (status: OrderStatus): string => {
  return ORDER_STATUS_CONFIG[status]?.label || status;
};

/**
 * Get payment status label
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  return PAYMENT_STATUS_CONFIG[status]?.label || status;
};

/**
 * Get order status badge class
 */
export const getOrderStatusBadge = (status: OrderStatus): string => {
  return ORDER_STATUS_BADGE[status] || "bg-gray-100 text-gray-700";
};

/**
 * Get payment status badge class
 */
export const getPaymentStatusBadge = (status: PaymentStatus): string => {
  return PAYMENT_STATUS_BADGE[status] || "bg-gray-100 text-gray-700";
};

// ============================================================
// 8. DEFAULT VALUES
// ============================================================

export const DEFAULT_ORDER_STATUS: OrderStatus = "pending";
export const DEFAULT_PAYMENT_STATUS: PaymentStatus = "pending";

// ============================================================
// 9. ORDER STATUS OPTIONS (For form selects with labels)
// ============================================================

export const ORDER_STATUS_OPTIONS = VALID_ORDER_STATUSES.map((status) => ({
  value: status,
  label: ORDER_STATUS_CONFIG[status]?.label || status,
}));

export const PAYMENT_STATUS_OPTIONS = VALID_PAYMENT_STATUSES.map((status) => ({
  value: status,
  label: PAYMENT_STATUS_CONFIG[status]?.label || status,
}));

// ============================================================
// 10. STATUS TRANSITIONS (Optional - for workflow rules)
// ============================================================

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled", "returned", "delivery_failed"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
  delivery_failed: ["cancelled"],
};

export const PAYMENT_STATUS_TRANSITIONS: Record<
  PaymentStatus,
  PaymentStatus[]
> = {
  pending: ["completed", "paid", "failed"],
  completed: ["refunded"],
  paid: ["refunded", "failed"],
  refunded: [],
  failed: ["pending"],
};
