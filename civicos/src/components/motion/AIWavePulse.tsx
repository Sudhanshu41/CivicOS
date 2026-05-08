"use client";

import { motion } from "framer-motion";

export function AIWavePulse({ 
  color = "blue", 
  count = 3,
  delayOffset = 0.5 
}: { 
  color?: "blue" | "purple" | "emerald" | "rose" | "orange"; 
  count?: number;
  delayOffset?: number;
}) {
  const colorMap = {
    blue: "border-blue-500",
    purple: "border-purple-500",
    emerald: "border-emerald-500",
    rose: "border-rose-500",
    orange: "border-orange-500",
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 3], opacity: [0.5, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * delayOffset,
            ease: "easeOut",
          }}
          className={`absolute w-full h-full rounded-full border-2 ${colorMap[color]}`}
        />
      ))}
    </div>
  );
}
