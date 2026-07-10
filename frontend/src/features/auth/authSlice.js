import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("krishisetu_user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: localStorage.getItem("krishisetu_access_token"),
  },
  reducers: {
    setCredentials(state, action) {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = user;
      localStorage.setItem("krishisetu_access_token", accessToken);
      localStorage.setItem("krishisetu_user", JSON.stringify(user));
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("krishisetu_access_token");
      localStorage.removeItem("krishisetu_refresh_token");
      localStorage.removeItem("krishisetu_user");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export default authSlice.reducer;
