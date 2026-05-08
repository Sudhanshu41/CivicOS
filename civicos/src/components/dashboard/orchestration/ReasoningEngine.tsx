"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Cpu, ShieldCheck, Search, Eye, Radio, Zap } from "lucide-react";
import { useOrchestrationRegistry } from "../../../stores/orchestrationRegistry";
import { MetricCounter } from "../../motion/MetricCounter";

const agentIcons: Record<string, any> = {
  "Vision": Eye,
  "Research": Search,
  "Validation": ShieldCheck,
  "Routing": Radio,
  "Action": Zap,
  "Core": BrainCircuit
};

/**
 * CIVICOS — REASONING ENGINE PANEL
 * Upgraded with segmented blocks and active agent tracking.
 */
export function ReasoningEngine() {
  const activeId = useOrchestrationRegistry(state => state.activeWorkflowId);
  const activeWf = useOrchestrationRegistry(state => activeId ? state.workflows[activeId] : null);
  
  const reasoning = activeWf?.reasoning || "";
  const telemetry = activeWf?.telemetry || { retries: 0 };
  const nodes = activeWf?.nodes || {};

  // Identify active agent from nodes
  const activeAgentNode = Object.values(nodes).find(n => n.status === "ACTIVE");
  const ActiveIcon = activeAgentNode?.label ? (agentIcons[activeAgentNode.label.split(' ')[0]] || Cpu) : BrainCircuit;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <h3 className="font-medium text-xs tracking-widest text-white uppercase">Reasoning Engine</h3>
          <AnimatePresence mode="wait">
            {activeAgentNode && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center space-x-2 bg-white/5 px-2 py-0.5 rounded border border-white/10"
              >
                <ActiveIcon className="w-3 h-3 text-[#FFD500]" />
                <span className="text-[9px] font-mono text-[#FFD500] uppercase tracking-widest">{activeAgentNode.label}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <BrainCircuit className="w-4 h-4 text-gray-500" />
      </div>
      
      <div className="flex-1 flex flex-col space-y-5 overflow-hidden">
        {/* Live Thought Stream */}
        <div className="flex-1 bg-white/[0.01] rounded-lg p-4 border border-white/5 overflow-y-auto no-scrollbar font-mono text-[11px] leading-relaxed text-gray-400 relative">
          <AnimatePresence mode="popLayout">
            {reasoning ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Segmented blocks if reasoning contains specific markers, otherwise just text */}
                <div className="whitespace-pre-wrap">
                  {reasoning}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-1 h-3 bg-[#FFD500] ml-1 align-middle"
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-3">
                <BrainCircuit className="w-8 h-8 opacity-20 animate-pulse" />
                <div className="italic text-[10px] tracking-widest uppercase">Awaiting agent consciousness...</div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Telemetry Footer */}
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="bg-white/[0.01] rounded-lg p-3 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="flex justify-between text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                <span>Confidence</span>
                <MetricCounter value={98.2} target={98.2} fluctuate fluctuateRange={0.3} suffix="%" color="white" decimals={1} valueClassName="text-xs font-light" />
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "98.2%" }} 
                  className="h-full bg-[#FFD500] shadow-[0_0_10px_#FFD500]" 
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white/[0.01] p-3 rounded-lg border border-white/5 relative group overflow-hidden">
             <div className="absolute inset-0 bg-white/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             <div className="relative z-10 flex w-full justify-between items-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Retries</div>
              <div className={`text-xs font-mono ${telemetry.retries > 0 ? 'text-amber-500' : 'text-white'}`}>
                {telemetry.retries.toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
