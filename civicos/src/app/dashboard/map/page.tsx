"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  Battery, 
  Car, 
  ChevronRight, 
  Crosshair, 
  Eye, 
  Flame, 
  MapPin, 
  Navigation, 
  Radio, 
  ShieldAlert, 
  Signal, 
  Siren, 
  Wifi, 
  Zap 
} from "lucide-react";

import { ActivityFeed } from "@/components/motion/ActivityFeed";
import { LiveStatusIndicator } from "@/components/motion/LiveStatusIndicator";
import { PulseIndicator } from "@/components/motion/PulseIndicator";
import { MetricCounter } from "@/components/motion/MetricCounter";
import { ReactiveCard } from "@/components/motion/ReactiveCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { staggerContainer, fadeSlideUp } from "@/lib/motionConfig";

import { RadarSweep } from "@/components/motion/RadarSweep";

export default function DigitalTwinMapPage() {
  return (
    <div className="relative w-full h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-white/10 glass-panel flex flex-col">
      
      {/* Background City Map Layer */}
      <div className="absolute inset-0 bg-[#02000a] z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale"></div>
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-grid opacity-30 mix-blend-screen"></div>
        {/* Radial dark gradient to focus on center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030014]/80 to-[#030014] z-0"></div>
      </div>

      {/* Holographic Radar/Scanning Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0 pointer-events-none opacity-40">
        <RadarSweep color="blue" />
      </div>

      {/* Map Nodes and Markers */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Node 1 */}
        <motion.div 
          className="absolute top-[30%] left-[40%] flex flex-col items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <div className="w-12 h-12 rounded-full border border-blue-400 bg-blue-500/10 flex items-center justify-center glow-blue pointer-events-auto cursor-pointer group hover:bg-blue-500/30 transition">
            <Radio className="w-5 h-5 text-blue-400 group-hover:animate-pulse" />
          </div>
          <div className="mt-2 glass-panel px-2 py-1 rounded text-[10px] text-blue-300 font-mono">NODE_ALPHA</div>
        </motion.div>

        {/* Node 2 - Emergency */}
        <motion.div 
          className="absolute top-[45%] left-[60%] flex flex-col items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-rose-500 bg-rose-500/20 flex items-center justify-center pointer-events-auto cursor-pointer group animate-pulse">
            <Flame className="w-6 h-6 text-rose-400" />
            <div className="absolute inset-0 border border-rose-500 rounded-full animate-ping"></div>
          </div>
          <div className="mt-2 bg-rose-500/20 border border-rose-500/50 px-2 py-1 rounded text-[10px] text-rose-300 font-mono font-bold">FIRE ALARM SEC-4</div>
        </motion.div>

        {/* Node 3 - Traffic */}
        <motion.div 
          className="absolute top-[60%] left-[30%] flex flex-col items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        >
          <div className="w-10 h-10 rounded-full border border-purple-500 bg-purple-500/20 flex items-center justify-center glow-purple pointer-events-auto cursor-pointer">
            <Car className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 glass-panel px-2 py-1 rounded text-[10px] text-purple-300 font-mono">TRAFFIC_HUB_X</div>
        </motion.div>

        {/* SVG connecting lines between nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
           <motion.path 
             d="M 40% 30% L 60% 45%" 
             stroke="rgba(56, 189, 248, 0.5)" 
             strokeWidth="2" 
             strokeDasharray="5,5" 
             fill="transparent"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           />
           <motion.path 
             d="M 40% 30% L 30% 60%" 
             stroke="rgba(168, 85, 247, 0.5)" 
             strokeWidth="2" 
             fill="transparent"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 1.5 }}
           />
           {/* Moving data packets along the line */}
           <circle cx="0" cy="0" r="3" fill="#38bdf8">
             <animateMotion dur="2s" repeatCount="indefinite" path="M 40% 30% L 60% 45%" />
           </circle>
        </svg>
      </div>

      {/* Top Bar Overlays */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
        
        {/* Left: AI Insights Panel */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="w-80 space-y-4 pointer-events-auto"
        >
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-sm">Live AI Insights</h3>
            </div>
            <PulseIndicator status="active" size="xs" showLabel={false} />
          </div>
          
          <div className="glass-panel p-2 rounded-xl border border-white/5">
            <LiveStatusIndicator />
          </div>
        </motion.div>

        {/* Right: Emergency & Status */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="w-72 space-y-4 pointer-events-auto"
        >
          {/* Emergency Panel */}
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl overflow-hidden backdrop-blur-md">
            <div className="bg-rose-500/20 p-3 flex items-center justify-between border-b border-rose-500/30">
              <div className="flex items-center space-x-2">
                <Siren className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="text-xs font-bold text-rose-400 uppercase">Active Emergency</span>
              </div>
              <div className="text-[10px] font-mono text-rose-300">02:14</div>
            </div>
            <div className="p-3">
              <div className="text-sm font-semibold mb-1">Sector 4 Structural Fire</div>
              <div className="text-xs text-gray-400 mb-3">Engines 4, 7, & 9 dispatched. Autonomous drone routing active.</div>
              <button className="w-full py-1.5 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/50 rounded text-xs text-rose-300 font-bold transition">View Protocol</button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <ReactiveCard className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center text-center group">
              <Activity className="w-4 h-4 text-emerald-400 mb-1" />
              <MetricCounter value={94} target={94} suffix="%" color="emerald" valueClassName="text-lg" />
              <div className="text-[9px] text-gray-500 uppercase tracking-widest">Infra Health</div>
            </ReactiveCard>
            <ReactiveCard className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center text-center group">
              <Zap className="w-4 h-4 text-blue-400 mb-1" />
              <MetricCounter value={12} target={12} suffix="MW" color="blue" valueClassName="text-lg" />
              <div className="text-[9px] text-gray-500 uppercase tracking-widest">Grid Load</div>
            </ReactiveCard>
          </div>
        </motion.div>

      </div>

      {/* Bottom Bar Overlays */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none flex justify-between items-end">
        
        {/* Left: Map Controls */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex space-x-2 pointer-events-auto"
        >
          <div className="glass-panel rounded-lg p-1 flex flex-col space-y-1 border border-white/10">
            <button className="p-2 hover:bg-white/10 rounded transition text-gray-400 hover:text-white"><Navigation className="w-5 h-5" /></button>
            <div className="w-full h-px bg-white/10"></div>
            <button className="p-2 hover:bg-white/10 rounded transition text-gray-400 hover:text-white"><Crosshair className="w-5 h-5" /></button>
            <div className="w-full h-px bg-white/10"></div>
            <button className="p-2 hover:bg-white/10 rounded transition text-gray-400 hover:text-white"><MapPin className="w-5 h-5" /></button>
          </div>
        </motion.div>

        {/* Center: Traffic Intelligence Bar */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex-1 max-w-xl mx-8 pointer-events-auto"
        >
          <div className="glass-panel rounded-xl border border-blue-500/20 p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Traffic Intelligence</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">BALANCING ACTIVE</div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Downtown Arterial</span>
                  <span className="text-orange-400">Congested</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[75%] shadow-[0_0_10px_#f97316]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Highway Route 66</span>
                  <span className="text-emerald-400">Clear</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[20%] shadow-[0_0_10px_#10b981]"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Data Stream Feed */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="w-64 glass-panel rounded-xl border border-white/10 pointer-events-auto flex flex-col overflow-hidden"
        >
           <div className="flex items-center justify-between p-3 border-b border-white/5 bg-black/20">
             <div className="flex items-center space-x-2">
               <Signal className="w-4 h-4 text-purple-400" />
               <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Live Feed</span>
             </div>
             <PulseIndicator status="active" size="xs" showLabel={false} />
           </div>
           <div className="h-32 p-2">
             <ActivityFeed maxVisible={5} compact />
           </div>
        </motion.div>

      </div>
    </div>
  );
}
