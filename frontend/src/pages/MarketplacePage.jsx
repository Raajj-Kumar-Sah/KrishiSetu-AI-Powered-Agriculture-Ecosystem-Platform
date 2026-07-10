import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useAddToCartMutation, useCropsQuery, useToggleWishlistMutation } from "@/api/apiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { ResourceGrid } from "@/components/common/ResourceGrid";

export default function MarketplacePage() {
  const [params, setParams] = useSearchParams();
  const query = Object.fromEntries(params.entries());
  const { data, isLoading } = useCropsQuery(query);
  const [addToCart] = useAddToCartMutation();
  const [toggleWishlist] = useToggleWishlistMutation();

  const handleSearch = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setParams(Object.fromEntries([...form.entries()].filter(([, value]) => value)));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title="Crop marketplace" description="Browse crops, filter by backend query parameters, wishlist items, and add products to your cart." />
      <form onSubmit={handleSearch} className="mb-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-[1fr_180px_140px]">
        <Input name="keyword" defaultValue={query.keyword || ""} placeholder="Search crops, farmers, categories" />
        <Input name="category" defaultValue={query.category || ""} placeholder="Category" />
        <Button><Search className="h-4 w-4" /> Search</Button>
      </form>
      <ResourceGrid
        data={data}
        isLoading={isLoading}
        cardProps={(item) => ({
          to: `/marketplace/${item._id || item.id}`,
          onCart: async () => {
            await addToCart({ productId: item._id || item.id, quantity: 1 }).unwrap().then(() => toast.success("Added to cart")).catch((error) => toast.error(error?.data?.message || "Cart update failed"));
          },
          onWishlist: async () => {
            await toggleWishlist(item._id || item.id).unwrap().then(() => toast.success("Wishlist updated")).catch((error) => toast.error(error?.data?.message || "Wishlist update failed"));
          },
        })}
      />
    </main>
  );
}
