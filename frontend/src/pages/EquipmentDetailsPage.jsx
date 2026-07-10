import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useCreateBookingMutation, useEquipmentByIdQuery } from "@/api/apiSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, itemImage, itemPrice } from "@/lib/utils";

const schema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  rentalType: z.enum(["Hourly", "Daily", "Weekly", "Monthly"]),
  duration: z.coerce.number().min(1),
  address: z.string().min(5),
});

export default function EquipmentDetailsPage() {
  const { id } = useParams();
  const { data: item, isLoading } = useEquipmentByIdQuery(id);
  const [createBooking, bookingState] = useCreateBookingMutation();
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: { rentalType: "Daily", duration: 1 } });

  if (isLoading) return <main className="mx-auto max-w-7xl px-4 py-8"><Skeleton className="h-[520px]" /></main>;

  const submit = async (values) => {
    const durationKey = {
      Hourly: "hours",
      Daily: "days",
      Weekly: "weeks",
      Monthly: "months",
    }[values.rentalType];

    await createBooking({
      equipmentId: id,
      rentalType: values.rentalType,
      startDate: values.startDate,
      endDate: values.endDate,
      duration: { [durationKey]: values.duration },
      pickupLocation: { address: values.address },
      dropLocation: { address: values.address },
    }).unwrap().then(() => toast.success("Booking requested")).catch((error) => toast.error(error?.data?.message || "Booking failed"));
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
      <section className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <img src={itemImage(item)} alt={item?.name || "Equipment"} className="h-[440px] w-full object-cover" />
        <div className="p-6">
          <h1 className="text-4xl font-bold">{item?.name || item?.equipmentName || "Equipment"}</h1>
          <p className="mt-3 text-muted-foreground">{item?.description}</p>
          <p className="mt-4 text-2xl font-bold">{formatCurrency(itemPrice(item))} / day</p>
        </div>
      </section>
      <Card>
        <CardHeader><CardTitle>Book equipment</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <Input type="date" {...register("startDate")} />
            <Input type="date" {...register("endDate")} />
            <select className="focus-ring h-11 w-full rounded-lg border bg-white px-3 text-sm" {...register("rentalType")}>
              <option value="Hourly">Hourly</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <Input type="number" min="1" placeholder="Duration" {...register("duration")} />
            <Input placeholder="Delivery or field address" {...register("address")} />
            <Button className="w-full" disabled={bookingState.isLoading}><CalendarCheck className="h-4 w-4" /> Request booking</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
