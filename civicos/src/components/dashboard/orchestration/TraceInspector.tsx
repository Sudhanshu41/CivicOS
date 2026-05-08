"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Clock, Zap, MessageSquare, Code } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";
import { NodeUpdatePayload } from "../../../types/orchestration";

interface TraceInspectorProps {
  node: NodeUpdatePayload | null;
  onClose: () => void;
}

/**
 * CIVICOS — TRACE INSPECTOR PANEL
 * Interactive side-panel for inspecting real-time agent execution data.
 */
export function TraceInspector({ node, onClose }: TraceInspectorProps) {
  if (!node) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 right-0 w-96 h-full z-50 p-6 pointer-events-none"
    >
      <GlassPanel className="h-full flex flex-col pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <Cpu className="w-4 h-4 text-[#FFD500]" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wider text-white uppercase">{node.label || "Agent Trace"}</h3>
              <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{node.status}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pr-2">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2 text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-tight">Latency</span>
              </div>
              <div className="text-xs font-mono text-white">{(node.metadata?.latency_ms as number) || 0}ms</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2 text-gray-500">
                <Zap className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-tight">Confidence</span>
              </div>
              <div className="text-xs font-mono text-white">{(node.metadata?.confidence as number || 0) * 100}%</div>
            </div>
          </div>

          {/* Reasoning */}
          <section>
            <div className="flex items-center space-x-2 mb-3 text-gray-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Agent Reasoning</h4>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg text-[11px] leading-relaxed text-gray-400 italic">
              {(node.metadata?.reasoning as string) || "No reasoning data available for this execution step."}
            </div>
          </section>

          {/* Input/Output Payloads */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Code className="w-3.5 h-3.5" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Execution Payload</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-[9px] font-mono text-gray-600 uppercase mb-1.5 ml-1">Input Data</div>
                <pre className="bg-black/50 border border-white/5 p-3 rounded-lg text-[10px] font-mono text-blue-300 overflow-x-auto">
                  {JSON.stringify(node.metadata?.input || {}, null, 2)}
                </pre>
              </div>
              <div>
                <div className="text-[9px] font-mono text-gray-600 uppercase mb-1.5 ml-1">Output Result</div>
                <pre className="bg-black/50 border border-white/5 p-3 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto">
                  {JSON.stringify(node.metadata?.output || {}, null, 2)}
                </pre>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-white/5 text-center">
          <div className="text-[8px] font-mono text-gray-700 uppercase tracking-[0.3em]">
            Trace ID: {(node.metadata?.trace_id as string) || "SYSTEM-LOCAL-EXEC"}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
