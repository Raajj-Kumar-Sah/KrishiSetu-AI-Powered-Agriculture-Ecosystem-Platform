import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function resolveItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.crops)) return payload.crops;
  if (Array.isArray(payload?.equipment)) return payload.equipment;
  if (Array.isArray(payload?.stores)) return payload.stores;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function itemImage(item) {
  const image = item?.image || item?.thumbnail || item?.images?.[0] || item?.profileImage;
  return image?.url || image || "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80";
}

export function itemPrice(item) {
  return item?.price || item?.sellingPrice || item?.rentPerDay || item?.dailyRent || item?.pricing?.daily || item?.pricing?.hourly || 0;
}
