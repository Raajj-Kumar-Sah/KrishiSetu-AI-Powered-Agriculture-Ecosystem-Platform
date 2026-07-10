import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useCartQuery, useCheckoutMutation, useRemoveCartProductMutation, useUpdateCartQuantityMutation } from "@/api/apiSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { formatCurrency, itemImage, resolveItems } from "@/lib/utils";

const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  house: z.string().min(2),
  village: z.string().min(2),
  city: z.string().min(2),
  district: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(6),
  paymentMethod: z.enum(["COD", "UPI", "Card", "NetBanking", "Wallet", "Razorpay", "Stripe"]),
});

export default function CartPage() {
  const { data, isLoading } = useCartQuery();
  const [updateQuantity] = useUpdateCartQuantityMutation();
  const [removeProduct] = useRemoveCartProductMutation();
  const [checkout, checkoutState] = useCheckoutMutation();
  const { register, handleSubmit } = useForm({ resolver: zodResolver(checkoutSchema), defaultValues: { paymentMethod: "COD" } });
  const items = resolveItems(data?.items || data?.products || data);
  const total = items.reduce((sum, item) => sum + Number(item.product?.price || item.price || 0) * Number(item.quantity || 1), 0);

  const submit = async (values) => {
    const { paymentMethod, ...shippingAddress } = values;
    await checkout({ shippingAddress, paymentMethod }).unwrap().then(() => toast.success("Checkout created")).catch((error) => toast.error(error?.data?.message || "Checkout failed"));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title="Cart and checkout" description="Cart state is loaded from the authenticated marketplace cart endpoint." />
      {!isLoading && !items.length && <EmptyState title="Your cart is empty" />}
      {!!items.length && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {items.map((line) => {
              const product = line.product || line.crop || line;
              const id = product._id || product.id || line.productId;
              return (
                <Card key={id} className="p-4">
                  <div className="flex gap-4">
                    <img src={itemImage(product)} alt={product.name || "Product"} className="h-24 w-28 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">{product.name || product.cropName}</h3>
                      <p className="text-sm text-muted-foreground">{formatCurrency(product.price || line.price)}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => updateQuantity({ productId: id, quantity: Math.max(1, Number(line.quantity || 1) - 1) })}><Minus className="h-4 w-4" /></Button>
                        <span className="w-8 text-center font-semibold">{line.quantity || 1}</span>
                        <Button variant="outline" size="icon" onClick={() => updateQuantity({ productId: id, quantity: Number(line.quantity || 1) + 1 })}><Plus className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => removeProduct(id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <Card>
            <CardHeader><CardTitle>Checkout</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-5 text-3xl font-bold">{formatCurrency(total)}</p>
              <form onSubmit={handleSubmit(submit)} className="space-y-4">
                <Input placeholder="Full name" {...register("fullName")} />
                <Input placeholder="Phone" {...register("phone")} />
                <Input placeholder="House / street" {...register("house")} />
                <Input placeholder="Village" {...register("village")} />
                <Input placeholder="City" {...register("city")} />
                <Input placeholder="District" {...register("district")} />
                <Input placeholder="State" {...register("state")} />
                <Input placeholder="Pincode" {...register("pincode")} />
                <select className="focus-ring h-11 w-full rounded-lg border bg-white px-3 text-sm" {...register("paymentMethod")}>
                  <option value="COD">Cash on delivery</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="NetBanking">Net banking</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Stripe">Stripe</option>
                </select>
                <Button className="w-full" disabled={checkoutState.isLoading}>Place order</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
