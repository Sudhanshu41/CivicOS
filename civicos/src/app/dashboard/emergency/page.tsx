"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertOctagon, 
  Ambulance, 
  BrainCircuit, 
  Building2, 
  Car, 
  CheckCircle, 
  CloudRain, 
  Flame, 
  HeartPulse, 
  Megaphone, 
  Radio, 
  ShieldAlert, 
  Siren, 
  Thermometer, 
  Zap 
} from "lucide-react";

import { TacticalMap } from "../../../components/maps/TacticalMap";
import { EmergencyFlowOverlay } from "../../../components/maps/overlays/EmergencyFlowOverlay";
import { useMapContext } from "../../../providers/MapProvider";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { LiveStatusIndicator } from "../../../components/motion/LiveStatusIndicator";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { MetricCounter } from "../../../components/motion/MetricCounter";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { staggerContainer, fadeSlideUp } from "../../../lib/motionConfig";

/**
 * CIVICOS — EMERGENCY RESPONSE PAGE
 * Refactored for production-grade modularity and mission-critical reliability.
 */
export default function EmergencyPage() {
  const { isConfigured } = useMapContext();

  return (
    <div className="flex flex-col space-y-8 min-h-[calc(100vh-10rem)]">
      
      <div className="flex flex-col xl:flex-row gap-8 flex-1">
        
        {/* 1. Left Column: Detection Hub */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          <GlassPanel className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-xs tracking-widest text-rose-500 uppercase">Crisis Detection</h3>
                <AlertOctagon className="w-4 h-4 text-rose-500" />
              </div>
              <PulseIndicator status="active" size="xs" color="rose" showLabel={false} />
            </div>

            <div className="flex-1">
              <LiveStatusIndicator />
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Response Agents</h3>
              <BrainCircuit className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Dispatch", icon: Radio, status: "active" },
                { name: "Medical", icon: Ambulance, status: "active" },
                { name: "Traffic", icon: Car, status: "syncing" },
                { name: "Infra", icon: Building2, status: "online" },
                { name: "Disaster", icon: CloudRain, status: "syncing" },
                { name: "Public", icon: Megaphone, status: "active" },
              ].map((agent, idx) => (
                <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-lg p-3 text-center group hover:border-white/10 transition flex flex-col items-center">
                  <agent.icon className="w-3.5 h-3.5 text-gray-600 mb-2 group-hover:text-white transition" />
                  <div className="text-[9px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-gray-300">{agent.name}</div>
                  <div className="mt-2">
                    <PulseIndicator status={agent.status as any} size="xs" color="white" showLabel={false} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

        </div>

        {/* 2. Center Column: Tactical Command */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-8 h-full min-h-[450px]">
          <GlassPanel className="rounded-xl overflow-hidden relative flex-1 p-0 border border-white/5 min-h-[450px]" hover={false}>
            <div className="absolute inset-0">
              {isConfigured ? (
                <TacticalMap filter="all" showHeatmap={true} showWorkflows={true}>
                  <EmergencyFlowOverlay />
                </TacticalMap>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-gray-500 font-mono text-xs uppercase tracking-widest">
                  Map Engine Offline
                </div>
              )}
            </div>
            
            <div className="absolute top-6 left-6 z-20 flex items-center space-x-3 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Tactical Command</span>
            </div>

            {/* Tactical Indicators */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between pointer-events-none">
              <div className="bg-black/80 backdrop-blur-xl px-3 py-1.5 border border-rose-500/20 rounded-md flex items-center space-x-2 pointer-events-auto">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_#f43f5e]" />
                <span className="text-[9px] font-bold tracking-widest text-rose-500 uppercase">Crisis: Isolated</span>
              </div>
              <div className="bg-black/80 backdrop-blur-xl px-3 py-1.5 border border-white/10 rounded-md flex items-center space-x-2 pointer-events-auto">
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />
                <span className="text-[9px] font-bold tracking-widest text-white uppercase">Evac Path: Secure</span>
              </div>
            </div>
          </GlassPanel>

          <motion.div 
            variants={staggerContainer}
            initial="hidden" animate="show"
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
          >
            {[
              { label: "Ambulances", val: 24, target: 30, icon: Ambulance, color: "white" },
              { label: "Police Units", val: 45, target: 50, icon: ShieldAlert, color: "white" },
              { label: "Fire Units", val: 12, target: 15, icon: Flame, color: "white" },
              { label: "Hospitals", val: 88, suffix: "%", icon: HeartPulse, color: "yellow" },
              { label: "Emerg Teams", val: 100, suffix: "%", icon: Activity, color: "white" },
              { label: "Power Grid", val: 99, suffix: "%", icon: Zap, color: "white" },
            ].map((res, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeSlideUp}
                className="glass-panel p-4 flex items-center space-x-4 hover:border-white/10 transition"
              >
                <div className="p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <res.icon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <MetricCounter 
                    value={res.val} 
                    suffix={res.suffix || (res.target ? `/${res.target}` : "")} 
                    color={res.color as any}
                    valueClassName="text-lg font-light"
                  />
                  <div className="text-[9px] text-gray-600 uppercase tracking-widest mt-1 font-bold">{res.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3. Right Column: Risk & Logs */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Risk Forecasting</h3>
              <Thermometer className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-6">
              {[
                { label: "Spread Prediction", val: 85, status: "HIGH RISK", color: "rose" },
                { label: "Vulnerability", val: 60, status: "MEDIUM", color: "white" },
                { label: "Emerg. Demand", val: 92, status: "SURGING", color: "yellow" },
              ].map((p, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                    <span>{p.label}</span>
                    <span className={p.color === 'rose' ? 'text-rose-500' : (p.color === 'yellow' ? 'text-[#FFD500]' : 'text-white')}>{p.status}</span>
                  </div>
                  <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${p.color === 'rose' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : (p.color === 'yellow' ? 'bg-[#FFD500]' : 'bg-white/40')}`} 
                      style={{ width: `${p.val}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Auto-Decisions</h3>
              <BrainCircuit className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-4 flex-1">
              {[
                { title: "Rerouting Traffic", msg: "Diverting civilian vehicles from Sector 4.", icon: CheckCircle },
                { title: "Dispatching Units", msg: "Ambulance #4 & #7 en route. ETA 3m.", icon: CheckCircle },
                { title: "Evac Protocol", msg: "Preparing broadcast to local devices.", icon: Activity, pulse: true }
              ].map((decision, idx) => (
                <div key={idx} className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-start space-x-3">
                  <decision.icon className={`w-3.5 h-3.5 text-gray-600 mt-0.5 shrink-0 ${decision.pulse && 'animate-pulse text-white'}`} />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white">{decision.title}</div>
                    <div className="text-[9px] text-gray-500 mt-1 leading-relaxed font-medium">{decision.msg}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-0 flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Crisis Log</h3>
              <Activity className="w-4 h-4 text-gray-500" />
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
