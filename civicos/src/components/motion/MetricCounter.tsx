"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useInView } from "framer-motion";

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
  color?: "blue" | "emerald" | "purple" | "rose" | "yellow" | "cyan";
}

const colorMap = {
  blue:    "text-blue-400",
  emerald: "text-emerald-400",
  purple:  "text-purple-400",
  rose:    "text-rose-400",
  yellow:  "text-yellow-400",
  cyan:    "text-cyan-400",
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
  color = "blue",
}: MetricCounterProps) {
  const [current, setCurrent] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false });

  // Fluctuating live metric
  useEffect(() => {
    if (!fluctuate) return;
    const id = setInterval(() => {
      const delta = (Math.random() - 0.5) * fluctuateRange * 2;
      const base = target ?? value;
      setCurrent(Math.max(0, Math.min(100, parseFloat((base + delta).toFixed(decimals)))));
    }, interval);
    return () => clearInterval(id);
  }, [fluctuate, fluctuateRange, interval, target, value, decimals]);

  // Count-up animation on enter
  useEffect(() => {
    if (!inView || fluctuate) return;
    const end = target ?? value;
    const duration = 1800;
    const start = Date.now();
    let frame: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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
        key={Math.round(current * 10)}
        className={`font-bold font-mono tabular-nums ${colorMap[color]} ${valueClassName}`}
        animate={{ opacity: [0.7, 1] }}
        transition={{ duration: 0.15 }}
      >
        {prefix}{current.toFixed(decimals)}{suffix}
      </motion.span>
      {(label || trend) && (
        <div className="flex items-center gap-1.5 mt-0.5">
          {label && <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">{label}</span>}
          {trend && <span className={`text-[9px] font-bold ${trendColor}`}>{trendIcon}</span>}
        </div>
      )}
    </div>
  );
}
