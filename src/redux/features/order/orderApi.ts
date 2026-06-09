import { baseApi } from "../../api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Create Order ──────────────────────────────────────────────────────
    createOrder: builder.mutation({
      query: (data) => ({
        url: "order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["orders"],
    }),

    // ── Get All Orders (admin) ────────────────────────────────────────────
    getAllOrders: builder.query({
      query: (params: {
        page?: number;
        limit?: number;
        orderStatus?: string;
        paymentStatus?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }) => ({
        url: "order",
        method: "GET",
        // "all" হলে param পাঠাবো না
        params: {
          page: params.page,
          limit: params.limit,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          ...(params.orderStatus && params.orderStatus !== "all"
            ? { orderStatus: params.orderStatus }
            : {}),
          ...(params.paymentStatus && params.paymentStatus !== "all"
            ? { paymentStatus: params.paymentStatus }
            : {}),
        },
      }),
      providesTags: ["orders"],
    }),

    // ── Get Dashboard Stats ───────────────────────────────────────────────
    getOrderStats: builder.query({
      query: (dateRange = "lifetime") => ({
        url: `order/stats?dateRange=${dateRange}`,
        method: "GET",
      }),
      providesTags: ["orderStats"],
    }),

    // ── Update Order Status ───────────────────────────────────────────────
    updateOrderStatus: builder.mutation({
      query: ({
        orderId,
        orderStatus,
        paymentStatus,
      }: {
        orderId: string;
        orderStatus?: string;
        paymentStatus?: string;
      }) => ({
        url: `order/${orderId}/status`,
        method: "PATCH",
        body: { orderStatus, paymentStatus },
      }),
      invalidatesTags: ["orders", "singleOrder", "orderStats"],
    }),

    // ✅ Submit bulk orders
    submitBulkOrders: builder.mutation({
      query: ({ orderIds, deliveryMethodId }) => ({
        url: "/order/submit-bulk",
        method: "POST",
        body: { orderIds, deliveryMethodId },
      }),
      invalidatesTags: ["orders"],
    }),

    getRevenueReport: builder.query({
      query: (params: {
        type: "monthly" | "yearly" | "daily";
        years?: string;
        months?: string;
        startDate?: string;
        endDate?: string;
      }) => ({
        url: "order/report/revenue",
        method: "GET",
        params,
      }),
      providesTags: ["orderStats"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useSubmitBulkOrdersMutation,
  useGetRevenueReportQuery,
} = orderApi;
