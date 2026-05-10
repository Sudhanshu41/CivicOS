"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  CloudRain, 
  Database, 
  LineChart, 
  Network, 
  Radio, 
  Satellite, 
  Siren,
  TrendingUp, 
  Video, 
  Zap 
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis 
} from "recharts";

import { ConfidenceMetrics } from "../../../components/dashboard/analytics/ConfidenceMetrics";
import { IntelligenceCore } from "../../../components/dashboard/analytics/IntelligenceCore";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { GlassPanel } from "../../../components/ui/GlassPanel";

/**
 * CIVICOS — ANALYTICS & PREDICTION PAGE
 * Refactored for production-grade modularity and high-precision data visualization.
 */

const predictionData = [
  { time: "Now", traffic: 40, energy: 60, risk: 20 },
  { time: "+1h", traffic: 65, energy: 75, risk: 35 },
  { time: "+2h", traffic: 85, energy: 90, risk: 60 },
  { time: "+3h", traffic: 50, energy: 85, risk: 40 },
  { time: "+4h", traffic: 30, energy: 50, risk: 15 },
  { time: "+5h", traffic: 20, energy: 40, risk: 10 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8 min-h-[calc(100vh-10rem)]">
      
      {/* 1. Left Column: Metrics & Ingestion */}
      <div className="w-full lg:w-1/4 flex flex-col space-y-8 z-10">
        <ConfidenceMetrics />

        <GlassPanel className="p-6 flex-1">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h3 className="font-medium text-xs tracking-widest text-white uppercase">Data Ingestion</h3>
            <Database className="w-4 h-4 text-gray-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Cams", icon: Video, status: "active" },
              { label: "Sats", icon: Satellite, status: "active" },
              { label: "IoT", icon: Radio, status: "active" },
              { label: "Emerg", icon: Siren, status: "syncing" },
              { label: "Weather", icon: CloudRain, status: "active" },
              { label: "Infra", icon: Network, status: "active" },
              { label: "Social", icon: Activity, status: "syncing" },
              { label: "Power", icon: Zap, status: "active" }
            ].map((src, idx) => (
              <div 
                key={idx} 
                className="bg-white/[0.01] rounded-lg p-3 border border-white/5 hover:border-white/10 flex flex-col items-center text-center group transition"
              >
                <src.icon className="w-4 h-4 text-gray-600 group-hover:text-white mb-2 transition-colors" />
                <span className="text-[9px] font-bold text-gray-500 group-hover:text-white uppercase tracking-widest leading-none">{src.label}</span>
                <div className="mt-2">
                  <PulseIndicator status={src.status as any} size="xs" color="white" showLabel={false} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* 2. Center Column: Intelligence & Forecast */}
      <div className="w-full lg:w-2/4 flex flex-col space-y-8 z-10">
        <IntelligenceCore />

        <GlassPanel className="p-6 flex-1">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h3 className="font-medium text-xs tracking-widest text-white uppercase">Threat Forecasting</h3>
            <LineChart className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD500" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FFD500" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="white" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="white" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="time" stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '10px' }}
                  itemStyle={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area type="monotone" dataKey="traffic" name="CONGESTION" stroke="rgba(255,255,255,0.2)" fill="url(#colorTraffic)" strokeWidth={1} />
                <Area type="monotone" dataKey="risk" name="EMERGENCY" stroke="#FFD500" fill="url(#colorRisk)" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      {/* 3. Right Column: Timeline & Decisions */}
      <div className="w-full lg:w-1/4 flex flex-col space-y-8 z-10">
        
        <GlassPanel className="p-6 space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
            <h3 className="font-medium text-xs tracking-widest text-white uppercase">Forecast Timeline</h3>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="relative space-y-10 before:absolute before:inset-0 before:ml-2 before:h-full before:w-px before:bg-white/5 pt-2">
            {[
              { time: "+45M", msg: "Congestion spike predicted in Sector 9.", color: "white" },
              { time: "+2H", msg: "Bridge maintenance risk elevated to critical.", color: "yellow" },
              { time: "+6H", msg: "Water pressure drop likely in Zone B.", color: "gray" }
            ].map((evt, i) => (
              <div key={i} className="relative pl-8 group">
                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border ${evt.color === 'yellow' ? 'border-[#FFD500]' : 'border-white/20'} bg-black flex items-center justify-center z-10`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${evt.color === 'yellow' ? 'bg-[#FFD500]' : 'bg-white/40'}`} />
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5 group-hover:border-white/10 transition">
                  <div className={`text-[9px] font-bold mb-2 uppercase tracking-widest ${evt.color === 'yellow' ? 'text-[#FFD500]' : 'text-gray-500'}`}>{evt.time} Forecast</div>
                  <div className="text-[11px] text-gray-300 leading-relaxed font-medium">{evt.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-0 flex-1 flex flex-col overflow-hidden">
          <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-medium text-xs tracking-widest text-white uppercase">Auto-Decisions</h3>
            <Zap className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 p-6 pt-4 overflow-y-auto no-scrollbar">
            <ActivityFeed maxVisible={10} compact />
          </div>
        </GlassPanel>
      </div>
      
    </div>
  );
}
