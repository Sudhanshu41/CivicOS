"use client";

import { LucideIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { PulseIndicator } from "../../motion/PulseIndicator";
import { GlassPanel } from "../../ui/GlassPanel";

/**
 * CIVICOS — AGENT NODE
 * Custom ReactFlow node representing an autonomous AI agent.
 */

interface AgentNodeProps {
  data: {
    label: string;
    status: string;
    icon: LucideIcon;
    isActive: boolean;
  };
}

export function AgentNode({ data }: AgentNodeProps) {
  const Icon = data.icon;
  
  return (
    <GlassPanel 
      className={`border ${data.isActive ? 'border-white' : 'border-white/5'} p-4 w-56 flex items-center space-x-4 bg-black/60 relative transition-all duration-700`}
      hover={false}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className={`relative p-2.5 rounded-lg shrink-0 transition-colors duration-500 ${data.isActive ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="relative z-10">
        <div className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-500 ${data.isActive ? 'text-white' : 'text-gray-500'}`}>
          {data.label}
        </div>
        <div className="text-[9px] text-gray-600 font-mono mt-1 uppercase tracking-wider">
          {data.status}
        </div>
      </div>
      
      {data.isActive && (
        <div className="absolute top-3 right-3">
          <PulseIndicator status="active" size="xs" showLabel={false} color="yellow" />
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </GlassPanel>
  );
}
