"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertOctagon, 
  AlertTriangle, 
  Ambulance, 
  BrainCircuit, 
  Building2, 
  Car, 
  CheckCircle, 
  CloudRain, 
  Crosshair, 
  Flame, 
  HeartPulse, 
  MapPin, 
  Megaphone, 
  Network, 
  Radio, 
  ShieldAlert, 
  Siren, 
  Thermometer, 
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

export default function EmergencyPage() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-6 min-h-[calc(100vh-8rem)]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-900/10 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen"></div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 z-10 flex-1">
        
        {/* Left Column: AI Crisis Detection & Agents */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* AI Crisis Detection System */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-rose-500/30 flex-1 flex flex-col relative overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4 z-10 relative">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="font-bold text-sm tracking-wider uppercase text-rose-100">Crisis Detection</h3>
              </div>
              <PulseIndicator status="active" size="xs" showLabel={false} />
            </div>

            <div className="flex-1 z-10 relative">
              <LiveStatusIndicator />
            </div>
          </motion.div>

          {/* Autonomous Response Agents */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Active AI Agents</h3>
              </div>
              <PulseIndicator status="syncing" size="xs" showLabel={false} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 relative">
              {[
                { name: "Dispatch", icon: Radio, status: "Active" },
                { name: "Medical", icon: Ambulance, status: "Active" },
                { name: "Traffic", icon: Car, status: "Routing" },
                { name: "Infra", icon: Building2, status: "Scanning" },
                { name: "Disaster", icon: CloudRain, status: "Predicting" },
                { name: "Public", icon: Megaphone, status: "Alerting" },
              ].map((agent, idx) => (
                <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 text-center relative z-10 hover:border-purple-500/40 transition group">
                  <agent.icon className="w-5 h-5 text-gray-400 mx-auto mb-2 group-hover:text-purple-400 transition" />
                  <div className="text-[10px] font-bold uppercase">{agent.name}</div>
                  <div className="flex justify-center mt-1">
                    <PulseIndicator status={agent.status === 'Active' ? 'active' : 'syncing'} size="xs" showLabel labelClassName="text-[8px]" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Center Column: Huge Tactical Map & Resources */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-6">
          
          {/* Central Emergency Coordination Map */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl border border-blue-500/30 overflow-hidden relative flex-1 min-h-[400px]"
          >
            {/* Dark map background */}
            <div className="absolute inset-0 bg-[#02000a] z-0">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030014]/90 to-[#030014] z-0"></div>
            </div>

            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Tactical Command</span>
              </div>
            </div>

            {/* Simulated Tactical Visuals */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              
              {/* Emergency Zone */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-64 h-64 bg-rose-500/20 rounded-full blur-xl"></motion.div>
                <div className="absolute w-32 h-32 border-2 border-dashed border-rose-500/50 rounded-full animate-spin-slow"></div>
                <div className="relative bg-rose-500/20 border-2 border-rose-500 rounded-full w-12 h-12 flex items-center justify-center animate-pulse glow-purple">
                  <Flame className="w-6 h-6 text-rose-100" />
                </div>
              </div>

              {/* Police Deployment Grid */}
              <div className="absolute top-1/4 right-1/4 grid grid-cols-2 gap-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: "0.6s" }}></div>
              </div>

              {/* Ambulance Routing SVG Line */}
              <svg className="absolute inset-0 w-full h-full opacity-60">
                <motion.path 
                  d="M 20% 80% Q 40% 60% 50% 33%" 
                  stroke="rgba(16, 185, 129, 0.8)" 
                  strokeWidth="3" 
                  strokeDasharray="8 8"
                  fill="transparent"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                {/* Ambulance node moving */}
                <circle cx="0" cy="0" r="4" fill="#10b981" className="glow-blue">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M 20% 80% Q 40% 60% 50% 33%" />
                </circle>
              </svg>

              {/* Evacuation Pathway */}
              <svg className="absolute inset-0 w-full h-full opacity-40">
                <motion.path 
                  d="M 50% 33% Q 60% 20% 80% 10%" 
                  stroke="rgba(56, 189, 248, 0.8)" 
                  strokeWidth="15" 
                  fill="transparent"
                  strokeLinecap="round"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                />
              </svg>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 border border-rose-500/30 rounded flex items-center space-x-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-mono text-rose-300">DISASTER SPREAD: ISOLATED</span>
              </div>
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 border border-blue-500/30 rounded flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-mono text-blue-300">EVAC PATH: SECURE</span>
              </div>
            </div>
          </motion.div>

          {/* Emergency Resource Allocation */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden" animate="show"
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { label: "Ambulances", val: 24, target: 30, icon: Ambulance, color: "emerald" },
              { label: "Police Units", val: 45, target: 50, icon: ShieldAlert, color: "blue" },
              { label: "Fire Units", val: 12, target: 15, icon: Flame, color: "rose" },
              { label: "Hospitals", val: 88, suffix: "%", icon: HeartPulse, color: "purple" },
              { label: "Emerg Teams", val: 100, suffix: "%", icon: Activity, color: "yellow" },
              { label: "Power Grid", val: 99, suffix: "%", icon: Zap, color: "cyan" },
            ].map((res, idx) => (
              <ReactiveCard 
                key={idx} 
                glowColor={`rgba(var(--${res.color}-glow), 0.1)`}
                className="glass-panel p-3 rounded-xl border border-white/5 flex items-center space-x-3 group"
              >
                <div className={`p-2 rounded-lg bg-white/5`}>
                  <res.icon className={`w-4 h-4 text-gray-400 group-hover:text-${res.color}-400 transition-colors`} />
                </div>
                <div>
                  <MetricCounter 
                    value={res.val} 
                    target={res.val} 
                    suffix={res.suffix || (res.target ? `/${res.target}` : "")} 
                    color={res.color as any}
                    valueClassName="text-sm"
                  />
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">{res.label}</div>
                </div>
              </ReactiveCard>
            ))}
          </motion.div>

        </div>

        {/* Right Column: Timelines & AI Decisions */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* Predictive Risk Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Risk Forecasting</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Disaster Spread Prediction</span>
                  <span className="text-rose-400">High Risk</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[85%] shadow-[0_0_10px_#f43f5e]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Infra Vulnerability</span>
                  <span className="text-orange-400">Medium</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[60%] shadow-[0_0_10px_#f97316]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                  <span>Emergency Demand</span>
                  <span className="text-purple-400">Surging</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[92%] shadow-[0_0_10px_#a855f7] animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Decision Engine */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-purple-500/30 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full blur-xl"></div>
            <div className="flex items-center space-x-2 border-b border-purple-500/20 pb-3 mb-4 z-10">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Auto-Decisions</h3>
            </div>
            
            <div className="space-y-3 z-10">
              <div className="bg-black/40 border border-purple-500/20 p-2.5 rounded-lg flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Rerouting Traffic</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Diverting civilian vehicles from Sector 4 arterials.</div>
                </div>
              </div>
              <div className="bg-black/40 border border-purple-500/20 p-2.5 rounded-lg flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Dispatching Nearest Units</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Ambulance #4 & #7 en route. ETA 3m.</div>
                </div>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/40 p-2.5 rounded-lg flex items-start space-x-3 glow-purple">
                <Activity className="w-4 h-4 text-purple-400 mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <div className="text-xs font-semibold text-purple-200">Activating Evac Protocol</div>
                  <div className="text-[10px] text-purple-300/70 mt-0.5">Preparing broadcast to local devices.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Emergency Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel p-0 rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-gray-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Live Crisis Log</h3>
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
