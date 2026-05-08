"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Crosshair, CheckCircle, Activity, ShieldAlert } from "lucide-react";
import { MetricCounter } from "../../motion/MetricCounter";
import { GlassPanel } from "../../ui/GlassPanel";

/**
 * CIVICOS — CONFIDENCE METRICS
 * Analytics panel for high-precision model performance tracking.
 */

const metrics = [
  { label: "Prediction Confidence", value: 99.1, suffix: "%", icon: BrainCircuit, color: "white" },
  { label: "AI Accuracy Rate", value: 98.7, suffix: "%", icon: Crosshair, color: "white" },
  { label: "Decision Reliability", value: 99.9, suffix: "%", icon: CheckCircle, color: "yellow" },
  { label: "Infra Stability Index", value: 0.94, icon: Activity, color: "white" },
  { label: "City Health Score", value: 96.2, icon: Activity, color: "white" }
];

export function ConfidenceMetrics() {
  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <h3 className="font-medium text-xs tracking-widest text-white uppercase">Confidence Metrics</h3>
        <ShieldAlert className="w-4 h-4 text-gray-500" />
      </div>
      
      <div className="space-y-6">
        {metrics.map((metric, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: idx * 0.05 }}
            className="flex justify-between items-center group cursor-default"
          >
            <div className="flex items-center space-x-3">
              <metric.icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition" />
              <span className="text-[10px] text-gray-500 group-hover:text-white transition uppercase tracking-widest font-bold">
                {metric.label}
              </span>
            </div>
            <MetricCounter 
              value={metric.value} 
              suffix={metric.suffix} 
              decimals={metric.value % 1 !== 0 ? 1 : (metric.value < 1 ? 2 : 0)}
              color={metric.color as any}
              valueClassName="text-xs font-bold"
            />
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
