"use client";

import { motion } from "framer-motion";

export function NeuralPath({ 
  d, 
  color = "#3b82f6", 
  duration = 2, 
  delay = 0 
}: { 
  d: string; 
  color?: string; 
  duration?: number; 
  delay?: number; 
}) {
  return (
    <>
      {/* Base Path */}
      <path 
        d={d} 
        stroke={color} 
        strokeWidth="1" 
        strokeOpacity="0.2" 
        fill="transparent" 
      />
      {/* Moving Data Packet */}
      <motion.path 
        d={d} 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="transparent"
        strokeDasharray="15 100"
        animate={{ strokeDashoffset: [115, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </>
  );
}
