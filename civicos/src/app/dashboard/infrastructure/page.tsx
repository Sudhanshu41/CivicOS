"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  BatteryCharging, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  Factory, 
  HardHat, 
  Network,
  Power, 
  Radio, 
  Router, 
  ShieldAlert, 
  TrendingUp, 
  Wrench, 
  Zap 
} from "lucide-react";
import { useEffect, useState } from "react";
import { RadarSweep } from "@/components/motion/RadarSweep";
import { PulseNode } from "@/components/motion/PulseNode";
import { DataStream } from "@/components/motion/DataStream";
import { ActivityFeed } from "@/components/motion/ActivityFeed";
import { LiveStatusIndicator } from "@/components/motion/LiveStatusIndicator";
import { PulseIndicator } from "@/components/motion/PulseIndicator";
import { MetricCounter } from "@/components/motion/MetricCounter";
import { ReactiveCard } from "@/components/motion/ReactiveCard";
import { staggerContainer, fadeSlideUp } from "@/lib/motionConfig";

const infraFeed = [
  { time: "14:15:22", msg: "AI balancing energy grid demand (Sector 4).", type: "system" },
  { time: "14:15:28", msg: "Structural analysis initiated for Bridge-9.", type: "action" },
  { time: "14:15:35", msg: "Water leakage risk detected near Main Hub.", type: "warn" },
  { time: "14:15:42", msg: "Maintenance drones dispatched automatically.", type: "alert" },
  { time: "14:15:50", msg: "Infrastructure optimization completed globally.", type: "success" },
];

export default function InfrastructurePage() {
  const [powerLoad, setPowerLoad] = useState(65);

  // Animate power load dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerLoad(60 + Math.random() * 20); // fluctuate between 60 and 80
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-6 min-h-[calc(100vh-8rem)] relative z-10">

      {/* Top row: Metrics with CountUp animation */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden" 
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {[
          { label: "Infra Stability", val: 96.4, suffix: "%", icon: Activity, color: "blue",   glow: "rgba(59,130,246,0.2)" },
          { label: "Energy Efficiency",val: 14,   prefix: "+", suffix: "%", icon: Zap,      color: "yellow", glow: "rgba(234,179,8,0.2)"  },
          { label: "Water Health",     val: 100,  suffix: "%", icon: Droplet,  color: "cyan",   glow: "rgba(6,182,212,0.2)"  },
          { label: "Struct. Integrity",val: 98.2, suffix: "%", icon: Factory,  color: "emerald",glow: "rgba(16,185,129,0.2)" },
          { label: "Maint. Effic.",    val: 31,   prefix: "+", suffix: "%", icon: Wrench,   color: "purple", glow: "rgba(139,92,246,0.2)" },
          { label: "Auto Optimization",val: 99.9, suffix: "%", icon: BrainCircuit,color: "cyan", glow: "rgba(6,182,212,0.2)"  },
        ].map((metric, idx) => (
          <ReactiveCard 
            key={idx} 
            glowColor={metric.glow}
            className="glass-panel rounded-xl p-4 border border-white/5 flex flex-col justify-between group"
          >
            <div className="flex justify-between items-start mb-2">
              <metric.icon className="w-5 h-5 opacity-80" />
              <PulseIndicator status="active" size="xs" showLabel={false} />
            </div>
            <div>
              <MetricCounter 
                value={metric.val} 
                target={metric.val} 
                prefix={metric.prefix || ""} 
                suffix={metric.suffix} 
                decimals={metric.val % 1 !== 0 ? 1 : 0}
                color={metric.color as any}
                valueClassName="text-xl"
              />
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">{metric.label}</div>
            </div>
          </ReactiveCard>
        ))}
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1">
        
        {/* Left Column: Intelligence & Agents */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* AI Infrastructure Intelligence Engine */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 z-10 relative">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Intelligence Engine</h3>
              </div>
              <PulseIndicator status="active" size="xs" showLabel={false} />
            </div>
            
            <div className="relative z-10">
              <LiveStatusIndicator />
            </div>
          </motion.div>

          {/* Autonomous Infrastructure AI Agents */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5 flex-1"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Infrastructure Agents</h3>
              </div>
              <PulseIndicator status="syncing" size="xs" showLabel={false} />
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Energy Optimization", icon: Zap, status: "Active" },
                { name: "Structural Analysis", icon: Factory, status: "Scanning" },
                { name: "Water System Agent", icon: Droplet, status: "Optimizing" },
                { name: "Maint. Prediction", icon: Wrench, status: "Forecasting" },
                { name: "Health Monitor", icon: Activity, status: "Syncing" },
                { name: "Resource Allocator", icon: BrainCircuit, status: "Balancing" },
              ].map((agent, idx) => {
                const getStatus = (s: string) => {
                  const lower = s.toLowerCase();
                  if (["active", "scanning", "optimizing", "balancing"].includes(lower)) return "active";
                  if (["syncing", "forecasting"].includes(lower)) return "syncing";
                  return "online";
                };
                return (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-lg hover:border-emerald-500/30 transition group relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                    <div className="flex items-center space-x-3 relative z-10">
                      <agent.icon className="w-4 h-4 text-emerald-400 group-hover:glow-emerald transition" />
                      <span className="text-xs font-semibold">{agent.name}</span>
                    </div>
                    <PulseIndicator status={getStatus(agent.status) as any} label={agent.status} showLabel size="xs" className="relative z-10" />
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>

        {/* Center Column: Huge Infrastructure Map & Smart Utilities */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl border border-cyan-500/30 overflow-hidden relative flex-1 min-h-[400px]"
          >
            {/* Map Background Layer */}
            <div className="absolute inset-0 bg-[#000510]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-15 mix-blend-color-dodge"></div>
            </div>

            {/* Glowing Map Overlay Grids */}
            <div className="absolute inset-0 opacity-20 mix-blend-screen bg-grid pointer-events-none"></div>

            {/* Header overlay */}
            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-4 py-2 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-100">Macro Infrastructure Grid</span>
              </div>
            </div>

            {/* Animated SVG Energy & Water Routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-80" preserveAspectRatio="none">
              {/* Energy Grid Lines (Yellow) */}
              <motion.path 
                d="M 20% 80% L 30% 50% L 60% 40% L 80% 20%" 
                stroke="rgba(234, 179, 8, 0.2)" 
                strokeWidth="6" 
                fill="transparent" 
              />
              <motion.path 
                d="M 20% 80% L 30% 50% L 60% 40% L 80% 20%" 
                stroke="#eab308" 
                strokeWidth="2" 
                strokeDasharray="10 20"
                fill="transparent" 
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Water Supply Lines (Blue) */}
              <motion.path 
                d="M 80% 80% Q 50% 60% 20% 20%" 
                stroke="rgba(56, 189, 248, 0.2)" 
                strokeWidth="8" 
                fill="transparent" 
                strokeLinecap="round"
              />
              <motion.path 
                d="M 80% 80% Q 50% 60% 20% 20%" 
                stroke="#38bdf8" 
                strokeWidth="3" 
                strokeDasharray="30 60"
                fill="transparent" 
                animate={{ strokeDashoffset: [0, 100] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {/* Communication Fiber Lines (Purple) */}
              <motion.path 
                d="M 10% 40% Q 50% 20% 90% 60%" 
                stroke="rgba(168, 85, 247, 0.3)" 
                strokeWidth="3" 
                fill="transparent" 
              />
              <motion.path 
                d="M 10% 40% Q 50% 20% 90% 60%" 
                stroke="#a855f7" 
                strokeWidth="1" 
                strokeDasharray="5 15"
                fill="transparent" 
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* Hub Nodes */}
            <div className="absolute top-[50%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="w-8 h-8 rounded-full border border-yellow-400 bg-yellow-900/50 flex items-center justify-center relative glow-yellow">
                <Zap className="w-4 h-4 text-yellow-400" />
                <div className="absolute -bottom-6 text-[9px] font-mono text-yellow-300 font-bold bg-black/80 px-2 py-0.5 rounded border border-yellow-500/30 whitespace-nowrap">ENERGY CORE</div>
              </div>
            </div>

            <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="w-8 h-8 rounded-full border border-blue-400 bg-blue-900/50 flex items-center justify-center relative glow-blue">
                <Droplet className="w-4 h-4 text-blue-400" />
                <div className="absolute -bottom-6 text-[9px] font-mono text-blue-300 font-bold bg-black/80 px-2 py-0.5 rounded border border-blue-500/30 whitespace-nowrap">WATER DISTRO</div>
              </div>
            </div>

            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-purple-500 bg-purple-900/50 flex items-center justify-center relative glow-purple">
                <Router className="w-3 h-3 text-purple-400" />
              </div>
            </div>

            {/* Glowing radar sweep using RadarSweep component */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-10 opacity-60 pointer-events-none">
              <RadarSweep color="blue" />
            </div>

            {/* Vertical data stream overlay */}
            <DataStream direction="down" />

          </motion.div>

          {/* Smart Utility Management */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Power className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Utility Load Balancing</h3>
              </div>
              <span className="text-[9px] uppercase font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">Active Sync</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                <BatteryCharging className="w-6 h-6 text-yellow-400 mb-2 glow-yellow" />
                <MetricCounter value={powerLoad} target={powerLoad} fluctuate fluctuateRange={3} interval={2500} suffix="%" valueClassName="text-xl" decimals={1} />
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Energy Grid</div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                <Droplet className="w-6 h-6 text-blue-400 mb-2 glow-blue" />
                <MetricCounter value={42.8} target={42.8} fluctuate fluctuateRange={0.5} interval={3000} suffix="%" valueClassName="text-xl" decimals={1} color="blue" />
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Water Pressure</div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                <Router className="w-6 h-6 text-purple-400 mb-2 glow-purple" />
                <MetricCounter value={18.2} target={18.2} fluctuate fluctuateRange={0.2} interval={4000} suffix="TB" valueClassName="text-xl" decimals={1} color="purple" />
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Comm Bandwidth</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Analytics & Alerts */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* Emergency Infrastructure Alerts */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-rose-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-1 bg-rose-500 animate-pulse"></div>
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="font-bold text-sm tracking-wider uppercase text-rose-400">Critical Alerts</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                <Factory className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-rose-300 uppercase">Structural Instability</div>
                  <div className="text-[10px] text-gray-400 mt-1">Micro-fractures detected in support beams of Overpass 12.</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg">
                <Zap className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-orange-300 uppercase">Power Grid Surge</div>
                  <div className="text-[10px] text-gray-400 mt-1">Industrial sector pulling abnormal current. Re-routing enabled.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Predictive Maintenance Forecasting */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Predictive Maintenance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Bridge Maintenance Risk</span>
                  <span className="text-orange-400">Moderate</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[60%] shadow-[0_0_10px_#f97316]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Pipe Leakage Probability</span>
                  <span className="text-rose-400">Elevated</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[75%] shadow-[0_0_10px_#f43f5e]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Comm Network Failure</span>
                  <span className="text-emerald-400">Low</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[12%] shadow-[0_0_10px_#10b981]"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel p-0 rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Infrastructure Logs</h3>
              </div>
              <PulseIndicator status="active" size="xs" showLabel={false} />
            </div>
            <div className="flex-1 p-3 overflow-y-auto no-scrollbar">
              <ActivityFeed maxVisible={12} compact />
            </div>
          </motion.div>

        </div>
        
      </div>
    </div>
  );
}
