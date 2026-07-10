import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const MarketplacePage = lazy(() => import("@/pages/MarketplacePage"));
const ProductDetailsPage = lazy(() => import("@/pages/ProductDetailsPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const EquipmentPage = lazy(() => import("@/pages/EquipmentPage"));
const EquipmentDetailsPage = lazy(() => import("@/pages/EquipmentDetailsPage"));
const BookingHistoryPage = lazy(() => import("@/pages/BookingHistoryPage"));
const AgroStoresPage = lazy(() => import("@/pages/AgroStoresPage"));
const DeliveryTrackingPage = lazy(() => import("@/pages/DeliveryTrackingPage"));
const AIAssistantPage = lazy(() => import("@/pages/AIAssistantPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: (
      <ErrorBoundary>
        <NotFoundPage />
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "marketplace", element: <MarketplacePage /> },
      { path: "marketplace/:id", element: <ProductDetailsPage /> },
      { path: "equipment", element: <EquipmentPage /> },
      { path: "equipment/:id", element: <EquipmentDetailsPage /> },
      { path: "agro-stores", element: <AgroStoresPage /> },
      { path: "dashboard", element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: "cart", element: <ProtectedRoute><CartPage /></ProtectedRoute> },
      { path: "bookings", element: <ProtectedRoute><BookingHistoryPage /></ProtectedRoute> },
      { path: "delivery", element: <ProtectedRoute><DeliveryTrackingPage /></ProtectedRoute> },
      { path: "ai", element: <ProtectedRoute><AIAssistantPage /></ProtectedRoute> },
      { path: "notifications", element: <ProtectedRoute><NotificationsPage /></ProtectedRoute> },
      { path: "admin", element: <ProtectedRoute roles={["Admin"]}><AdminDashboardPage /></ProtectedRoute> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
