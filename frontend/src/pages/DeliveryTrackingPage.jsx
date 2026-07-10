import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Navigation, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { z } from "zod";
import { useDeliveryHistoryQuery, useLatestDeliveryLocationQuery } from "@/api/apiSlice";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { resolveItems } from "@/lib/utils";

const schema = z.object({ deliveryId: z.string().min(6) });

export default function DeliveryTrackingPage() {
  const { register, handleSubmit, watch, setValue } = useForm({ resolver: zodResolver(schema) });
  const user = useAppSelector((state) => state.auth.user);
  const deliveryId = watch("deliveryId");
  const { data: location } = useLatestDeliveryLocationQuery(deliveryId, { skip: !deliveryId || deliveryId.length < 6, pollingInterval: 10000 });
  const { data: history } = useDeliveryHistoryQuery(undefined, { skip: user?.role !== "DeliveryPartner" });
  const point = location?.location || location;
  const coordinates = point?.coordinates || [point?.lng || 77.209, point?.lat || 28.6139];
  const center = [Number(coordinates[1] || 28.6139), Number(coordinates[0] || 77.209)];
  const deliveries = resolveItems(history);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title="Delivery tracking" description="Track latest delivery location with protected live polling and delivery-partner history." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="h-[540px]">
            <MapContainer center={center} zoom={13} className="h-full w-full">
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={center}>
                <Popup>Latest delivery position</Popup>
              </Marker>
            </MapContainer>
          </div>
        </Card>
        <aside className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Navigation className="h-5 w-5 text-primary" /> Track delivery</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((values) => setValue("deliveryId", values.deliveryId))} className="space-y-3">
                <Input placeholder="Delivery ID" {...register("deliveryId")} />
                <Button className="w-full"><MapPin className="h-4 w-4" /> Track</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Delivery history</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {!deliveries.length && <EmptyState title="No delivery history" />}
              {deliveries.slice(0, 6).map((delivery) => (
                <button key={delivery._id || delivery.id} className="w-full rounded-lg border p-3 text-left text-sm hover:bg-slate-50" onClick={() => setValue("deliveryId", delivery._id || delivery.id)}>
                  <p className="font-semibold">{delivery.order?.orderNumber || delivery._id || delivery.id}</p>
                  <p className="text-muted-foreground">{delivery.status || "In progress"}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
