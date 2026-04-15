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
        const raw = localStorage.getItem("persist:authInfo");
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

  if (result?.error?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("persist:authInfo");
    window.location.href = "/login";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["auth", "category", "products", "singleProduct"],
  endpoints: () => ({}),
});
