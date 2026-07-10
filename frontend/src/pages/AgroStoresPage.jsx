import { MapPin } from "lucide-react";
import { useStoresQuery } from "@/api/apiSlice";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveItems } from "@/lib/utils";

export default function AgroStoresPage() {
  const { data, isLoading } = useStoresQuery();
  const stores = resolveItems(data);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title="Agro stores" description="Find nearby stores, inspect store profiles, and review inventory-backed services." />
      {isLoading && <div className="grid gap-5 md:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-56" />)}</div>}
      {!isLoading && !stores.length && <EmptyState title="No stores found" />}
      <div className="grid gap-5 md:grid-cols-3">
        {stores.map((store) => (
          <Card key={store._id || store.id} className="p-5">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-green-50 p-3 text-primary"><MapPin className="h-5 w-5" /></span>
              <div>
                <h3 className="font-bold">{store.name || store.storeName}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{store.description || store.address || store.city}</p>
                <p className="mt-4 text-sm font-semibold text-primary">{store.phone || store.owner?.phone || "Contact store"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
