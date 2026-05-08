"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
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

import { TacticalMap } from "../../../components/maps/TacticalMap";
import { useMapContext } from "../../../providers/MapProvider";
import { ResolutionWorkflow } from "../../../components/dashboard/issues/ResolutionWorkflow";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { LiveStatusIndicator } from "../../../components/motion/LiveStatusIndicator";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { MetricCounter } from "../../../components/motion/MetricCounter";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { staggerContainer, fadeSlideUp } from "../../../lib/motionConfig";

/**
 * CIVICOS — CIVIC ISSUES PAGE
 * Refactored for production-grade modularity and advanced issue resolution.
 */
export default function CivicIssuesPage() {
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const { isConfigured } = useMapContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflow((prev) => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-8 min-h-[calc(100vh-10rem)] relative z-10">

      {/* 1. Performance Overview */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden" 
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        {[
          { label: "Active Issues", val: 1248, icon: Activity, color: "white" },
          { label: "Resolution Speed", val: 4.2, suffix: "h", icon: Clock, color: "white" },
          { label: "Infra Stability", val: 88, suffix: "%", icon: TrendingUp, color: "white" },
          { label: "Citizen Satisfaction", val: 92, suffix: "%", icon: CheckCircle2, color: "white" },
          { label: "Detection Accuracy", val: 99.4, suffix: "%", icon: BrainCircuit, color: "yellow" },
          { label: "Maint. Efficiency", val: 24, prefix: "+", suffix: "%", icon: Wrench, color: "white" },
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
                prefix={metric.prefix}
                suffix={metric.suffix} 
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
        
        {/* 2. Left Column: Intelligence Hub */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Resolution Engine</h3>
              <BrainCircuit className="w-4 h-4 text-gray-500" />
            </div>
            <LiveStatusIndicator />
          </GlassPanel>

          <GlassPanel className="p-6 flex-1">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Civic Agents</h3>
              <Network className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Vision Detection", icon: Eye, status: "active" },
                { name: "Validation Agent", icon: Search, status: "syncing" },
                { name: "Infra Analysis", icon: Activity, status: "active" },
                { name: "Routing Agent", icon: MapPin, status: "active" },
                { name: "Maint. Coordinator", icon: HardHat, status: "syncing" },
              ].map((agent, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-lg hover:border-white/10 transition group">
                  <div className="flex items-center space-x-3">
                    <agent.icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{agent.name}</span>
                  </div>
                  <PulseIndicator status={agent.status as any} showLabel={false} size="xs" color="white" />
                </div>
              ))}
            </div>
          </GlassPanel>

        </div>

        {/* 3. Center Column: Incident Map & Workflow */}
        <div className="w-full xl:w-2/4 flex flex-col space-y-8">
          <GlassPanel className="rounded-xl overflow-hidden relative flex-1 min-h-[400px] p-0" hover={false}>
            {isConfigured ? (
              <TacticalMap filter="all" showHeatmap={true} showWorkflows={true} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-gray-500 font-mono text-xs uppercase tracking-widest">
                Map Engine Offline
              </div>
            )}

            <div className="absolute top-6 left-6 z-20 flex items-center space-x-3 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Live Incident Map</span>
            </div>
          </GlassPanel>

          <ResolutionWorkflow activeStep={activeWorkflow} />
        </div>

        {/* 4. Right Column: Alerts & Analytics */}
        <div className="w-full xl:w-1/4 flex flex-col space-y-8">
          
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-medium text-xs tracking-widest text-[#FFD500] uppercase">Critical Alerts</h3>
              <ShieldAlert className="w-4 h-4 text-[#FFD500]" />
            </div>

            <div className="space-y-4">
              {[
                { label: "Road Failure", msg: "Sinkhole risk on Highway 4. Immediate repair required.", icon: AlertTriangle },
                { label: "Flood Risk", msg: "Drainage system overload expected in Sector 2.", icon: Droplet }
              ].map((alert, i) => (
                <div key={i} className="flex items-start space-x-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <alert.icon className="w-4 h-4 text-[#FFD500] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-widest">{alert.label}</div>
                    <div className="text-[10px] text-gray-500 mt-1 leading-relaxed font-medium">{alert.msg}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Predictive Analytics</h3>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-8">
              {[
                { label: "Road Damage Prob.", val: 78, status: "HIGH RISK", color: "yellow" },
                { label: "Waste Mgmt Overload", val: 82, status: "82% CAP.", color: "white" },
                { label: "Maint. Demand", val: 45, status: "STABLE", color: "gray" },
              ].map((p, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-3">
                    <span>{p.label}</span>
                    <span className={p.color === 'yellow' ? 'text-[#FFD500]' : 'text-white'}>{p.status}</span>
                  </div>
                  <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${p.color === 'yellow' ? 'bg-[#FFD500] shadow-[0_0_5px_#FFD500]' : 'bg-white/40'}`} 
                      style={{ width: `${p.val}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-0 flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Civic Feed</h3>
              <Radio className="w-4 h-4 text-gray-500" />
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
