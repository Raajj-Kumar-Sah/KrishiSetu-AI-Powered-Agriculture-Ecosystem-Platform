import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, itemImage, itemPrice } from "@/lib/utils";

export function ProductCard({ item, to, onCart, onWishlist, type = "product" }) {
  const title = item?.name || item?.title || item?.cropName || item?.equipmentName || "KrishiSetu item";
  const price = itemPrice(item);

  return (
    <motion.article whileHover={{ y: -4 }} className="h-full">
      <Card className="flex h-full flex-col overflow-hidden">
        <Link to={to} className="block aspect-[4/3] overflow-hidden bg-slate-100">
          <img src={itemImage(item)} alt={title} className="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge variant={type === "equipment" ? "accent" : "default"}>{item?.category || item?.type || type}</Badge>
              <h3 className="mt-2 line-clamp-2 font-semibold">{title}</h3>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
              <Star className="h-4 w-4 fill-yellow-400" /> {item?.rating || item?.averageRating || "4.8"}
            </div>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item?.description || item?.location?.address || item?.city}</p>
          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-lg font-bold">{formatCurrency(price)}</span>
            <div className="flex gap-2">
              {onWishlist && <Button variant="outline" size="icon" onClick={() => onWishlist(item)} aria-label="Toggle wishlist"><Heart className="h-4 w-4" /></Button>}
              {onCart && <Button size="icon" onClick={() => onCart(item)} aria-label="Add to cart"><ShoppingCart className="h-4 w-4" /></Button>}
            </div>
          </div>
        </div>
      </Card>
    </motion.article>
  );
}
