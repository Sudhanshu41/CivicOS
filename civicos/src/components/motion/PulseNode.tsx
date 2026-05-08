"use client";

import { motion } from "framer-motion";
import { neuralPulse } from "@/lib/motionConfig";

export function PulseNode({ 
  color = "blue", 
  size = "w-4 h-4",
  className = "" 
}: { 
  color?: "blue" | "purple" | "emerald" | "rose" | "orange" | "cyan" | "yellow";
  size?: string;
  className?: string;
}) {
  const colorMap = {
    blue: "bg-blue-500 shadow-[0_0_15px_#3b82f6]",
    purple: "bg-purple-500 shadow-[0_0_15px_#a855f7]",
    emerald: "bg-emerald-500 shadow-[0_0_15px_#10b981]",
    rose: "bg-rose-500 shadow-[0_0_15px_#f43f5e]",
    orange: "bg-orange-500 shadow-[0_0_15px_#f97316]",
    cyan: "bg-cyan-500 shadow-[0_0_15px_#06b6d4]",
    yellow: "bg-yellow-500 shadow-[0_0_15px_#eab308]",
  };

  const ringColorMap = {
    blue: "border-blue-500",
    purple: "border-purple-500",
    emerald: "border-emerald-500",
    rose: "border-rose-500",
    orange: "border-orange-500",
    cyan: "border-cyan-500",
    yellow: "border-yellow-500",
  };

  return (
    <div className={`relative flex items-center justify-center ${size} ${className}`}>
      {/* Expanding Pulse Ring */}
      <motion.div
        animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className={`absolute inset-0 rounded-full border ${ringColorMap[color]}`}
      />
      {/* Inner Glowing Node */}
      <motion.div
        variants={neuralPulse}
        animate="pulse"
        className={`w-full h-full rounded-full ${colorMap[color]}`}
      />
    </div>
  );
}
