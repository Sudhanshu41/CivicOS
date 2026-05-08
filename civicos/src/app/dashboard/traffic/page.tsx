"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  ArrowRightLeft, 
  BrainCircuit, 
  Network,
  Power, 
  Radio, 
  Siren, 
  Train 
} from "lucide-react";
import { useEffect, useState } from "react";

import { TrafficMetrics } from "../../../components/dashboard/traffic/TrafficMetrics";
import { TacticalMap } from "../../../components/maps/TacticalMap";
import { TrafficFlowOverlay } from "../../../components/maps/overlays/TrafficFlowOverlay";
import { useMapContext } from "../../../providers/MapProvider";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { LiveStatusIndicator } from "../../../components/motion/LiveStatusIndicator";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { GlassPanel } from "../../../components/ui/GlassPanel";

/**
 * CIVICOS — TRAFFIC INTELLIGENCE PAGE
 * Refactored for modularity, readability, and production-grade engineering.
 */
export default function TrafficPage() {
  const [activeSignal, setActiveSignal] = useState(0);
  const { isConfigured } = useMapContext();

  // Simulation: Signal cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-8 min-h-[calc(100vh-10rem)] relative z-10">

      {/* 1. Global Traffic Metrics */}
      <TrafficMetrics />

      <div className="flex flex-col xl:flex-row gap-8 flex-1">
        
        {/* 2. Left Column: Intelligence Hub */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          {/* Intelligence Monitor */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-xs tracking-widest text-white uppercase">Intelligence</h3>
                <BrainCircuit className="w-4 h-4 text-gray-500" />
              </div>
              <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
            </div>
            <LiveStatusIndicator />
          </GlassPanel>

          {/* Mobility Agents List */}
          <GlassPanel className="p-6 flex-1">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-xs tracking-widest text-white uppercase">Mobility Agents</h3>
                <Network className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Prediction", icon: BrainCircuit, status: "online" },
                { name: "Signal Opt.", icon: ArrowRightLeft, status: "syncing" },
                { name: "Emergency", icon: Siren, status: "active" },
                { name: "Transit", icon: Train, status: "active" },
                { name: "Congestion", icon: Activity, status: "online" },
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

        {/* 3. Center Column: Live Control Map */}
        <div className="w-full xl:w-2/4 flex flex-col h-full min-h-[450px]">
          <GlassPanel className="relative flex-1 overflow-hidden p-0 rounded-xl border border-white/5" hover={false}>
            {isConfigured ? (
              <TacticalMap filter="traffic" showHeatmap={true} showWorkflows={true}>
                <TrafficFlowOverlay />
              </TacticalMap>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-gray-500 font-mono text-xs uppercase tracking-widest">
                Map Engine Offline
              </div>
            )}
            {/* Overlay Header */}
            <div className="absolute top-6 left-6 z-20 flex items-center space-x-3 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Live Traffic Control Grid</span>
            </div>
          </GlassPanel>
        </div>

        {/* 4. Right Column: Controls & Feeds */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          {/* Signal Control Panel */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Signal Control</h3>
              <Power className="w-4 h-4 text-gray-500" />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500">Node: 12-B</div>
              <div className="flex space-x-2">
                {[0, 1, 2].map(idx => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    activeSignal === idx 
                      ? (idx === 1 ? 'bg-[#FFD500] shadow-[0_0_8px_#FFD500]' : 'bg-white shadow-[0_0_8px_white]') 
                      : 'bg-white/5'
                  }`} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {['Adaptive Timing', 'Intersection Balance', 'Dynamic Rerouting'].map((label, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-white">Active</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Traffic Forecasting */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Forecasting</h3>
              <Activity className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-6">
              {[
                { label: "Spike Prob (Sec 8)", val: 65, color: "yellow" },
                { label: "Transit Demand", val: 88, color: "white" },
                { label: "Collision Prob.", val: 12, color: "gray" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                    <span>{item.label}</span>
                    <span className={item.color === 'yellow' ? 'text-[#FFD500]' : 'text-white'}>{item.val}%</span>
                  </div>
                  <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color === 'yellow' ? 'bg-[#FFD500]' : (item.color === 'gray' ? 'bg-gray-700' : 'bg-white')}`} 
                      style={{ width: `${item.val}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Mobility Logs Feed */}
          <GlassPanel className="p-0 flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Mobility Logs</h3>
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
