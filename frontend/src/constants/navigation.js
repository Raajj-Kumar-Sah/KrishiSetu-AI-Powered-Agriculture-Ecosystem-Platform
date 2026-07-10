import { Bot, LayoutDashboard, MapPin, Package, ShoppingBasket, Tractor, Truck, Users } from "lucide-react";

export const navItems = [
  { label: "Marketplace", path: "/marketplace", icon: ShoppingBasket },
  { label: "Equipment", path: "/equipment", icon: Tractor },
  { label: "Agro Stores", path: "/agro-stores", icon: MapPin },
  { label: "Delivery", path: "/delivery", icon: Truck, auth: true },
  { label: "AI Assistant", path: "/ai", icon: Bot, auth: true },
];

export const dashboardItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", path: "/cart", icon: Package },
  { label: "Admin", path: "/admin", icon: Users, roles: ["Admin"] },
];
