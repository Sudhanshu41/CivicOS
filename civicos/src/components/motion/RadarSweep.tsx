"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function RadarSweep({ color = "blue", className = "" }: { color?: "blue" | "green" | "red"; className?: string }) {
  const colorMap = {
    blue: { stroke: "#3b82f6", fill: "rgba(59,130,246,0.05)", conic: "rgba(59,130,246,0.3)" },
    green: { stroke: "#10b981", fill: "rgba(16,185,129,0.05)", conic: "rgba(16,185,129,0.3)" },
    red: { stroke: "#ef4444", fill: "rgba(239,68,68,0.05)", conic: "rgba(239,68,68,0.3)" },
  };
  const c = colorMap[color];

  return (
    <div className={`relative rounded-full overflow-hidden ${className}`}>
      {/* Background circles */}
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${r * 100}%`, height: `${r * 100}%`,
            top: `${(1 - r) * 50}%`, left: `${(1 - r) * 50}%`,
            borderColor: c.stroke,
            opacity: 0.2,
          }}
        />
      ))}
      {/* Cross hairs */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px" style={{ background: c.stroke, opacity: 0.15 }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-px" style={{ background: c.stroke, opacity: 0.15 }} />
      </div>

      {/* Rotating sweep arm */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 origin-center"
        style={{
          background: `conic-gradient(${c.conic} 0deg, transparent 60deg, transparent 360deg)`,
        }}
      />

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: c.stroke, boxShadow: `0 0 8px ${c.stroke}` }} />
    </div>
  );
}
