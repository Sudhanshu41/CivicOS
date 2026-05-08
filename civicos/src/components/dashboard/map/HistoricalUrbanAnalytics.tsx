"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, TrendingUp, AlertCircle, 
  Map as MapIcon, Zap, Activity
} from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";

/**
 * CIVICOS — HISTORICAL URBAN ANALYTICS
 * Visualize incident density trends, escalation hotspots, and department overload history.
 * Part of the Phase 4 Historical Intelligence system.
 */
export function HistoricalUrbanAnalytics() {
  // Simulated historical data
  const trends = [
    { label: "00:00", value: 40 },
    { label: "04:00", value: 25 },
    { label: "08:00", value: 65 },
    { label: "12:00", value: 85 },
    { label: "16:00", value: 70 },
    { label: "20:00", value: 95 },
    { label: "24:00", value: 50 },
  ];

  const hotspots = [
    { zone: "Sector 4", load: "High", color: "text-rose-400" },
    { zone: "City Core", load: "Extreme", color: "text-[#FFD500]" },
    { zone: "West Industrial", load: "Nominal", color: "text-emerald-400" },
  ];

  return (
    <GlassPanel className="p-5 flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-[#FFD500]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Urban Intelligence</h3>
        </div>
        <Activity className="w-3 h-3 text-gray-600" />
      </div>

      {/* Incident Volume Trend */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-3 h-3 text-gray-500" />
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">24h Incident Volume</span>
          </div>
          <span className="text-[10px] font-mono text-[#FFD500]">+12.4%</span>
        </div>
        
        <div className="h-20 flex items-end justify-between gap-1 px-1">
          {trends.map((t, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${t.value}%` }}
                className="w-full bg-white/5 group-hover:bg-[#FFD500]/20 rounded-t-sm transition-all relative overflow-hidden"
              >
                <motion.div 
                  className="absolute bottom-0 inset-x-0 bg-white/10"
                  animate={{ height: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                />
              </motion.div>
              <span className="text-[6px] font-mono text-gray-700 mt-2 rotate-[-45deg]">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hotspots List */}
      <div className="space-y-3 pt-2">
        <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest border-l border-[#FFD500] pl-2">
          Geospatial Hotspots
        </div>
        <div className="space-y-2">
          {hotspots.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <MapIcon className="w-3 h-3 text-gray-600" />
                <span className="text-[10px] text-gray-400 font-medium">{h.zone}</span>
              </div>
              <span className={`text-[9px] font-mono uppercase font-bold ${h.color}`}>
                {h.load}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Department Overload Status */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">System Efficiency</span>
          <span className="text-[10px] font-mono text-emerald-400">92.8%</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 mb-2" />
            <div className="text-[11px] font-mono font-bold text-white">4 Critical</div>
            <div className="text-[8px] font-mono text-rose-400/60 uppercase">Escalations</div>
          </div>
          <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
            <Zap className="w-3.5 h-3.5 text-blue-400 mb-2" />
            <div className="text-[11px] font-mono font-bold text-white">12.4ms</div>
            <div className="text-[8px] font-mono text-blue-400/60 uppercase">Avg Latency</div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
