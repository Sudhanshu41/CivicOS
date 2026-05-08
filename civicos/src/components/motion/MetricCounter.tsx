"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ThemeColor } from "../../types";

/**
 * CIVICOS — METRIC COUNTER
 * Production-grade animated counter with live fluctuation support.
 */

interface MetricCounterProps {
  value: number;
  target?: number;
  fluctuate?: boolean;
  fluctuateRange?: number;
  interval?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  valueClassName?: string;
  label?: string;
  trend?: "up" | "down" | "stable";
  color?: ThemeColor;
}

const colorMap: Record<ThemeColor, string> = {
  blue:    "text-blue-400",
  emerald: "text-emerald-400",
  purple:  "text-purple-400",
  rose:    "text-rose-400",
  yellow:  "text-[#FFD500]",
  cyan:    "text-cyan-400",
  white:   "text-white",
  gray:    "text-gray-500",
};

export function MetricCounter({
  value,
  target,
  fluctuate = false,
  fluctuateRange = 2,
  interval = 3000,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  valueClassName = "",
  label,
  trend,
  color = "white",
}: MetricCounterProps) {
  const [current, setCurrent] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false });

  // --- Live Fluctuation Logic ---
  useEffect(() => {
    if (!fluctuate) return;
    const id = setInterval(() => {
      const delta = (Math.random() - 0.5) * fluctuateRange * 2;
      const base = target ?? value;
      setCurrent(Math.max(0, parseFloat((base + delta).toFixed(decimals))));
    }, interval);
    return () => clearInterval(id);
  }, [fluctuate, fluctuateRange, interval, target, value, decimals]);

  // --- Count-up on Initial View ---
  useEffect(() => {
    if (!inView || fluctuate) return;
    const end = target ?? value;
    const duration = 1800;
    const startTime = Date.now();
    let frame: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // Cubic easing
      setCurrent(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, value, decimals, fluctuate]);

  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "~";
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-gray-500";

  return (
    <div className={`flex flex-col ${className}`}>
      <motion.span
        ref={ref}
        key={Math.round(current * 100)}
        className={`font-medium font-mono tabular-nums tracking-tighter ${colorMap[color]} ${valueClassName}`}
        animate={{ opacity: [0.7, 1], y: [2, 0] }}
        transition={{ duration: 0.2 }}
      >
        {prefix}{current.toFixed(decimals)}{suffix}
      </motion.span>
      {(label || trend) && (
        <div className="flex items-center gap-1.5 mt-1">
          {label && <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{label}</span>}
          {trend && <span className={`text-[9px] font-bold ${trendColor}`}>{trendIcon}</span>}
        </div>
      )}
    </div>
  );
}
