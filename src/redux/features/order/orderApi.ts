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
      query: () => ({
        url: "order",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    // ── Get Dashboard Stats ───────────────────────────────────────────────
    getOrderStats: builder.query({
      query: () => ({
        url: "order/stats",
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
