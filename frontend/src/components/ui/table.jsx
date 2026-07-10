import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function Th({ className, ...props }) {
  return <th className={cn("h-11 px-4 text-left align-middle font-semibold text-slate-600", className)} {...props} />;
}

export function Td({ className, ...props }) {
  return <td className={cn("border-t px-4 py-3 align-middle", className)} {...props} />;
}
