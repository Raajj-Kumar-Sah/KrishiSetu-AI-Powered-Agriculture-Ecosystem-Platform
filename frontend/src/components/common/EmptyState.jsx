import { Leaf } from "lucide-react";

export function EmptyState({ title = "No data found", description = "Once data is available, it will appear here." }) {
  return (
    <div className="rounded-xl border border-dashed bg-white p-10 text-center">
      <Leaf className="mx-auto h-9 w-9 text-primary" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
