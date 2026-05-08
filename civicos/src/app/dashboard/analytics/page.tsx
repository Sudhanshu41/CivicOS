"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  BrainCircuit, 
  Car, 
  CheckCircle, 
  CloudRain, 
  Cpu, 
  Crosshair,
  Database, 
  Droplets, 
  LineChart, 
  Network, 
  Radio, 
  Satellite, 
  ShieldAlert, 
  Siren,
  Train, 
  Trash2, 
  TrendingUp, 
  Video, 
  Wind, 
  Zap 
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  LineChart as RechartsLineChart,
  Line
} from "recharts";
import { useEffect, useState } from "react";
import { ActivityFeed } from "@/components/motion/ActivityFeed";
import { LiveStatusIndicator } from "@/components/motion/LiveStatusIndicator";
import { PulseIndicator } from "@/components/motion/PulseIndicator";
import { MetricCounter } from "@/components/motion/MetricCounter";
import { ReactiveCard } from "@/components/motion/ReactiveCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { staggerContainer, fadeSlideUp } from "@/lib/motionConfig";

const predictionData = [
  { time: "Now", traffic: 40, energy: 60, risk: 20 },
  { time: "+1h", traffic: 65, energy: 75, risk: 35 },
  { time: "+2h", traffic: 85, energy: 90, risk: 60 },
  { time: "+3h", traffic: 50, energy: 85, risk: 40 },
  { time: "+4h", traffic: 30, energy: 50, risk: 15 },
  { time: "+5h", traffic: 20, energy: 40, risk: 10 },
];

export default function AnalyticsPage() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-6 min-h-[calc(100vh-8rem)]">
      
      {/* Background Cinematic Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen"></div>
      </div>

      {/* Left Column */}
      <div className="w-full lg:w-1/4 flex flex-col space-y-6 z-10">
        
        {/* Confidence Metrics */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">AI Confidence Metrics</h3>
            </div>
            <PulseIndicator status="active" size="xs" showLabel={false} />
          </div>
          
          <div className="space-y-4">
            {[
              { label: "Prediction Confidence", value: 99.1, suffix: "%", icon: BrainCircuit, color: "blue" },
              { label: "AI Accuracy Rate", value: 98.7, suffix: "%", icon: Crosshair, color: "emerald" },
              { label: "Decision Reliability", value: 99.9, suffix: "%", icon: CheckCircle, color: "purple" },
              { label: "Infra Stability Index", value: 0.94, icon: Activity, color: "cyan" },
              { label: "City Health Score", value: 96.2, icon: Activity, color: "emerald" }
            ].map((metric, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                className="flex justify-between items-center group cursor-default"
              >
                <div className="flex items-center space-x-2">
                  <metric.icon className={`w-4 h-4 opacity-70 group-hover:opacity-100 transition`} />
                  <span className="text-[10px] text-gray-400 group-hover:text-gray-200 transition uppercase tracking-widest">{metric.label}</span>
                </div>
                <MetricCounter 
                  value={metric.value} 
                  target={metric.value} 
                  suffix={metric.suffix || ""} 
                  decimals={metric.value % 1 !== 0 ? 1 : (metric.value < 1 ? 2 : 0)}
                  color={metric.color as any}
                  valueClassName="text-sm"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Data Sources */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex-1">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Live Data Ingestion</h3>
            </div>
            <PulseIndicator status="syncing" size="xs" showLabel={false} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Traffic Cams", icon: Video, status: "active" },
              { label: "Satellites", icon: Satellite, status: "active" },
              { label: "IoT Sensors", icon: Radio, status: "active" },
              { label: "Emergency", icon: Siren, status: "syncing" },
              { label: "Weather API", icon: CloudRain, status: "active" },
              { label: "Gov Infra", icon: Network, status: "active" },
              { label: "Social Feeds", icon: Activity, status: "syncing" },
              { label: "Power Grid", icon: Zap, status: "active" }
            ].map((src, idx) => (
              <ReactiveCard 
                key={idx} 
                className="bg-white/5 rounded-lg p-2 border border-white/5 flex flex-col items-center text-center group"
              >
                <src.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-400 mb-1 transition-colors" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{src.label}</span>
                <div className="mt-1">
                  <PulseIndicator status={src.status as any} size="xs" showLabel={false} />
                </div>
              </ReactiveCard>
            ))}
          </div>
        </div>

      </div>

      {/* Center Column - Prediction Core */}
      <div className="w-full lg:w-2/4 flex flex-col space-y-6 z-10">
        
        {/* Holographic Intelligence Core */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl border border-blue-500/30 p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[350px]"
        >
          {/* Neural Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#030014]/80 to-[#030014] z-0"></div>
          
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm tracking-widest text-blue-300 uppercase glow-blue">Predictive Engine Core</span>
          </div>
          
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center">
              <PulseIndicator status="active" size="xs" showLabel={false} className="mr-2" />
              <span className="text-[10px] text-blue-400 font-mono uppercase">Processing 1.2M nodes/sec</span>
            </div>
          </div>

          {/* Central Animated Orb */}
          <div className="relative z-10 flex items-center justify-center w-full h-full my-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-64 h-64 border border-dashed border-blue-500/30 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-48 h-48 border border-purple-500/40 rounded-full"
            />
            
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 rounded-full blur-[40px]"
              />
              <motion.div 
                animate={{ scale: [0.9, 1.2, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-4 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-md"
              />
              <BrainCircuit className="w-12 h-12 text-white relative z-10" />
            </div>

            {/* Simulated Data Streams connecting to core */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <motion.path d="M 0 50% Q 25% 40% 50% 50%" stroke="#38bdf8" strokeWidth="1" fill="transparent" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <motion.path d="M 100% 50% Q 75% 60% 50% 50%" stroke="#a855f7" strokeWidth="1" fill="transparent" strokeDasharray="4 4" animate={{ strokeDashoffset: [-20, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <motion.path d="M 50% 0 Q 60% 25% 50% 50%" stroke="#38bdf8" strokeWidth="1" fill="transparent" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <motion.path d="M 50% 100% Q 40% 75% 50% 50%" stroke="#a855f7" strokeWidth="1" fill="transparent" strokeDasharray="4 4" animate={{ strokeDashoffset: [-20, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            </svg>
          </div>

        </motion.div>

        {/* Big Forecast Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl border border-white/5 p-5 flex-1"
        >
          <div className="flex items-center space-x-2 mb-4">
            <LineChart className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm tracking-wider uppercase">City-Wide Threat Forecasting</h3>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(3,0,20,0.9)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="traffic" name="Congestion Risk" stroke="#3b82f6" fill="url(#colorTraffic)" strokeWidth={2} />
                <Area type="monotone" dataKey="risk" name="Emergency Prob." stroke="#f43f5e" fill="url(#colorRisk)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/4 flex flex-col space-y-6 z-10">
        
        {/* Forecast Timeline */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4"
        >
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm tracking-wider uppercase">AI Forecast Timeline</h3>
          </div>
          
          <div className="relative space-y-5 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-transparent pt-2">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-blue-500 bg-[#030014] group-hover:bg-blue-500 transition-colors shadow-[0_0_10px_rgba(56,189,248,0.8)] shrink-0 z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                <Car className="w-2.5 h-2.5 text-blue-400 group-hover:text-white" />
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] glass-panel p-2.5 rounded-lg border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                <div className="text-[10px] text-blue-400 font-mono mb-1">+45m Prediction</div>
                <div className="text-xs text-gray-300">Traffic congestion expected in Sector 9.</div>
              </div>
            </div>
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-rose-500 bg-[#030014] group-hover:bg-rose-500 transition-colors shadow-[0_0_10px_rgba(244,63,94,0.8)] shrink-0 z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                <AlertTriangle className="w-2.5 h-2.5 text-rose-400 group-hover:text-white" />
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] glass-panel p-2.5 rounded-lg border border-rose-500/20 group-hover:border-rose-500/50 transition-colors">
                <div className="text-[10px] text-rose-400 font-mono mb-1">+2h Forecast</div>
                <div className="text-xs text-gray-300">Bridge maintenance risk increasing to critical.</div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-purple-500 bg-[#030014] group-hover:bg-purple-500 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.8)] shrink-0 z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                <Droplets className="w-2.5 h-2.5 text-purple-400 group-hover:text-white" />
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] glass-panel p-2.5 rounded-lg border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                <div className="text-[10px] text-purple-400 font-mono mb-1">+6h Forecast</div>
                <div className="text-xs text-gray-300">Water leakage probability elevated in Zone B.</div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Autonomous Decision Engine */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-0 rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Auto-Decisions</h3>
            </div>
            <PulseIndicator status="active" size="xs" showLabel={false} />
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto no-scrollbar">
            <ActivityFeed maxVisible={10} compact />
          </div>
        </motion.div>

      </div>
      
    </div>
  );
}

// Add a dummy Crosshair icon if it doesn't exist, though it usually does in lucide.
// We imported it at the top. Oh wait, Crosshair is imported above? Let me fix the import block.
