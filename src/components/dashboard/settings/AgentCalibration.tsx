"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";

/**
 * CIVICOS — AGENT CALIBRATION
 * Configuration panel for autonomous agent behavior and resource allocation.
 */

interface Agent {
  id: string;
  name: string;
  active: boolean;
  power: number;
}

interface AgentCalibrationProps {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
}

export function AgentCalibration({ agents, setAgents }: AgentCalibrationProps) {
  const toggleAgent = (id: string) => {
    setAgents(agents.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <GlassPanel className="p-8" hover={false}>
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
        <h3 className="font-medium text-xs tracking-widest text-white uppercase">Agent Calibration</h3>
        <BrainCircuit className="w-4 h-4 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white/[0.01] border border-white/5 rounded-xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-1.5 h-1.5 rounded-full ${agent.active ? 'bg-white shadow-[0_0_8px_white]' : 'bg-white/10'}`} />
                <span className="font-bold text-[10px] text-white uppercase tracking-widest">{agent.name}</span>
              </div>
              
              {/* Toggle Switch */}
              <div 
                className={`w-9 h-4.5 rounded-full flex items-center p-0.5 cursor-pointer border transition-colors ${agent.active ? 'bg-white/10 border-white/20' : 'bg-black border-white/5'}`}
                onClick={() => toggleAgent(agent.id)}
              >
                <motion.div 
                  animate={{ x: agent.active ? 18 : 0 }} 
                  className={`w-3.5 h-3.5 rounded-full ${agent.active ? 'bg-white' : 'bg-gray-700'}`} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-gray-600">
                <span>Intelligence Allocation</span>
                <span className={agent.active ? 'text-white' : 'text-gray-700'}>{agent.power}%</span>
              </div>
              <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${agent.active ? 'bg-white' : 'bg-gray-800'}`} 
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.power}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-5 pt-4 border-t border-white/5 text-[8px] uppercase text-gray-600 tracking-widest font-bold">
              <span className="hover:text-white cursor-pointer transition-colors">Config</span>
              <span className="hover:text-white cursor-pointer transition-colors">Logs</span>
              <span className="hover:text-white cursor-pointer transition-colors">Nodes</span>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
