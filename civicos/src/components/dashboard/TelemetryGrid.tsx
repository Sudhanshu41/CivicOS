"use client";

import { Activity } from "lucide-react";
import { MetricCounter } from "../motion/MetricCounter";
import { GlassPanel } from "../ui/GlassPanel";

/**
 * CIVICOS — TELEMETRY GRID
 * Live metrics and telemetry data display.
 */

export function TelemetryGrid() {
  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <h3 className="font-medium text-sm tracking-widest text-white uppercase">Live Telemetry</h3>
        <Activity className="w-4 h-4 text-gray-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5 hover:border-white/10 transition">
          <MetricCounter 
            value={14092} 
            fluctuate 
            fluctuateRange={18} 
            label="Active Agents" 
            color="white" 
            valueClassName="text-xl font-light" 
          />
        </div>
        <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5 hover:border-white/10 transition">
          <MetricCounter 
            value={99.8} 
            decimals={1} 
            suffix="%" 
            label="Pred. Accuracy" 
            color="white" 
            valueClassName="text-xl font-light" 
            trend="up" 
          />
        </div>
        <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5 hover:border-white/10 transition">
          <MetricCounter 
            value={96.4} 
            decimals={1} 
            suffix="%" 
            label="Infra Stability" 
            color="white" 
            valueClassName="text-xl font-light" 
            trend="stable" 
          />
        </div>
        <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5 hover:border-white/10 transition">
          <MetricCounter 
            value={42} 
            prefix="+" 
            suffix="%" 
            label="Optimization" 
            color="yellow" 
            valueClassName="text-xl font-light text-[#FFD500]" 
            trend="up" 
          />
        </div>
      </div>
    </GlassPanel>
  );
}
