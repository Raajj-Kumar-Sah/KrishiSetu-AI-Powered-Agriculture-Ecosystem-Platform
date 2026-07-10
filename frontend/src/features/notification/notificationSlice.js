import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    realtimeItems: [],
  },
  reducers: {
    pushRealtimeNotification(state, action) {
      state.realtimeItems.unshift(action.payload);
    },
    clearRealtimeNotifications(state) {
      state.realtimeItems = [];
    },
  },
});

export const { pushRealtimeNotification, clearRealtimeNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
