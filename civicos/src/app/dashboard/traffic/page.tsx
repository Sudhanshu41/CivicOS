"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  ArrowRightLeft, 
  BrainCircuit, 
  Car, 
  CheckCircle2, 
  Clock, 
  Map, 
  MoreHorizontal, 
  Network,
  Power, 
  Radio, 
  Route, 
  ShieldAlert, 
  Siren, 
  Train, 
  TrendingUp, 
  Zap 
} from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityFeed } from "@/components/motion/ActivityFeed";
import { LiveStatusIndicator } from "@/components/motion/LiveStatusIndicator";
import { PulseIndicator } from "@/components/motion/PulseIndicator";
import { MetricCounter } from "@/components/motion/MetricCounter";
import { ReactiveCard } from "@/components/motion/ReactiveCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { staggerContainer, fadeSlideUp } from "@/lib/motionConfig";

export default function TrafficPage() {
  const [activeSignal, setActiveSignal] = useState(0);

  // Cycle signals every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-6 min-h-[calc(100vh-8rem)] relative z-10">

      {/* Top row: Metrics with MetricCounter */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {[
          { label: "Traffic Efficiency", val: 94.2, suffix: "%", icon: TrendingUp, color: "blue" },
          { label: "Average Delay", val: 1.4, suffix: "m", icon: Clock, color: "emerald" },
          { label: "Transit Load", val: 88, suffix: "%", icon: Train, color: "purple" },
          { label: "Emerg. Route Spd", val: 40, prefix: "+", suffix: "%", icon: Siren, color: "rose" },
          { label: "Congestion Prob.", val: 12.5, suffix: "%", icon: Activity, color: "yellow" },
          { label: "AI Acc. Rate", val: 99.1, suffix: "%", icon: BrainCircuit, color: "cyan" },
        ].map((metric, idx) => (
          <ReactiveCard 
            key={idx} 
            glowColor={`rgba(var(--${metric.color}-glow), 0.15)`}
            className="glass-panel rounded-xl p-4 border border-white/5 flex flex-col justify-between group"
          >
            <div className="flex justify-between items-start mb-2">
              <metric.icon className={`w-5 h-5 opacity-80`} />
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
          
          {/* AI Traffic Intelligence Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-blue-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 mb-4 z-10 relative">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Traffic Intelligence</h3>
              </div>
              <PulseIndicator status="active" size="xs" showLabel={false} />
            </div>
            
            <div className="relative z-10">
              <LiveStatusIndicator />
            </div>
          </motion.div>

          {/* Autonomous Traffic Agents */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5 flex-1"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Mobility Agents</h3>
              </div>
              <PulseIndicator status="syncing" size="xs" showLabel={false} />
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Prediction Agent", icon: BrainCircuit, status: "Analyzing" },
                { name: "Signal Opt. Agent", icon: ArrowRightLeft, status: "Syncing" },
                { name: "Emergency Routing", icon: Siren, status: "Active" },
                { name: "Public Transit Agent", icon: Train, status: "Load Balancing" },
                { name: "Congestion Analysis", icon: Activity, status: "Monitoring" },
              ].map((agent, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-lg hover:border-purple-500/30 transition group relative overflow-hidden">
                  <div className="absolute inset-0 bg-purple-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="flex items-center space-x-3 relative z-10">
                    <agent.icon className="w-4 h-4 text-purple-400 group-hover:glow-purple transition" />
                    <span className="text-xs font-semibold">{agent.name}</span>
                  </div>
                  <PulseIndicator status={agent.status.toLowerCase().includes('analyzing') ? 'syncing' : agent.status.toLowerCase() as any} showLabel size="xs" className="relative z-10" />
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Center Column: Huge Traffic Map */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl border border-blue-500/30 overflow-hidden relative flex-1 min-h-[450px]"
          >
            {/* Map Background Layer */}
            <div className="absolute inset-0 bg-[#020008]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity grayscale"></div>
            </div>

            {/* Glowing Map Overlay Grids */}
            <div className="absolute inset-0 opacity-30 mix-blend-screen bg-grid pointer-events-none"></div>

            {/* Header overlay */}
            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-4 py-2 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Route className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Live Traffic Control Grid</span>
              </div>
            </div>

            {/* Animated SVG Traffic Routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-80" preserveAspectRatio="none">
              {/* Route 1: Main Highway */}
              <motion.path 
                d="M 10% 80% Q 40% 70% 50% 50% T 90% 20%" 
                stroke="rgba(56, 189, 248, 0.4)" 
                strokeWidth="6" 
                fill="transparent" 
                strokeLinecap="round"
              />
              <motion.path 
                d="M 10% 80% Q 40% 70% 50% 50% T 90% 20%" 
                stroke="#38bdf8" 
                strokeWidth="2" 
                strokeDasharray="4 12"
                fill="transparent" 
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Route 2: Emergency Corridor (Red) */}
              <motion.path 
                d="M 20% 10% Q 30% 50% 80% 80%" 
                stroke="rgba(244, 63, 94, 0.3)" 
                strokeWidth="8" 
                fill="transparent" 
                strokeLinecap="round"
              />
              <motion.path 
                d="M 20% 10% Q 30% 50% 80% 80%" 
                stroke="#f43f5e" 
                strokeWidth="3" 
                strokeDasharray="20 40"
                fill="transparent" 
                animate={{ strokeDashoffset: [0, 100] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="glow-rose"
              />

              {/* Route 3: Congested Route (Orange) */}
              <motion.path 
                d="M 80% 10% Q 60% 40% 30% 90%" 
                stroke="rgba(249, 115, 22, 0.5)" 
                strokeWidth="4" 
                fill="transparent" 
                strokeLinecap="round"
              />
              {/* Slow moving traffic on congested route */}
              <motion.path 
                d="M 80% 10% Q 60% 40% 30% 90%" 
                stroke="#f97316" 
                strokeWidth="2" 
                strokeDasharray="2 6"
                fill="transparent" 
                animate={{ strokeDashoffset: [0, 100] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* Intersection Nodes */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="w-8 h-8 rounded-full border-2 border-blue-400 bg-blue-900/50 flex items-center justify-center relative glow-blue">
                <div className="w-3 h-3 rounded-full bg-white animate-ping"></div>
              </div>
              <div className="absolute -bottom-6 text-[9px] font-mono text-blue-300 font-bold bg-black/60 px-2 py-0.5 rounded border border-blue-500/30 whitespace-nowrap">
                HUB: OMNI-1
              </div>
            </div>

            <div className="absolute top-[35%] left-[34%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-rose-500 bg-rose-900/50 flex items-center justify-center relative glow-rose">
                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              </div>
            </div>

            {/* Live Traffic Overlay Tooltip */}
            <div className="absolute bottom-6 right-6 z-20 glass-panel px-4 py-3 rounded-xl border border-white/10 flex items-center space-x-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono uppercase">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div> <span>Clear Flow</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono uppercase">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div> <span>Congestion</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono uppercase">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div> <span>Emerg. Corridor</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Right Column: Controls & Feeds */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* Smart Signal Control System */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Power className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Signal Control</h3>
              </div>
              <span className="text-[9px] text-emerald-400 font-mono uppercase border border-emerald-500/30 px-1.5 py-0.5 rounded">Auto Mode</span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-xs text-gray-400">Intersection 12-B</div>
              <div className="flex space-x-1">
                <div className={`w-3 h-3 rounded-full ${activeSignal === 0 ? 'bg-rose-500 glow-rose' : 'bg-rose-950'}`}></div>
                <div className={`w-3 h-3 rounded-full ${activeSignal === 1 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-yellow-950'}`}></div>
                <div className={`w-3 h-3 rounded-full ${activeSignal === 2 ? 'bg-emerald-500 glow-emerald' : 'bg-emerald-950'}`}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Adaptive Timing</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Intersection Balance</span>
                <span className="text-blue-400 font-semibold">Syncing</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Dynamic Rerouting</span>
                <span className="text-purple-400 font-semibold">Enabled</span>
              </div>
            </div>
          </motion.div>

          {/* Predictive Traffic Forecasting */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Activity className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Forecasting</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Congestion Spike (Sec 8)</span>
                  <span className="text-orange-400">65% Prob.</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[65%] shadow-[0_0_10px_#f97316]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Public Transport Demand</span>
                  <span className="text-blue-400">Surging</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[88%] shadow-[0_0_10px_#3b82f6]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Accident Probability</span>
                  <span className="text-emerald-400">Low</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[15%] shadow-[0_0_10px_#10b981]"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Transportation Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel p-0 rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Mobility Logs</h3>
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
