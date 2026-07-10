import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, CheckCircle2, ShieldCheck, ShoppingBasket, Tractor, Truck, Users } from "lucide-react";
import { useFeaturedCropsQuery, useFeaturedEquipmentQuery } from "@/api/apiSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/common/ProductCard";
import { StatCard } from "@/components/common/StatCard";
import { resolveItems } from "@/lib/utils";

const features = [
  { icon: ShoppingBasket, title: "Verified crop marketplace", text: "Search, compare, wishlist, cart, checkout, and review farm produce." },
  { icon: Tractor, title: "Equipment rentals", text: "Book nearby tractors, harvesters, and attachments from trusted providers." },
  { icon: Bot, title: "AI crop intelligence", text: "Disease detection, chat guidance, recommendations, and nearby store discovery." },
  { icon: Truck, title: "Live delivery operations", text: "OTP-based pickup, delivery tracking, timelines, and partner workflows." },
];

export default function LandingPage() {
  const { data: crops } = useFeaturedCropsQuery();
  const { data: equipment } = useFeaturedEquipmentQuery();

  return (
    <main>
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=85"
          alt="Green agricultural field"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl text-white">
            <Badge className="bg-white/15 text-white ring-1 ring-white/30">Agriculture ecosystem platform</Badge>
            <h1 className="mt-5 text-5xl font-extrabold leading-tight md:text-7xl">KrishiSetu</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              A production-grade operating layer for farmers, buyers, equipment providers, delivery partners, agro stores, and admins.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/marketplace">Explore marketplace</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20"><Link to="/ai">Open AI assistant</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={Users} label="Ecosystem roles" value="6" />
          <StatCard icon={ShoppingBasket} label="Commerce modules" value="8+" tone="text-lime-600" />
          <StatCard icon={ShieldCheck} label="JWT protected flows" value="100%" tone="text-yellow-600" />
          <StatCard icon={CheckCircle2} label="Realtime modules" value="3" tone="text-blue-600" />
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-5 md:grid-cols-4">
            {features.map((feature) => (
              <motion.div key={feature.title} whileHover={{ y: -5 }} className="rounded-xl border p-5 shadow-sm">
                <feature.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Marketplace preview</p>
            <h2 className="text-3xl font-bold">Fresh listings from farmers</h2>
          </div>
          <Button asChild variant="outline"><Link to="/marketplace">View all</Link></Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {resolveItems(crops).slice(0, 3).map((item) => <ProductCard key={item._id || item.id} item={item} to={`/marketplace/${item._id || item.id}`} />)}
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-lime-300">Equipment preview</p>
            <h2 className="mt-2 text-3xl font-bold">Rental workflows built for real field operations</h2>
            <p className="mt-3 text-white/70">Provider dashboards, booking history, reviews, status changes, and farmer booking flows use the completed backend modules.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {resolveItems(equipment).slice(0, 2).map((item) => <ProductCard key={item._id || item.id} item={item} type="equipment" to={`/equipment/${item._id || item.id}`} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-xl bg-primary p-8 text-white shadow-soft md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Run your agriculture workflows from one place.</h2>
            <p className="mt-2 text-white/80">Sign in to access protected dashboards, AI, notifications, cart, orders, bookings, and delivery tracking.</p>
          </div>
          <Button asChild size="lg" variant="secondary" className="mt-6 md:mt-0"><Link to="/register">Create account</Link></Button>
        </div>
      </section>
    </main>
  );
}
