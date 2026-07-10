import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEquipmentQuery } from "@/api/apiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { ResourceGrid } from "@/components/common/ResourceGrid";

export default function EquipmentPage() {
  const [params, setParams] = useSearchParams();
  const query = Object.fromEntries(params.entries());
  const { data, isLoading } = useEquipmentQuery(query);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title="Equipment rentals" description="Discover tractors, harvesters, irrigation tools, and provider-owned equipment." />
      <form onSubmit={(event) => { event.preventDefault(); setParams(Object.fromEntries(new FormData(event.currentTarget).entries())); }} className="mb-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-[1fr_180px_140px]">
        <Input name="keyword" defaultValue={query.keyword || ""} placeholder="Search equipment" />
        <Input name="equipmentType" defaultValue={query.equipmentType || ""} placeholder="Type" />
        <Button><Search className="h-4 w-4" /> Search</Button>
      </form>
      <ResourceGrid data={data} isLoading={isLoading} cardProps={(item) => ({ type: "equipment", to: `/equipment/${item._id || item.id}` })} />
    </main>
  );
}
