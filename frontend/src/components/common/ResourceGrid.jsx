import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductCard } from "@/components/common/ProductCard";
import { resolveItems } from "@/lib/utils";

export function ResourceGrid({ data, isLoading, cardProps }) {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80" />)}
      </div>
    );
  }

  const items = resolveItems(data);
  if (!items.length) return <EmptyState />;

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ProductCard key={item._id || item.id} item={item} {...cardProps(item)} />
      ))}
    </div>
  );
}
