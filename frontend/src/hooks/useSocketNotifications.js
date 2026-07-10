import { useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { pushRealtimeNotification } from "@/features/notification/notificationSlice";

export function useSocketNotifications() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!token) return undefined;
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("notification", (notification) => {
      dispatch(pushRealtimeNotification(notification));
      toast(notification?.title || notification?.message || "New notification");
    });

    return () => socket.disconnect();
  }, [dispatch, token]);
}
