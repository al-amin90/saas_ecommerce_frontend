/* eslint-disable @typescript-eslint/no-explicit-any */
// import { RootState } from "@reduxjs/toolkit/query";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { toast } from "sonner";
import { logoutUser } from "../features/auth/authSlice";
import { removeToken } from "@/src/utils/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_Backend_SITE_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    let token = state?.auth?.accessToken;

    if (typeof window === "undefined") {
      return headers;
    }

    if (!token) {
      try {
        const raw = localStorage.getItem("persist:auth");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed.token ? JSON.parse(parsed.token) : null;
        }
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let tenantID;

    const tenantType = process.env.NEXT_PUBLIC_TENANCY_TYPE;
    console.log("tenantType", tenantType);

    if (tenantType === "single") {
      tenantID = "bazar";
    } else {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");

      //   tenantID = state?.auth?.user?.tenant || state?.tenant?.id || null;

      tenantID = parts[0];

      if (!tenantID) {
        console.warn("⚠️ Multi-tenant mode but tenantID not found!");
      }
    }

    console.log("tenantID", tenantID);
    if (tenantID) {
      headers.set("x-tenant", tenantID);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: string | FetchArgs, api: any, extraOptions?: any) => {
  const result = await baseQuery(args, api, extraOptions);
  console.log("result", result);

  if (result?.error?.status === 401) {
    const errorData = result?.error?.data as { message?: string } | undefined;
    toast.error(
      errorData?.message || "Your session has expired. Please login again.",
    );
    removeToken();
    api.dispatch(logoutUser());

    localStorage.removeItem("persist:auth");
    // document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    window.location.href = "/login";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "auth",
    "category",
    // "product",
    "color",
    "products",
    "singleProduct",
    "sizeCharts",
    "orders",
    "singleOrder",
    "orderStats",
    "deliveryMethod",
  ],
  endpoints: () => ({}),
});
