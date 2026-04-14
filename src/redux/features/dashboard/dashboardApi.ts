import { TApiResponse, TDashboardStats } from "@/lib/types";
import { baseApi } from "@/redux/api/baseApi";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<TApiResponse<TDashboardStats>, void>({
      query: () => "/dashboard/stat",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
