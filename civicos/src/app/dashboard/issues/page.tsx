"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  Eye, 
  HardHat, 
  MapPin, 
  Network,
  Radio, 
  Search, 
  ShieldAlert, 
  TrendingUp, 
  Trash2, 
  Wrench, 
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

export default function CivicIssuesPage() {
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  // Cycle workflow every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflow((prev) => (prev + 1) % 6);
    }, 2000);
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
          { label: "Active Civic Issues", val: 1248, icon: Activity, color: "blue" },
          { label: "Resolution Speed", val: 4.2, suffix: "h", icon: Clock, color: "emerald" },
          { label: "Infrastruct. Stability", val: 88, suffix: "%", icon: TrendingUp, color: "purple" },
          { label: "Citizen Satisfaction", val: 92, suffix: "%", icon: CheckCircle2, color: "cyan" },
          { label: "Detection Accuracy", val: 99.4, suffix: "%", icon: BrainCircuit, color: "yellow" },
          { label: "Maintenance Effic.", val: 24, prefix: "+", suffix: "%", icon: Wrench, color: "rose" },
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
          
          {/* AI Civic Resolution Engine */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-blue-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 mb-4 z-10 relative">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Resolution Engine</h3>
              </div>
              <PulseIndicator status="active" size="xs" showLabel={false} />
            </div>
            
            <div className="relative z-10">
              <LiveStatusIndicator />
            </div>
          </motion.div>

          {/* Autonomous Civic AI Agents */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5 flex-1"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Civic Agents</h3>
              </div>
              <PulseIndicator status="syncing" size="xs" showLabel={false} />
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Vision Detection Agent", icon: Eye, status: "Scanning" },
                { name: "Validation Agent", icon: Search, status: "Verifying" },
                { name: "Infrastructure Analysis", icon: Activity, status: "Active" },
                { name: "Routing Agent", icon: MapPin, status: "Dispatching" },
                { name: "Maintenance Coord", icon: HardHat, status: "Syncing" },
                { name: "Citizen Notification", icon: Radio, status: "Idle" },
              ].map((agent, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-lg hover:border-blue-500/30 transition group relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="flex items-center space-x-3 relative z-10">
                    <agent.icon className="w-4 h-4 text-blue-400 group-hover:glow-blue transition" />
                    <span className="text-xs font-semibold">{agent.name}</span>
                  </div>
                  <PulseIndicator status={agent.status.toLowerCase() === 'idle' ? 'offline' : (agent.status.toLowerCase() === 'active' ? 'active' : 'syncing')} showLabel size="xs" className="relative z-10" />
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Center Column: Huge Civic Map & Workflow */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl border border-purple-500/30 overflow-hidden relative flex-1 min-h-[400px]"
          >
            {/* Map Background Layer */}
            <div className="absolute inset-0 bg-[#020008]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity grayscale"></div>
            </div>

            {/* Glowing Map Overlay Grids */}
            <div className="absolute inset-0 opacity-20 mix-blend-screen bg-grid pointer-events-none"></div>

            {/* Header overlay */}
            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-4 py-2 border border-purple-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-purple-100">Live Incident Map</span>
              </div>
            </div>

            {/* Map Markers */}
            <div className="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-orange-500 bg-orange-900/50 flex items-center justify-center relative glow-orange">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <div className="absolute -bottom-6 text-[9px] font-mono text-orange-300 font-bold bg-black/80 px-2 py-0.5 rounded border border-orange-500/30 whitespace-nowrap">POTHOLE (S-7)</div>
              </div>
            </div>

            <div className="absolute top-[60%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="w-8 h-8 rounded-full border border-blue-500 bg-blue-900/50 flex items-center justify-center relative glow-blue">
                <Droplet className="w-4 h-4 text-blue-400" />
                <div className="absolute -bottom-6 text-[9px] font-mono text-blue-300 font-bold bg-black/80 px-2 py-0.5 rounded border border-blue-500/30 whitespace-nowrap">WATER LEAK</div>
              </div>
            </div>

            <div className="absolute top-[75%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-purple-500 bg-purple-900/50 flex items-center justify-center relative glow-purple">
                <Trash2 className="w-4 h-4 text-purple-400" />
                <div className="absolute -bottom-6 text-[9px] font-mono text-purple-300 font-bold bg-black/80 px-2 py-0.5 rounded border border-purple-500/30 whitespace-nowrap">WASTE OVERFLOW</div>
              </div>
            </div>

            <div className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-rose-500 bg-rose-900/50 flex items-center justify-center relative glow-rose">
                <Zap className="w-4 h-4 text-rose-400" />
                <div className="absolute -bottom-6 text-[9px] font-mono text-rose-300 font-bold bg-black/80 px-2 py-0.5 rounded border border-rose-500/30 whitespace-nowrap">STREETLIGHT FAIL</div>
              </div>
            </div>

            {/* Glowing radar sweep */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-purple-500/10 pointer-events-none"
              style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(168, 85, 247, 0.1) 100%)' }}
            />

          </motion.div>

          {/* Issue Resolution Workflow */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Network className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Resolution Workflow</h3>
            </div>
            <div className="flex items-center justify-between mt-2">
              {[
                { name: "Report", icon: Radio },
                { name: "AI Detect", icon: Eye },
                { name: "Validate", icon: Search },
                { name: "Severity", icon: AlertTriangle },
                { name: "Route", icon: ArrowRight },
                { name: "Resolve", icon: Wrench },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-[#050510] transition-all duration-500 ${
                    activeWorkflow >= idx ? 'border-blue-500 glow-blue text-blue-400' : 'border-gray-800 text-gray-600'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className={`text-[10px] mt-2 uppercase font-bold tracking-wider ${activeWorkflow >= idx ? 'text-blue-200' : 'text-gray-600'}`}>
                    {step.name}
                  </div>
                  {/* Connecting Line */}
                  {idx < 5 && (
                    <div className="absolute top-5 left-10 w-full h-[2px] bg-gray-800 -z-0" style={{ width: 'calc(100% + 2rem)' }}>
                      <motion.div 
                        className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" 
                        initial={{ width: "0%" }}
                        animate={{ width: activeWorkflow > idx ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Analytics & Alerts */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* Emergency Infrastructure Alerts */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-rose-500/30"
          >
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="font-bold text-sm tracking-wider uppercase text-rose-400">Critical Alerts</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-rose-300 uppercase">Critical Road Failure</div>
                  <div className="text-[10px] text-gray-400 mt-1">Major sinkhole risk detected on Highway 4. Maintenance required immediately.</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg">
                <Droplet className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-orange-300 uppercase">Flood Risk</div>
                  <div className="text-[10px] text-gray-400 mt-1">Drainage system overload expected in Sector 2 due to severe weather.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Predictive Infrastructure Analytics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Predictive Analytics</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Road Damage Prob.</span>
                  <span className="text-orange-400">High Risk</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[78%] shadow-[0_0_10px_#f97316]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Waste Mgmt Overload</span>
                  <span className="text-purple-400">82% Cap.</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[82%] shadow-[0_0_10px_#a855f7]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Maintenance Demand</span>
                  <span className="text-blue-400">Stable</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[45%] shadow-[0_0_10px_#3b82f6]"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Civic Issue Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel p-0 rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Live Civic Feed</h3>
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
