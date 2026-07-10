import { Bot, CalendarCheck, Heart, Package, ShoppingCart, Tractor } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartQuery, useDiseaseHistoryQuery, useMyBookingsQuery, useMyOrdersQuery, useMyPaymentsQuery, useProviderBookingsQuery, useWishlistQuery } from "@/api/apiSlice";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { resolveItems } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: cart } = useCartQuery();
  const { data: wishlist } = useWishlistQuery();
  const { data: orders } = useMyOrdersQuery();
  const isProvider = user?.role === "EquipmentProvider" || user?.role === "Admin";
  const { data: farmerBookings } = useMyBookingsQuery(undefined, { skip: user?.role !== "Farmer" });
  const { data: providerBookings } = useProviderBookingsQuery(undefined, { skip: !isProvider });
  const bookings = isProvider ? providerBookings : farmerBookings;
  const { data: payments } = useMyPaymentsQuery();
  const { data: diseases } = useDiseaseHistoryQuery();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title={`Welcome, ${user?.name || "KrishiSetu user"}`} description="Your protected operating center for commerce, bookings, AI, delivery, and notifications." />
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard icon={ShoppingCart} label="Cart items" value={resolveItems(cart).length} />
        <StatCard icon={Heart} label="Wishlist" value={resolveItems(wishlist).length} tone="text-red-600" />
        <StatCard icon={Package} label="Orders" value={resolveItems(orders).length} tone="text-blue-600" />
        <StatCard icon={CalendarCheck} label="Bookings" value={resolveItems(bookings).length} tone="text-yellow-600" />
        <StatCard icon={Bot} label="AI history" value={resolveItems(diseases).length} tone="text-lime-600" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Payments recorded: {resolveItems(payments).length}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          { title: "Shop crops", text: "Browse products and build a checkout cart.", icon: ShoppingCart, to: "/marketplace" },
          { title: "Book equipment", text: "Reserve field equipment from providers.", icon: Tractor, to: "/equipment" },
          { title: "Diagnose disease", text: "Upload crop imagery for AI analysis.", icon: Bot, to: "/ai" },
        ].map((action) => (
          <Card key={action.title}>
            <CardHeader><action.icon className="h-6 w-6 text-primary" /><CardTitle className="mt-3">{action.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{action.text}</p>
              <Button asChild className="mt-5" variant="outline"><Link to={action.to}>Open</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
