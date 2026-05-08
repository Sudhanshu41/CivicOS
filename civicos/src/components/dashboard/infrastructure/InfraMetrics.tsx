"use client";

import { motion } from "framer-motion";
import { Activity, Zap, Droplet, Factory, Wrench, BrainCircuit } from "lucide-react";
import { MetricCounter } from "../../motion/MetricCounter";
import { GlassPanel } from "../../ui/GlassPanel";
import { staggerContainer, fadeSlideUp } from "../../../lib/motionConfig";

/**
 * CIVICOS — INFRA METRICS
 * Performance indicators for city-wide infrastructure systems.
 */

const metrics = [
  { label: "Stability", val: 96.4, suffix: "%", icon: Activity, color: "white" },
  { label: "Energy Efficiency", val: 14, prefix: "+", suffix: "%", icon: Zap, color: "yellow" },
  { label: "Water Health", val: 100, suffix: "%", icon: Droplet, color: "white" },
  { label: "Structural Integrity", val: 98.2, suffix: "%", icon: Factory, color: "white" },
  { label: "Maint. Efficiency", val: 31, prefix: "+", suffix: "%", icon: Wrench, color: "white" },
  { label: "Auto Optimization", val: 99.9, suffix: "%", icon: BrainCircuit, color: "white" },
];

export function InfraMetrics() {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden" 
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6"
    >
      {metrics.map((metric, idx) => (
        <motion.div 
          key={idx} 
          variants={fadeSlideUp}
          className="glass-panel p-5 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <metric.icon className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
          </div>
          <div>
            <MetricCounter 
              value={metric.val} 
              prefix={metric.prefix} 
              suffix={metric.suffix} 
              decimals={metric.val % 1 !== 0 ? 1 : 0}
              color={metric.color as any}
              valueClassName="text-2xl font-light tracking-tight"
            />
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-bold">{metric.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
