import { useMyBookingsQuery, useProviderBookingsQuery } from "@/api/apiSlice";
import { useAppSelector } from "@/app/hooks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { resolveItems } from "@/lib/utils";

export default function BookingHistoryPage() {
  const user = useAppSelector((state) => state.auth.user);
  const provider = user?.role === "EquipmentProvider" || user?.role === "Admin";
  const myBookings = useMyBookingsQuery(undefined, { skip: provider });
  const providerBookings = useProviderBookingsQuery(undefined, { skip: !provider });
  const activeQuery = provider ? providerBookings : myBookings;
  const bookings = resolveItems(activeQuery.data);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title="Booking history" description="Track equipment booking requests, accepted work, cancellations, and completion states." />
      {!bookings.length && !activeQuery.isLoading && <EmptyState />}
      {!!bookings.length && (
        <Card className="overflow-hidden">
          <Table>
            <thead><tr><Th>Equipment</Th><Th>Dates</Th><Th>Status</Th><Th>Farmer</Th></tr></thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id || booking.id}>
                  <Td>{booking.equipment?.name || booking.equipmentName || "Equipment"}</Td>
                  <Td>{booking.startDate} - {booking.endDate}</Td>
                  <Td><Badge>{booking.status || "Requested"}</Badge></Td>
                  <Td>{booking.farmer?.name || booking.user?.name || "User"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </main>
  );
}
