import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-soft"
      >
        <Sprout className="h-6 w-6 text-primary" />
        <span className="font-semibold">Loading KrishiSetu</span>
      </motion.div>
    </div>
  );
}
