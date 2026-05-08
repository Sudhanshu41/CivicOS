"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  BrainCircuit, 
  Building2, 
  Car, 
  Cpu, 
  Database, 
  HeartPulse, 
  Leaf, 
  Network, 
  Radio, 
  ShieldAlert, 
  Siren, 
  Zap 
} from "lucide-react";
import { useEffect, useState } from "react";
import { AIWavePulse } from "@/components/motion/AIWavePulse";
import { PulseNode } from "@/components/motion/PulseNode";
import { HoloGrid } from "@/components/motion/HoloGrid";
import { DataStream } from "@/components/motion/DataStream";
import { NeuralPath } from "@/components/motion/NeuralPath";
import { ActivityFeed } from "@/components/motion/ActivityFeed";
import { LiveStatusIndicator } from "@/components/motion/LiveStatusIndicator";
import { PulseIndicator } from "@/components/motion/PulseIndicator";
import { MetricCounter } from "@/components/motion/MetricCounter";
import { ReactiveCard } from "@/components/motion/ReactiveCard";
import { staggerContainer, fadeSlideUp } from "@/lib/motionConfig";

export default function MasterCorePage() {
  const [pulse, setPulse] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] relative">
      
      {/* Background Ambience & Neural Intelligence Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#030014]/90 to-[#030014] rounded-full blur-[120px]"></div>
        <HoloGrid />
        <DataStream direction="right" />
        {/* Neural pathways radiating from center using viewBox */}
        <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
          <NeuralPath d="M 500 350 L 100 140" color="#3b82f6" duration={3} delay={0} />
          <NeuralPath d="M 500 350 L 900 140" color="#a855f7" duration={3.5} delay={0.5} />
          <NeuralPath d="M 500 350 L 100 560" color="#a855f7" duration={4} delay={1} />
          <NeuralPath d="M 500 350 L 900 560" color="#3b82f6" duration={2.5} delay={0.2} />
          <NeuralPath d="M 500 350 L 500 70"  color="#06b6d4" duration={3.8} delay={0.8} />
          <NeuralPath d="M 500 350 L 500 630" color="#06b6d4" duration={3.2} delay={0.3} />
        </svg>
      </div>

      {/* Top AI Status Indicators */}
      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-2 md:grid-cols-6 gap-4 z-10 mb-6"
      >
        {[
          { label: "Intelligence Level", val: "Omni-5",   color: "text-purple-400", border: "border-purple-500/30", glow: "rgba(139,92,246,0.2)" },
          { label: "Active Agents",      val: "14,092",   color: "text-blue-400",   border: "border-blue-500/30",   glow: "rgba(59,130,246,0.2)" },
          { label: "Prediction Acc.",    val: "99.8%",    color: "text-emerald-400",border: "border-emerald-500/30",glow: "rgba(16,185,129,0.2)" },
          { label: "Infra Stability",    val: "Optimal",  color: "text-cyan-400",   border: "border-cyan-500/30",   glow: "rgba(6,182,212,0.2)"  },
          { label: "City Optimization",  val: "+42%",     color: "text-yellow-400", border: "border-yellow-500/30", glow: "rgba(234,179,8,0.2)"  },
          { label: "Response Ready",     val: "Level 1",  color: "text-rose-400",   border: "border-rose-500/30",   glow: "rgba(244,63,94,0.2)"  },
        ].map((stat, idx) => (
          <ReactiveCard key={idx} glowColor={stat.glow} tiltStrength={6} hoverLift={4}
            className={`glass-panel border ${stat.border} rounded-xl p-3 text-center cursor-default`}
          >
            <div className={`text-sm font-bold ${stat.color} mb-1`}>{stat.val}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">{stat.label}</div>
          </ReactiveCard>
        ))}
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-6 z-10 flex-1">
        
        {/* Left Column */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* Autonomous Subsystems */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-white/5 flex-1"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Network className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Active Subsystems</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "Traffic Engine", icon: Car, acc: "98%", status: "Active" },
                { name: "Emergency Coord", icon: Siren, acc: "99%", status: "Active" },
                { name: "Predictive Analytics", icon: BrainCircuit, acc: "95%", status: "Processing" },
                { name: "Infra Monitor", icon: Building2, acc: "100%", status: "Active" },
                { name: "Environmental AI", icon: Leaf, acc: "92%", status: "Active" },
                { name: "Gov Resources", icon: Database, acc: "96%", status: "Syncing" },
              ].map((sys, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-2.5 flex items-center justify-between border border-white/5 hover:border-blue-500/30 transition group">
                  <div className="flex items-center space-x-3">
                    <sys.icon className={`w-4 h-4 ${sys.status === 'Processing' ? 'text-purple-400' : 'text-blue-400'}`} />
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition">{sys.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-400 font-mono">{sys.acc} ACC</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* City Health Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">City Health Vector</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Civic Satisfaction", val: 92, color: "bg-blue-500" },
                { label: "Emergency Readiness", val: 100, color: "bg-rose-500" },
                { label: "Environmental Quality", val: 84, color: "bg-emerald-500" },
                { label: "Transport Efficiency", val: 96, color: "bg-purple-500" },
              ].map((health, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[10px] text-gray-400 uppercase mb-1">
                    <span>{health.label}</span>
                    <span className="font-mono text-white">{health.val}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${health.val}%` }} transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                      className={`h-full ${health.color} shadow-[0_0_10px_currentColor]`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Center Column: The Massive AI Core */}
        <div className="w-full xl:w-2/4 flex items-center justify-center relative min-h-[500px]">
          
          <div className="relative w-[420px] h-[420px] flex items-center justify-center" style={{ perspective: 1200 }}>

            {/* AI Wave Pulse Rings */}
            <div className="absolute w-80 h-80">
              <AIWavePulse color="blue" count={4} delayOffset={0.7} />
            </div>
            <div className="absolute w-56 h-56">
              <AIWavePulse color="purple" count={3} delayOffset={0.9} />
            </div>

            {/* Outer Rotating 3D Energy Rings */}
            <motion.div 
              animate={{ rotateX: 360, rotateY: 180 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[380px] h-[380px] border border-blue-500/30 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div 
              animate={{ rotateX: -180, rotateY: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[330px] h-[330px] border border-purple-500/30 border-dashed rounded-full shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              style={{ transformStyle: "preserve-3d" }}
            />
            
            {/* Inner Rotating Reactor Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-64 h-64 border-[3px] border-dashed border-blue-400/50 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-52 h-52 border-[2px] border-dotted border-cyan-400/60 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            />

            {/* Orbiting Intelligence Nodes */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                className="absolute w-64 h-64"
              >
                <div
                  className="absolute"
                  style={{ top: "0%", left: "50%", transform: `rotate(${deg}deg) translateX(-50%) translateY(-50%)` }}
                >
                  <PulseNode color={i % 2 === 0 ? "blue" : "purple"} size="w-3 h-3" />
                </div>
              </motion.div>
            ))}

            {/* Holographic Neural Core Sphere */}
            <motion.div 
              animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-44 h-44 bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 rounded-full blur-lg"
            />
            <motion.div 
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-52 h-52 bg-gradient-to-tr from-purple-500/40 to-blue-500/40 rounded-full blur-2xl"
            />
            
            {/* Core Center Emblem */}
            <div className="relative z-10 w-28 h-28 bg-black/90 backdrop-blur-2xl border-2 border-blue-400/50 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(56,189,248,0.7),inset_0_0_20px_rgba(59,130,246,0.1)]">
              <Cpu className={`w-12 h-12 ${pulse ? 'text-white drop-shadow-[0_0_15px_#fff]' : 'text-blue-300 drop-shadow-[0_0_8px_#3b82f6]'} transition-all duration-500`} />
            </div>

            {/* Floating Intelligence Particles */}
            {mounted && [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, ((i * 137) % 200 - 100), 0],
                  y: [0, ((i * 193) % 200 - 100), 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className="absolute w-2 h-2 bg-purple-400 rounded-full glow-purple"
              />
            ))}
          </div>

          {/* Central Overlay UI */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 border border-blue-500/30 rounded-full flex items-center space-x-3">
             <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse glow-blue"></div>
             <span className="text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase">
               Master Control Active
             </span>
          </div>

        </div>

        {/* Right Column - Live Intelligence Panel */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-5">
          
          {/* System Status Monitor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-4 rounded-2xl border border-white/[0.06] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/8 rounded-full blur-2xl" />
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs tracking-wider uppercase">System Status</h3>
              </div>
              <PulseIndicator status="online" size="xs" showLabel={false} />
            </div>
            <LiveStatusIndicator />
          </motion.div>

          {/* Live Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
            className="glass-panel p-4 rounded-2xl border border-white/[0.06] relative overflow-hidden"
          >
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs tracking-wider uppercase">Live Telemetry</h3>
              <span className="ml-auto">
                <PulseIndicator status="active" size="xs" showLabel={false} />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <MetricCounter value={14092} target={14092} fluctuate fluctuateRange={18} interval={2200} label="Active Agents" color="blue" valueClassName="text-base" />
              </div>
              <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <MetricCounter value={99.8} target={99.8} fluctuate fluctuateRange={0.3} interval={3000} decimals={1} suffix="%" label="Pred. Accuracy" color="emerald" valueClassName="text-base" trend="up" />
              </div>
              <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <MetricCounter value={96.4} target={96.4} fluctuate fluctuateRange={1.5} interval={2800} decimals={1} suffix="%" label="Infra Stability" color="cyan" valueClassName="text-base" trend="stable" />
              </div>
              <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <MetricCounter value={42} target={42} fluctuate fluctuateRange={2} interval={4000} prefix="+" suffix="%" label="Optimization" color="purple" valueClassName="text-base" trend="up" />
              </div>
            </div>
          </motion.div>

          {/* Live AI Consciousness Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-0 rounded-2xl border border-white/[0.06] flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-3.5 border-b border-white/[0.05] flex items-center justify-between shrink-0"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs tracking-wider uppercase">AI Consciousness Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                <PulseIndicator status="active" size="xs" showLabel={false} />
                <span className="text-[9px] font-mono text-gray-600">LIVE</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
              <ActivityFeed maxVisible={10} compact />
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
