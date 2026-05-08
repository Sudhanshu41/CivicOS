"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Train, Siren, Activity, BrainCircuit } from "lucide-react";
import { MetricCounter } from "../../motion/MetricCounter";
import { PulseIndicator } from "../../motion/PulseIndicator";
import { GlassPanel } from "../../ui/GlassPanel";
import { staggerContainer, fadeSlideUp } from "../../../lib/motionConfig";

/**
 * CIVICOS — TRAFFIC METRICS
 * Real-time transportation system performance indicators.
 */

const trafficStats = [
  { label: "Traffic Efficiency", val: 94.2, suffix: "%", icon: TrendingUp, color: "white" },
  { label: "Average Delay", val: 1.4, suffix: "m", icon: Clock, color: "white" },
  { label: "Transit Load", val: 88, suffix: "%", icon: Train, color: "white" },
  { label: "Emerg. Route Spd", val: 40, prefix: "+", suffix: "%", icon: Siren, color: "white" },
  { label: "Congestion Prob.", val: 12.5, suffix: "%", icon: Activity, color: "yellow" },
  { label: "AI Acc. Rate", val: 99.1, suffix: "%", icon: BrainCircuit, color: "white" },
];

export function TrafficMetrics() {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden" 
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
    >
      {trafficStats.map((metric, idx) => (
        <motion.div 
          key={idx} 
          variants={fadeSlideUp}
          className="glass-panel p-5 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition"
        >
          <div className="flex justify-between items-start mb-4">
            <metric.icon className="w-4 h-4 text-gray-500" />
            <PulseIndicator status="active" size="xs" showLabel={false} color={metric.color as any} />
          </div>
          <div>
            <MetricCounter 
              value={metric.val} 
              prefix={metric.prefix} 
              suffix={metric.suffix} 
              decimals={metric.val % 1 !== 0 ? 1 : 0}
              color={metric.color as any}
              valueClassName="text-xl font-light"
            />
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">{metric.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
