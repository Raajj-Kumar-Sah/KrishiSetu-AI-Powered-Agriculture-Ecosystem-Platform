import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAddToCartMutation, useCropQuery } from "@/api/apiSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, itemImage, itemPrice } from "@/lib/utils";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: item, isLoading } = useCropQuery(id);
  const [addToCart] = useAddToCartMutation();

  if (isLoading) return <main className="mx-auto max-w-7xl px-4 py-8"><Skeleton className="h-[520px]" /></main>;

  const title = item?.name || item?.cropName || "Crop product";

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border bg-white">
        <img src={itemImage(item)} alt={title} className="h-full min-h-[420px] w-full object-cover" />
      </div>
      <section className="rounded-xl border bg-white p-6 shadow-soft">
        <Badge>{item?.category || "Crop"}</Badge>
        <h1 className="mt-4 text-4xl font-bold">{title}</h1>
        <p className="mt-3 text-muted-foreground">{item?.description || item?.details}</p>
        <p className="mt-6 text-3xl font-extrabold">{formatCurrency(itemPrice(item))}</p>
        <div className="mt-6 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <span>Quantity: {item?.quantity || item?.stock || "Available"}</span>
          <span>Farmer: {item?.farmer?.name || item?.seller?.name || "Verified seller"}</span>
          <span>Location: {item?.city || item?.district || item?.state || "India"}</span>
          <span>Status: {item?.status || "Active"}</span>
        </div>
        <Button className="mt-8" size="lg" onClick={() => addToCart({ productId: id, quantity: 1 }).unwrap().then(() => toast.success("Added to cart")).catch((error) => toast.error(error?.data?.message || "Cart update failed"))}>
          <ShoppingCart className="h-4 w-4" /> Add to cart
        </Button>
      </section>
    </main>
  );
}
