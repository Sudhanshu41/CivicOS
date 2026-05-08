"use client";

import { Activity, Clock, Zap, Target, Gauge } from "lucide-react";
import { MetricCounter } from "../motion/MetricCounter";
import { GlassPanel } from "../ui/GlassPanel";
import { useOrchestrationRegistry } from "../../stores/orchestrationRegistry";

/**
 * CIVICOS — TELEMETRY GRID
 * Displays real-time global orchestration metrics.
 */
export function TelemetryGrid() {
  const systemTelemetry = useOrchestrationRegistry(state => state.systemTelemetry);
  const activeId = useOrchestrationRegistry(state => state.activeWorkflowId);
  const telemetry = useOrchestrationRegistry(state => activeId ? state.workflows[activeId]?.telemetry : { retries: 0 });

  const metrics = [
    { 
      label: "Sync Latency", 
      value: systemTelemetry.wsLatency, 
      suffix: "ms", 
      icon: Clock,
      color: "white"
    },
    { 
      label: "Model Precision", 
      value: 99.8, 
      decimals: 1, 
      suffix: "%", 
      icon: Target,
      color: "white"
    },
    { 
      label: "Active Flows", 
      value: systemTelemetry.activeWorkflows, 
      icon: Gauge,
      color: "white"
    },
    { 
      label: "Total Retries", 
      value: systemTelemetry.totalRetries, 
      icon: Zap,
      color: "yellow",
      valueColor: "text-[#FFD500]"
    }
  ];

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <h3 className="font-medium text-sm tracking-widest text-white uppercase">Live Telemetry</h3>
        <Activity className="w-4 h-4 text-gray-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white/[0.02] rounded-lg p-4 border border-white/5 hover:border-white/10 transition group">
            <div className="flex items-center justify-between mb-2">
              <m.icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
            <MetricCounter 
              value={m.value} 
              decimals={m.decimals} 
              suffix={m.suffix} 
              label={m.label} 
              color={m.color as any} 
              valueClassName={`text-xl font-light ${m.valueColor || 'text-white'}`} 
            />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
