/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProduct: builder.query<
      { success: boolean; message: string; data: any; meta?: any },
      { url: string; params?: Record<string, any> }
    >({
      query: ({ url, params }) => ({ url, params, method: "GET" }),
      providesTags: ["products"],
    }),

    getSingleProduct: builder.query({
      query: ({ url, id }) => ({
        url: `${url}/${id}`,
        method: "GET",
      }),
      providesTags: ["singleProduct"],
    }),

    postProduct: builder.mutation({
      query: ({ url, data }) => ({ url, method: "POST", body: data }),
      invalidatesTags: ["products", "singleProduct"],
    }),

    patchProduct: builder.mutation({
      query: ({ url, data }) => ({ url, method: "PATCH", body: data }),
      invalidatesTags: ["products", "singleProduct"],
    }),

    putProduct: builder.mutation({
      query: ({ url, data }) => ({ url, method: "PUT", body: data }),
      invalidatesTags: ["products", "singleProduct"],
    }),

    deleteProduct: builder.mutation({
      query: ({ url }) => ({ url, method: "DELETE" }),
      invalidatesTags: ["products", "singleProduct"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductQuery,
  useGetSingleProductQuery,
  useDeleteProductMutation,
  usePatchProductMutation,
  usePostProductMutation,
  usePutProductMutation,
} = productApi;
