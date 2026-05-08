"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  Bell, 
  BrainCircuit, 
  Cpu, 
  Database, 
  Key, 
  Layers, 
  Lock, 
  Monitor, 
  Network,
  Shield, 
  Sliders, 
  Terminal, 
  Zap 
} from "lucide-react";
import { useState } from "react";

import { AgentCalibration } from "../../../components/dashboard/settings/AgentCalibration";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { MetricCounter } from "../../../components/motion/MetricCounter";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { staggerContainer, fadeSlideUp } from "../../../lib/motionConfig";

/**
 * CIVICOS — SYSTEM SETTINGS PAGE
 * Refactored for production-grade modularity and administrative control.
 */
export default function SettingsPage() {
  const [agents, setAgents] = useState([
    { id: "vision", name: "Vision Agent", active: true, power: 80 },
    { id: "research", name: "Research Agent", active: true, power: 65 },
    { id: "validation", name: "Validation Agent", active: true, power: 90 },
    { id: "action", name: "Action Agent", active: false, power: 40 },
    { id: "notification", name: "Notification Agent", active: true, power: 100 },
    { id: "predictive", name: "Predictive Analytics", active: true, power: 85 },
  ]);

  const [calibrations] = useState([
    { name: "Prediction Sensitivity", value: 75 },
    { name: "Confidence Threshold", value: 92 },
    { name: "Optimization Aggressiveness", value: 60 },
    { name: "Risk Tolerance Limit", value: 20 },
  ]);

  return (
    <div className="flex flex-col space-y-8 min-h-[calc(100vh-10rem)] relative z-10">

      {/* 1. Global System Overview */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden" 
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        {[
          { label: "AI Core Status", val: 100, suffix: "%", icon: Cpu, color: "white" },
          { label: "Active Agents", val: 5, target: 6, icon: BrainCircuit, color: "white" },
          { label: "System Stability", val: 99.9, suffix: "%", icon: Activity, color: "white" },
          { label: "Neural Health", val: 100, suffix: "%", icon: Network, color: "white" },
          { label: "Infra Sync", val: 100, suffix: "%", icon: Database, color: "white" },
          { label: "Prediction Eng.", val: 100, suffix: "%", icon: Zap, color: "yellow" },
        ].map((metric, idx) => (
          <motion.div 
            key={idx} 
            variants={fadeSlideUp}
            className="glass-panel p-5 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition"
          >
            <div className="flex justify-between items-start mb-4">
              <metric.icon className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
              <PulseIndicator status="active" size="xs" color={metric.color as any} showLabel={false} />
            </div>
            <div>
              <MetricCounter 
                value={metric.val} 
                suffix={metric.suffix || (metric.target ? `/${metric.target}` : "")} 
                decimals={metric.val % 1 !== 0 ? 1 : 0}
                color={metric.color as any}
                valueClassName="text-xl font-light"
              />
              <div className="text-[9px] text-gray-600 uppercase tracking-[0.2em] mt-2 font-bold">{metric.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-8 flex-1">
        
        {/* 2. Left Column: Governance & Integrations */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Governance</h3>
              <Shield className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-6">
              {[
                { label: "Emergency Override", icon: Key },
                { label: "Autonomous Auth", icon: Lock },
                { label: "Network Protection", icon: Network }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                    <item.icon className="w-3.5 h-3.5 text-gray-600" />
                    <span>{item.label}</span>
                  </div>
                  <div className="w-8 h-4 bg-white/5 rounded-full flex items-center p-0.5 border border-white/10">
                    <div className="w-3 h-3 bg-white rounded-full translate-x-4 shadow-[0_0_8px_white]" />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6 flex-1">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">API Integrations</h3>
              <Layers className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Google Maps GIS", status: "ONLINE", color: "text-white" },
                { name: "Gemini AI Core", status: "ONLINE", color: "text-white" },
                { name: "IoT Sensor Net", status: "SYNCING", color: "text-gray-500" },
                { name: "Emergency API", status: "ONLINE", color: "text-white" },
                { name: "Satellite Link", status: "ACTIVE", color: "text-white" },
                { name: "Gov Infra Auth", status: "EXPIRED", color: "text-[#FFD500]" },
              ].map((api, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-lg hover:border-white/10 transition">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{api.name}</span>
                  <span className={`text-[8px] uppercase font-mono font-bold ${api.color}`}>{api.status}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

        </div>

        {/* 3. Center Column: Agent Calibration & Display */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-8">
          <AgentCalibration agents={agents} setAgents={setAgents} />

          <GlassPanel className="p-8">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Display Architecture</h3>
              <Monitor className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex space-x-12">
              {['Ambient Motion', 'Editorial Grid', 'Neural Overlays'].map((label, i) => (
                <div key={i} className="flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <div className="w-3.5 h-3.5 border border-white/20 bg-white/5 rounded flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* 4. Right Column: Tuning & Diagnostics */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Intelligence Tuning</h3>
              <Sliders className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-8">
              {calibrations.map((cal, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-3">
                    <span>{cal.name}</span>
                    <span className="text-white">{cal.value}%</span>
                  </div>
                  <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${cal.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Communications</h3>
              <Bell className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-5">
              {[
                { name: "Emergency SMS", active: true },
                { name: "WhatsApp Gov", active: true },
                { name: "Daily Reports", active: false },
                { name: "Public Display", active: true },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{notif.name}</span>
                  <div 
                    className={`w-8 h-4 rounded-full flex items-center p-0.5 border transition-colors ${notif.active ? 'bg-white/10 border-white/20' : 'bg-black border-white/5'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${notif.active ? 'bg-white translate-x-4 shadow-[0_0_8px_white]' : 'bg-gray-800'}`} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-0 flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Diagnostics</h3>
              <Terminal className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 p-6 pt-4 overflow-y-auto no-scrollbar">
              <ActivityFeed maxVisible={15} compact />
            </div>
          </GlassPanel>

        </div>
        
      </div>
    </div>
  );
}
