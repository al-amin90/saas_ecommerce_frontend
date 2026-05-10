/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<unknown, { url: string; data: unknown }>({
      query: ({ url, data }) => ({
        url,
        method: "POST",
        body: data,
      }),
    }),
    // getProduct: builder.query<
    //   { success: boolean; message: string; data: any; meta?: any },
    //   { url: string; params?: Record<string, any> }
    // >({
    //   query: ({ url, params }) => ({ url, params, method: "GET" }),
    //   providesTags: ["products"],
    // }),
    // getSingleProduct: builder.query({
    //   query: ({ url }) => ({
    //     url: url,
    //     method: "GET",
    //   }),
    //   providesTags: ["singleProduct"],
    // }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation } = orderApi;
