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

    // ── Get Order By ID ───────────────────────────────────────────────────
    getOrderById: builder.query({
      query: (orderId: string) => ({
        url: `order/${orderId}`,
        method: "GET",
      }),
      providesTags: ["singleOrder"],
    }),

    // ── Get Guest Order ───────────────────────────────────────────────────
    getGuestOrder: builder.query({
      query: ({ email, orderId }: { email: string; orderId: string }) => ({
        url: "order/guest",
        method: "GET",
        params: { email, orderId },
      }),
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

    // ── Cancel Order ──────────────────────────────────────────────────────
    cancelOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `order/${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["orders", "singleOrder", "orderStats"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetGuestOrderQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApi;
