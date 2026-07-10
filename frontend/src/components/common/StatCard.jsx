import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function StatCard({ icon: Icon, label, value, tone = "text-primary" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-slate-100 p-3">
            <Icon className={`h-5 w-5 ${tone}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
