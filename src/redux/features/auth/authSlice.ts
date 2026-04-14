/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@/modules/auth/auth.interface";
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TAuthState = {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
};

const initialState: TAuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: any; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const selectToken = (state: RootState) => state?.auth?.accessToken;
export const selectUser = (state: RootState) => state.auth.user;

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
