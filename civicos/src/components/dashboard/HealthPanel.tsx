"use client";

import { motion } from "framer-motion";
import { HeartPulse, Database, Radio, Brain, Shield } from "lucide-react";
import { GlassPanel } from "../ui/GlassPanel";
import { useWorkflowStore } from "../../stores/workflowStore";

/**
 * CIVICOS — HEALTH PANEL
 * Upgraded to visualize real-time operational status of backend infrastructure.
 */
export function HealthPanel() {
  const health = useWorkflowStore(state => state.health);
  const systemTelemetry = useWorkflowStore(state => state.systemTelemetry);

  const subsystems = [
    { label: "Backend API", status: health.backend, icon: Database },
    { label: "WebSocket Link", status: health.websocket, icon: Radio },
    { label: "AI Neural Mesh", status: health.aiProvider, icon: Brain },
    { label: "Encrypted DB", status: health.database, icon: Shield },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
      case "degraded": return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
      case "offline": return "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
      default: return "bg-gray-500";
    }
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <h3 className="font-medium text-sm tracking-widest text-white uppercase">Operational Status</h3>
        <HeartPulse className="w-4 h-4 text-gray-500" />
      </div>
      
      <div className="space-y-5">
        {subsystems.map((sub, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-white/[0.02] border border-white/5 rounded transition-colors group-hover:border-white/10">
                <sub.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                {sub.label}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mr-1">
                {sub.status}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(sub.status)}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Latency / Retry Micro-Telemetry */}
      <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-1">Link Latency</span>
          <span className="text-[11px] font-mono text-white">{systemTelemetry.wsLatency}ms</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-1">Global Retries</span>
          <span className="text-[11px] font-mono text-white">{systemTelemetry.totalRetries}</span>
        </div>
      </div>
    </GlassPanel>
  );
}
