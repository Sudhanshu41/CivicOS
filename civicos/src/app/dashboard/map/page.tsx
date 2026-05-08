"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  Car, 
  Crosshair, 
  Eye, 
  MapPin, 
  Navigation, 
  Signal, 
  Siren, 
  Zap 
} from "lucide-react";

import { MapBase } from "../../../components/dashboard/map/MapBase";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { LiveStatusIndicator } from "../../../components/motion/LiveStatusIndicator";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { MetricCounter } from "../../../components/motion/MetricCounter";
import { GlassPanel } from "../../../components/ui/GlassPanel";

/**
 * CIVICOS — DIGITAL TWIN MAP PAGE
 * Refactored for production-grade modularity and high-fidelity smart city visualization.
 */
export default function DigitalTwinMapPage() {
  return (
    <div className="relative w-full h-[calc(100vh-10rem)] overflow-hidden rounded-2xl border border-white/5 bg-black flex flex-col">
      
      {/* 1. Map Foundation & Markers */}
      <MapBase />

      {/* 2. Top Navigation Overlays */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20 pointer-events-none">
        
        {/* Left: AI Insights */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="w-80 space-y-4 pointer-events-auto"
        >
          <div className="flex items-center justify-between text-white mb-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <h3 className="font-bold uppercase tracking-[0.2em] text-[10px]">Live Insights</h3>
            </div>
            <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
          </div>
          
          <GlassPanel className="p-3">
            <LiveStatusIndicator />
          </GlassPanel>
        </motion.div>

        {/* Right: Emergency Hub */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="w-80 space-y-4 pointer-events-auto"
        >
          <GlassPanel className="overflow-hidden border-[#FFD500]/10">
            <div className="bg-white/[0.02] p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Siren className="w-3.5 h-3.5 text-[#FFD500]" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Active Emergency</span>
              </div>
              <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">T-Minus 02:14</div>
            </div>
            <div className="p-5">
              <div className="text-xs font-bold text-white uppercase tracking-widest mb-1">Sector 4 Structural Fire</div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium mb-5">Engines 4, 7, & 9 dispatched. Autonomous drone routing active. Monitoring structural integrity.</p>
              <button className="w-full py-2 bg-white/[0.01] hover:bg-white/[0.05] border border-white/5 rounded-lg text-[9px] text-white font-bold tracking-[0.2em] uppercase transition-all">
                View Protocols
              </button>
            </div>
          </GlassPanel>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <GlassPanel className="p-4 flex flex-col items-center text-center">
              <Activity className="w-3.5 h-3.5 text-gray-500 mb-2" />
              <MetricCounter value={94} target={94} suffix="%" color="white" valueClassName="text-lg font-light" />
              <div className="text-[8px] text-gray-600 uppercase tracking-[0.2em] mt-1 font-bold">Infra Health</div>
            </GlassPanel>
            <GlassPanel className="p-4 flex flex-col items-center text-center">
              <Zap className="w-3.5 h-3.5 text-gray-500 mb-2" />
              <MetricCounter value={12} target={12} suffix="MW" color="yellow" valueClassName="text-lg font-light" />
              <div className="text-[8px] text-gray-600 uppercase tracking-[0.2em] mt-1 font-bold">Grid Load</div>
            </GlassPanel>
          </div>
        </motion.div>
      </div>

      {/* 3. Bottom Interface Overlays */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 pointer-events-none flex justify-between items-end">
        
        {/* Left: Map Interaction Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex flex-col space-y-2 pointer-events-auto"
        >
          <GlassPanel className="p-1 flex flex-col space-y-1">
            {[Navigation, Crosshair, MapPin].map((Icon, i) => (
              <button key={i} className="p-2.5 hover:bg-white/[0.05] rounded-lg transition-colors text-gray-500 hover:text-white">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </GlassPanel>
        </motion.div>

        {/* Center: Traffic Intelligence Dashboard */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex-1 max-w-xl mx-8 pointer-events-auto"
        >
          <GlassPanel className="p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center space-x-3">
                <Car className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Traffic Intelligence</span>
              </div>
              <div className="text-[9px] text-gray-600 uppercase tracking-[0.1em] font-bold">Balancing Active</div>
            </div>
            
            <div className="space-y-6">
              {[
                { label: "Downtown Arterial", status: "Congested", val: 75, color: "yellow" },
                { label: "Highway Route 66", status: "Clear Flow", val: 20, color: "white" }
              ].map((route, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                    <span>{route.label}</span>
                    <span className={route.color === 'yellow' ? 'text-[#FFD500]' : 'text-white'}>{route.status}</span>
                  </div>
                  <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${route.color === 'yellow' ? 'bg-[#FFD500]' : 'bg-white/40'}`} style={{ width: `${route.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Right: Real-time Telemetry Feed */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="w-80 pointer-events-auto"
        >
          <GlassPanel className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center space-x-3">
                <Signal className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Live Telemetry</span>
              </div>
              <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
            </div>
            <div className="h-40 p-4 pt-2 overflow-y-auto no-scrollbar">
              <ActivityFeed maxVisible={5} compact />
            </div>
          </GlassPanel>
        </motion.div>

      </div>
    </div>
  );
}
