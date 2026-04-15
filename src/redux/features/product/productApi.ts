/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProduct: builder.query<
      { success: boolean; message: string; data: any; meta?: any },
      { url: string }
    >({
      query: ({ url }) => ({ url, method: "GET" }),
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
      invalidatesTags: ["products"],
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
      invalidatesTags: ["products"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductQuery,
  useGetSingleProductQuery,
  useLazyGetProductQuery,
  usePostProductMutation,
  usePutProductMutation,
  usePatchProductMutation,
  useDeleteProductMutation,
} = productApi;
