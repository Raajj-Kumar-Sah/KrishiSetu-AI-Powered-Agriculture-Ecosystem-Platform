import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/api/axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth", "Crop", "Equipment", "Cart", "Wishlist", "Order", "Booking", "Store", "Notification", "AI", "Delivery"],
  endpoints: (builder) => ({
    login: builder.mutation({ query: (data) => ({ url: "/auth/login", method: "POST", data }), invalidatesTags: ["Auth"] }),
    register: builder.mutation({ query: (data) => ({ url: "/auth/register", method: "POST", data }), invalidatesTags: ["Auth"] }),
    me: builder.query({ query: () => ({ url: "/auth/me" }), providesTags: ["Auth"] }),
    logout: builder.mutation({ query: () => ({ url: "/auth/logout", method: "POST" }), invalidatesTags: ["Auth"] }),

    crops: builder.query({
      query: (params = {}) => {
        const { keyword, category, ...rest } = params;
        if (keyword) return { url: "/crops/search", params: { keyword } };
        if (category) return { url: `/crops/category/${category}` };
        return { url: "/crops", params: rest };
      },
      providesTags: ["Crop"],
    }),
    featuredCrops: builder.query({ query: () => ({ url: "/crops/featured" }), providesTags: ["Crop"] }),
    crop: builder.query({ query: (id) => ({ url: `/crops/${id}` }), providesTags: ["Crop"] }),

    equipment: builder.query({
      query: (params = {}) => {
        const { keyword, equipmentType, ...rest } = params;
        if (keyword) return { url: "/equipment/search", params: { keyword } };
        if (equipmentType) return { url: `/equipment/type/${equipmentType}` };
        return { url: "/equipment", params: rest };
      },
      providesTags: ["Equipment"],
    }),
    featuredEquipment: builder.query({ query: () => ({ url: "/equipment/featured" }), providesTags: ["Equipment"] }),
    equipmentById: builder.query({ query: (id) => ({ url: `/equipment/${id}` }), providesTags: ["Equipment"] }),
    createBooking: builder.mutation({ query: ({ equipmentId, ...data }) => ({ url: `/bookings/equipment/${equipmentId}`, method: "POST", data }), invalidatesTags: ["Booking"] }),
    myBookings: builder.query({ query: () => ({ url: "/bookings/my-bookings" }), providesTags: ["Booking"] }),
    providerBookings: builder.query({ query: () => ({ url: "/bookings/provider-bookings" }), providesTags: ["Booking"] }),

    cart: builder.query({ query: () => ({ url: "/cart" }), providesTags: ["Cart"] }),
    addToCart: builder.mutation({ query: (data) => ({ url: "/cart", method: "POST", data }), invalidatesTags: ["Cart"] }),
    updateCartQuantity: builder.mutation({ query: ({ productId, quantity }) => ({ url: `/cart/${productId}`, method: "PATCH", data: { quantity } }), invalidatesTags: ["Cart"] }),
    removeCartProduct: builder.mutation({ query: (productId) => ({ url: `/cart/${productId}`, method: "DELETE" }), invalidatesTags: ["Cart"] }),
    checkout: builder.mutation({ query: (data) => ({ url: "/orders/checkout", method: "POST", data }), invalidatesTags: ["Order", "Cart"] }),
    myOrders: builder.query({ query: () => ({ url: "/orders/my-orders" }), providesTags: ["Order"] }),
    myPayments: builder.query({ query: () => ({ url: "/payments/my-payments" }) }),

    wishlist: builder.query({ query: () => ({ url: "/wishlist" }), providesTags: ["Wishlist"] }),
    toggleWishlist: builder.mutation({ query: (productId) => ({ url: `/wishlist/toggle/${productId}`, method: "PATCH" }), invalidatesTags: ["Wishlist"] }),

    stores: builder.query({ query: (params) => ({ url: "/stores", params }), providesTags: ["Store"] }),

    notifications: builder.query({ query: () => ({ url: "/notifications" }), providesTags: ["Notification"] }),
    unreadCount: builder.query({ query: () => ({ url: "/notifications/unread-count" }), providesTags: ["Notification"] }),
    markNotificationRead: builder.mutation({ query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }), invalidatesTags: ["Notification"] }),

    detectDisease: builder.mutation({ query: (data) => ({ url: "/ai/detect-disease", method: "POST", data, headers: { "Content-Type": "multipart/form-data" } }), invalidatesTags: ["AI"] }),
    aiChat: builder.mutation({ query: (data) => ({ url: "/ai/chat", method: "POST", data }), invalidatesTags: ["AI"] }),
    aiRecommendation: builder.mutation({ query: (data) => ({ url: "/ai/recommendation", method: "POST", data }), invalidatesTags: ["AI"] }),
    diseaseHistory: builder.query({ query: () => ({ url: "/ai/disease-history" }), providesTags: ["AI"] }),
    recommendationHistory: builder.query({ query: () => ({ url: "/ai/recommendation-history" }), providesTags: ["AI"] }),
    chatHistory: builder.query({ query: () => ({ url: "/ai/chat-history" }), providesTags: ["AI"] }),
    aiAnalytics: builder.query({ query: () => ({ url: "/ai/analytics" }), providesTags: ["AI"] }),

    latestDeliveryLocation: builder.query({ query: (id) => ({ url: `/delivery/${id}/location` }), providesTags: ["Delivery"] }),
    deliveryHistory: builder.query({ query: () => ({ url: "/delivery/history" }), providesTags: ["Delivery"] }),
    revenueAnalytics: builder.query({ query: () => ({ url: "/payments/analytics/revenue" }) }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useLogoutMutation,
  useCropsQuery,
  useFeaturedCropsQuery,
  useCropQuery,
  useEquipmentQuery,
  useFeaturedEquipmentQuery,
  useEquipmentByIdQuery,
  useCreateBookingMutation,
  useMyBookingsQuery,
  useProviderBookingsQuery,
  useCartQuery,
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveCartProductMutation,
  useCheckoutMutation,
  useMyOrdersQuery,
  useMyPaymentsQuery,
  useWishlistQuery,
  useToggleWishlistMutation,
  useStoresQuery,
  useNotificationsQuery,
  useUnreadCountQuery,
  useMarkNotificationReadMutation,
  useDetectDiseaseMutation,
  useAiChatMutation,
  useAiRecommendationMutation,
  useDiseaseHistoryQuery,
  useRecommendationHistoryQuery,
  useChatHistoryQuery,
  useAiAnalyticsQuery,
  useLatestDeliveryLocationQuery,
  useDeliveryHistoryQuery,
  useRevenueAnalyticsQuery,
} = apiSlice;
