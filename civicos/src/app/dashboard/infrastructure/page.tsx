"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  BatteryCharging, 
  BrainCircuit, 
  Droplet, 
  Factory, 
  Network,
  Power, 
  Radio, 
  Router, 
  ShieldAlert, 
  Wrench, 
  Zap 
} from "lucide-react";
import { useEffect, useState } from "react";

import { InfraMetrics } from "../../../components/dashboard/infrastructure/InfraMetrics";
import { TacticalMap } from "../../../components/maps/TacticalMap";
import { InfrastructureIntelligenceOverlay } from "../../../components/maps/overlays/InfrastructureIntelligenceOverlay";
import { useMapContext } from "../../../providers/MapProvider";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { LiveStatusIndicator } from "../../../components/motion/LiveStatusIndicator";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { MetricCounter } from "../../../components/motion/MetricCounter";
import { GlassPanel } from "../../../components/ui/GlassPanel";

/**
 * CIVICOS — INFRASTRUCTURE MONITORING PAGE
 * Refactored for production-grade modularity and advanced city intelligence.
 */
export default function InfrastructurePage() {
  const [powerLoad, setPowerLoad] = useState(65);
  const { isConfigured } = useMapContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setPowerLoad(60 + Math.random() * 20);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-8 min-h-[calc(100vh-10rem)] relative z-10">

      {/* 1. Global Infrastructure Metrics */}
      <InfraMetrics />

      <div className="flex flex-col xl:flex-row gap-8 flex-1">
        
        {/* 2. Left Column: Subsystems */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          {/* Intelligence Engine */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Intelligence Hub</h3>
              <BrainCircuit className="w-4 h-4 text-gray-500" />
            </div>
            <LiveStatusIndicator />
          </GlassPanel>

          {/* Infra Agents List */}
          <GlassPanel className="p-6 flex-1">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Infra Agents</h3>
              <Network className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Energy Optimization", icon: Zap, status: "active" },
                { name: "Structural Analysis", icon: Factory, status: "syncing" },
                { name: "Water System", icon: Droplet, status: "active" },
                { name: "Maint. Prediction", icon: Wrench, status: "syncing" },
                { name: "Health Monitor", icon: Activity, status: "active" },
              ].map((agent, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-lg hover:border-white/10 transition group">
                  <div className="flex items-center space-x-3">
                    <agent.icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{agent.name}</span>
                  </div>
                  <PulseIndicator status={agent.status as any} showLabel={false} size="xs" color="white" />
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* 3. Center Column: Grid View & Load Balancing */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-8">
          <GlassPanel className="relative flex-1 min-h-[400px] overflow-hidden p-0 rounded-xl border border-white/5" hover={false}>
            <div className="absolute inset-0">
              {isConfigured ? (
                <TacticalMap filter="infrastructure" showHeatmap={true} showWorkflows={true}>
                  <InfrastructureIntelligenceOverlay />
                </TacticalMap>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-gray-500 font-mono text-xs uppercase tracking-widest">
                  Map Engine Offline
                </div>
              )}
            </div>
            <div className="absolute top-6 left-6 z-20 flex items-center space-x-3 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Infrastructure Grid</span>
            </div>
          </GlassPanel>

          {/* Load Balancing Grid */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Load Balancing</h3>
              <Power className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-white/10 transition">
                <BatteryCharging className="w-5 h-5 text-[#FFD500] mb-4" />
                <MetricCounter value={powerLoad} fluctuate fluctuateRange={3} suffix="%" valueClassName="text-2xl font-light text-white" decimals={1} color="white" />
                <div className="text-[9px] text-gray-600 uppercase tracking-[0.2em] mt-2 font-bold">Energy Grid</div>
              </div>
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-white/10 transition">
                <Droplet className="w-5 h-5 text-gray-400 mb-4" />
                <MetricCounter value={42.8} fluctuate fluctuateRange={0.5} suffix="%" valueClassName="text-2xl font-light text-white" decimals={1} color="white" />
                <div className="text-[9px] text-gray-600 uppercase tracking-[0.2em] mt-2 font-bold">Water PSI</div>
              </div>
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-white/10 transition">
                <Router className="w-5 h-5 text-gray-400 mb-4" />
                <MetricCounter value={18.2} fluctuate fluctuateRange={0.2} suffix="TB" valueClassName="text-2xl font-light text-white" decimals={1} color="white" />
                <div className="text-[9px] text-gray-600 uppercase tracking-[0.2em] mt-2 font-bold">Bandwidth</div>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* 4. Right Column: Alerts & Logs */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          {/* Critical Alerts */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Critical Alerts</h3>
              <ShieldAlert className="w-4 h-4 text-gray-500" />
            </div>

            <div className="space-y-4">
              {[
                { label: "Structural Instability", msg: "Micro-fractures detected in Overpass 12 beams.", icon: Factory, color: "gray" },
                { label: "Power Grid Surge", msg: "Abnormal current in Industrial Sector 4.", icon: Zap, color: "yellow" }
              ].map((alert, i) => (
                <div key={i} className="flex items-start space-x-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <alert.icon className={`w-4 h-4 ${alert.color === 'yellow' ? 'text-[#FFD500]' : 'text-gray-500'} shrink-0 mt-0.5`} />
                  <div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-widest">{alert.label}</div>
                    <div className="text-[10px] text-gray-500 mt-1 leading-relaxed font-medium">{alert.msg}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Predictive Maintenance */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Maintenance</h3>
              <Wrench className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-8">
              {[
                { label: "Bridge Maintenance", val: 60, status: "MODERATE", color: "white" },
                { label: "Pipe Leakage Risk", val: 75, status: "ELEVATED", color: "yellow" },
              ].map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-3">
                    <span>{p.label}</span>
                    <span className={p.color === 'yellow' ? 'text-[#FFD500]' : 'text-white'}>{p.status}</span>
                  </div>
                  <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color === 'yellow' ? 'bg-[#FFD500]' : 'bg-white/40'}`} style={{ width: `${p.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Infrastructure Logs */}
          <GlassPanel className="p-0 flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Infra Logs</h3>
              <Radio className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 p-6 pt-4 overflow-y-auto no-scrollbar">
              <ActivityFeed maxVisible={12} compact />
            </div>
          </GlassPanel>

        </div>
        
      </div>
    </div>
  );
}
