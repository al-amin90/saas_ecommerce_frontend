// sizeChartApi.ts
import { baseApi } from "../../api/baseApi";

const sizeChartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSizeCharts: builder.query({
      query: () => ({ url: "size-chart", method: "GET" }),
      providesTags: ["sizeCharts"],
    }),
    getSizeChartById: builder.query({
      query: (chartId: string) => ({
        url: `size-chart/${chartId}`,
        method: "GET",
      }),
    }),
    createSizeChart: builder.mutation({
      query: (data) => ({ url: "size-chart", method: "POST", body: data }),
      invalidatesTags: ["sizeCharts"],
    }),
    updateSizeChart: builder.mutation({
      query: ({ chartId, data }: { chartId: string; data: unknown }) => ({
        url: `size-chart/${chartId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["sizeCharts"],
    }),
    deleteSizeChart: builder.mutation({
      query: (chartId: string) => ({
        url: `size-chart/${chartId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sizeCharts"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllSizeChartsQuery,
  useGetSizeChartByIdQuery,
  useCreateSizeChartMutation,
  useUpdateSizeChartMutation,
  useDeleteSizeChartMutation,
} = sizeChartApi;
