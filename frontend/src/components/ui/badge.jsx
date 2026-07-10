import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-green-100 text-green-800",
    accent: "bg-yellow-100 text-yellow-900",
    muted: "bg-slate-100 text-slate-700",
    danger: "bg-red-100 text-red-700",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", variants[variant], className)} {...props} />;
}
