"use client";

import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { GlassPanel } from "../ui/GlassPanel";

/**
 * CIVICOS — HEALTH PANEL
 * Visualizing real-time city health metrics.
 */

const healthMetrics = [
  { label: "Civic Satisfaction", val: 92 },
  { label: "Emergency Readiness", val: 100 },
  { label: "Environmental Quality", val: 84 },
  { label: "Transport Efficiency", val: 96 },
];

export function HealthPanel() {
  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <h3 className="font-medium text-sm tracking-widest text-white uppercase">System Health</h3>
        <HeartPulse className="w-4 h-4 text-gray-500" />
      </div>
      
      <div className="space-y-6">
        {healthMetrics.map((health, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest mb-2">
              <span>{health.label}</span>
              <span className="font-mono text-white">{health.val}%</span>
            </div>
            <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${health.val}%` }} 
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 * idx }}
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
