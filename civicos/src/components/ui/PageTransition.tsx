"use client";

import { motion } from "framer-motion";
import { pageTransitionVariants } from "../../lib/motionConfig";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={pageTransitionVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="flex-1 w-full h-full relative"
    >
      {children}
    </motion.div>
  );
}
