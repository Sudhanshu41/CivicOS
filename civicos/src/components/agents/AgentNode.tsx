"use client";

import { ReactiveCard } from "@/components/motion/ReactiveCard";
import { PulseIndicator } from "@/components/motion/PulseIndicator";
import { LucideIcon } from "lucide-react";

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
    <ReactiveCard 
      tiltStrength={15} 
      hoverLift={0} 
      glowColor={data.isActive ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.05)"}
      className={`glass-panel border-2 ${data.isActive ? 'border-blue-400' : 'border-white/10'} rounded-xl p-4 w-48 flex items-center space-x-3 bg-black/60 backdrop-blur-md relative overflow-hidden`}
    >
      <div className={`relative p-2 rounded-lg shrink-0 ${data.isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
        <Icon className="w-5 h-5" />
        {data.isActive && (
          <span className="absolute -top-1 -right-1">
            <PulseIndicator status="active" size="xs" showLabel={false} />
          </span>
        )}
      </div>
      <div className="relative z-10">
        <div className={`text-xs font-bold ${data.isActive ? 'text-white' : 'text-gray-400'}`}>{data.label}</div>
        <div className="text-[10px] text-gray-500 font-mono mt-0.5">{data.status}</div>
      </div>
    </ReactiveCard>
  );
}
