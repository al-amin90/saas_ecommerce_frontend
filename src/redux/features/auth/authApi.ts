import { baseApi } from "../../api/baseApi";

interface ILoginRequest {
  email: string;
  password: string;
  subdomain: string;
}

interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    // user: IUser;
    accessToken: string;
  };
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // register: builder.mutation<IAuthResponse, IRegisterPayload>({
    //   query: (credentials: IRegisterPayload) => ({
    //     url: "auth/register",
    //     method: "POST",
    //     body: credentials,
    //   }),
    // }),

    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (credentials: ILoginRequest) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;

export default authApi;
