"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  Bell, 
  BrainCircuit, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Eye, 
  Key, 
  Layers, 
  Lock, 
  Monitor, 
  Network,
  Radio, 
  Search, 
  Settings as SettingsIcon, 
  Shield, 
  Sliders, 
  Terminal, 
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

export default function SettingsPage() {
  const [agents, setAgents] = useState([
    { id: "vision", name: "Vision Agent", active: true, power: 80 },
    { id: "research", name: "Research Agent", active: true, power: 65 },
    { id: "validation", name: "Validation Agent", active: true, power: 90 },
    { id: "action", name: "Action Agent", active: false, power: 40 },
    { id: "notification", name: "Notification Agent", active: true, power: 100 },
    { id: "predictive", name: "Predictive Analytics", active: true, power: 85 },
  ]);

  const [calibrations, setCalibrations] = useState([
    { name: "Prediction Sensitivity", value: 75, color: "bg-blue-500", glow: "shadow-[0_0_10px_#3b82f6]" },
    { name: "Confidence Threshold", value: 92, color: "bg-purple-500", glow: "shadow-[0_0_10px_#a855f7]" },
    { name: "Optimization Aggressiveness", value: 60, color: "bg-orange-500", glow: "shadow-[0_0_10px_#f97316]" },
    { name: "Risk Tolerance Limit", value: 20, color: "bg-rose-500", glow: "shadow-[0_0_10px_#f43f5e]" },
  ]);

  return (
    <div className="flex flex-col space-y-6 min-h-[calc(100vh-8rem)] relative z-10">

      {/* Header / System Overview */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {[
          { label: "AI Core Status", val: 100, suffix: "%", icon: Cpu, color: "blue" },
          { label: "Active Agents", val: 5, target: 6, icon: BrainCircuit, color: "purple" },
          { label: "System Stability", val: 99.9, suffix: "%", icon: Activity, color: "emerald" },
          { label: "Neural Health", val: 100, suffix: "%", icon: Network, color: "cyan" },
          { label: "Infrastructure Sync", val: 100, suffix: "%", icon: Database, color: "yellow" },
          { label: "Prediction Engine", val: 100, suffix: "%", icon: Zap, color: "orange" },
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
                suffix={metric.suffix || (metric.target ? `/${metric.target}` : "")} 
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
        
        {/* Left Column: Security & Integrations */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* Security & Governance Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-rose-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center space-x-2 border-b border-rose-500/20 pb-3 mb-4 z-10 relative">
              <Shield className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase text-rose-100">Governance Security</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-300">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span>Emergency Override</span>
                </div>
                <div className="w-8 h-4 bg-rose-900/50 rounded-full flex items-center p-0.5 border border-rose-500/50">
                  <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_5px_#f43f5e] translate-x-4"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-300">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Autonomous Action Auth</span>
                </div>
                <div className="w-8 h-4 bg-emerald-900/50 rounded-full flex items-center p-0.5 border border-emerald-500/50">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981] translate-x-4"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-300">
                  <Network className="w-4 h-4 text-gray-400" />
                  <span>Neural Network Protect</span>
                </div>
                <div className="w-8 h-4 bg-emerald-900/50 rounded-full flex items-center p-0.5 border border-emerald-500/50">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981] translate-x-4"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Smart City Integration Settings */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5 flex-1"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Layers className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">City API Integrations</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Google Maps GIS", status: "Connected", color: "text-emerald-400" },
                { name: "Gemini AI LLM Core", status: "Connected", color: "text-emerald-400" },
                { name: "IoT Sensor Network", status: "Syncing", color: "text-blue-400" },
                { name: "Emergency Services API", status: "Connected", color: "text-emerald-400" },
                { name: "Weather Satellite", status: "Active", color: "text-emerald-400" },
                { name: "Gov Infrastructure Auth", status: "Token Expired", color: "text-orange-400" },
              ].map((api, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition">
                  <span className="text-xs font-semibold text-gray-300">{api.name}</span>
                  <span className={`text-[9px] uppercase font-mono ${api.color}`}>{api.status}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Center Column: Agent Configurations */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl border border-blue-500/30 overflow-hidden relative flex-1 p-6"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex items-center space-x-2 border-b border-blue-500/20 pb-4 mb-6 relative z-10">
              <BrainCircuit className="w-6 h-6 text-blue-400" />
              <h3 className="font-bold text-lg tracking-wider uppercase">Autonomous Agent Calibration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {agents.map((agent, idx) => (
                <div key={agent.id} className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-emerald-500 glow-emerald' : 'bg-gray-600'}`}></div>
                      <span className="font-semibold text-sm text-gray-200">{agent.name}</span>
                    </div>
                    {/* Toggle Switch */}
                    <div 
                      className={`w-10 h-5 rounded-full flex items-center p-0.5 cursor-pointer border ${agent.active ? 'bg-blue-900/50 border-blue-500/50' : 'bg-gray-900 border-gray-700'}`}
                      onClick={() => {
                        const newAgents = [...agents];
                        newAgents[idx].active = !newAgents[idx].active;
                        setAgents(newAgents);
                      }}
                    >
                      <motion.div 
                        animate={{ x: agent.active ? 20 : 0 }} 
                        className={`w-4 h-4 rounded-full ${agent.active ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : 'bg-gray-500'}`} 
                      />
                    </div>
                  </div>

                  {/* Power Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase text-gray-500">
                      <span>Intelligence Allocation</span>
                      <span className={agent.active ? 'text-blue-400' : 'text-gray-600'}>{agent.power}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${agent.active ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-600'}`} 
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.power}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-white/5 text-[10px] uppercase text-gray-500 font-mono">
                    <span className="hover:text-blue-400 cursor-pointer transition-colors">Config</span>
                    <span className="hover:text-blue-400 cursor-pointer transition-colors">Logs</span>
                    <span className="hover:text-blue-400 cursor-pointer transition-colors">Memory</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Appearance Settings */}
            <div className="mt-8 border-t border-white/10 pt-6 relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <Monitor className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Appearance & UI Controls</h3>
              </div>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <input type="checkbox" checked readOnly className="accent-purple-500 w-4 h-4" />
                  <span>Cinematic Holographic Mode</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <input type="checkbox" checked readOnly className="accent-blue-500 w-4 h-4" />
                  <span>Neon Glow Diffusion</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Right Column: Analytics & Alerts */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-6">
          
          {/* AI Intelligence Calibration */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Sliders className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Intelligence Tuning</h3>
            </div>
            
            <div className="space-y-4">
              {calibrations.map((cal, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[10px] uppercase text-gray-400 mb-1">
                    <span>{cal.name}</span>
                    <span className="text-gray-300">{cal.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden relative cursor-pointer group">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`h-full ${cal.color} ${cal.glow}`} style={{ width: `${cal.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notifications & Communications */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Communications</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Emergency Citizen SMS", active: true },
                { name: "WhatsApp Gov Channel", active: true },
                { name: "Automated Daily Reports", active: false },
                { name: "Public Display Override", active: true },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">{notif.name}</span>
                  <div className={`w-8 h-4 rounded-full flex items-center p-0.5 border ${notif.active ? 'bg-emerald-900/50 border-emerald-500/50' : 'bg-gray-900 border-gray-700'}`}>
                    <div className={`w-3 h-3 rounded-full ${notif.active ? 'bg-emerald-500 shadow-[0_0_5px_#10b981] translate-x-4' : 'bg-gray-500'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live System Diagnostics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel p-0 rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">System Diagnostics</h3>
              </div>
              <PulseIndicator status="active" size="xs" showLabel={false} />
            </div>
            <div className="flex-1 p-3 overflow-y-auto no-scrollbar">
              <ActivityFeed maxVisible={15} compact />
            </div>
          </motion.div>

        </div>
        
      </div>
    </div>
  );
}
