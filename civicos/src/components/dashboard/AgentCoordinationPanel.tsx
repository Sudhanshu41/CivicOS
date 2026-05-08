"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GitBranch, MessageSquare, ArrowRightLeft } from "lucide-react";
import { GlassPanel } from "../ui/GlassPanel";
import { useOrchestrationRegistry } from "../../stores/orchestrationRegistry";

interface AgentCoordEvent {
  id: string;
  from: string;
  to: string;
  type: "delegation" | "escalation" | "communication" | "fallback";
  message: string;
  timestamp: string;
  workflowId: string;
}

const EVENT_STYLES = {
  delegation:    { icon: ArrowUpRight,    color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  escalation:    { icon: ArrowUpRight,    color: "text-rose-400",    bg: "bg-rose-500/10 border-rose-500/20" },
  communication: { icon: MessageSquare,   color: "text-teal-400",    bg: "bg-teal-500/10 border-teal-500/20" },
  fallback:      { icon: ArrowRightLeft,  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
};

// Derive coordination events from workflow logs that contain agent-to-agent patterns
function deriveCoordEvents(workflows: ReturnType<typeof useOrchestrationRegistry.getState>["workflows"]): AgentCoordEvent[] {
  const events: AgentCoordEvent[] = [];
  let id = 0;

  Object.values(workflows).forEach(wf => {
    wf.logs.forEach(log => {
      const msg = log.message.toLowerCase();
      let type: AgentCoordEvent["type"] | null = null;
      let from = log.agent || "System";
      let to   = "Routing Engine";

      if (msg.includes("escalat")) { type = "escalation"; to = "Emergency Agent"; }
      else if (msg.includes("delegat") || msg.includes("routing")) { type = "delegation"; to = "Action Agent"; }
      else if (msg.includes("fallback")) { type = "fallback"; to = "Fallback Provider"; }
      else if (msg.includes("request") || msg.includes("coordinat")) { type = "communication"; }

      if (type) {
        events.push({
          id: String(id++),
          from,
          to,
          type,
          message: log.message.slice(0, 80),
          timestamp: new Date().toISOString(),
          workflowId: wf.issue_id,
        });
      }
    });
  });

  return events.slice(-12); // last 12 events
}

/**
 * CIVICOS — AGENT COORDINATION PANEL
 * Visualizes inter-agent delegation, escalation, and communication events
 * extracted from live workflow execution logs.
 */
export function AgentCoordinationPanel() {
  const workflows = useOrchestrationRegistry((s) => s.workflows);
  const coordEvents = deriveCoordEvents(workflows);

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-xs font-medium text-white uppercase tracking-widest">Agent Coordination</h3>
          <span className="text-[8px] font-mono text-gray-600 border border-white/10 px-2 py-0.5 rounded">
            {coordEvents.length} events
          </span>
        </div>
        <GitBranch className="w-4 h-4 text-gray-500" />
      </div>

      {coordEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-700 space-y-2">
          <GitBranch className="w-8 h-8 opacity-20" />
          <p className="text-[10px] font-mono uppercase tracking-widest italic">No coordination events yet</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-80 no-scrollbar">
          {coordEvents.map((evt, i) => {
            const style = EVENT_STYLES[evt.type];
            const Icon  = style.icon;

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start space-x-3 p-3 border rounded-xl ${style.bg}`}
              >
                <div className={`shrink-0 mt-0.5 ${style.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[9px] font-mono font-bold text-white">{evt.from}</span>
                    <ArrowRightLeft className="w-2.5 h-2.5 text-gray-600" />
                    <span className="text-[9px] font-mono text-gray-400">{evt.to}</span>
                    <span className={`ml-auto text-[8px] font-mono uppercase tracking-widest shrink-0 ${style.color}`}>
                      {evt.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-snug truncate">{evt.message}</p>
                  <div className="text-[8px] font-mono text-gray-700 mt-1">
                    {evt.workflowId.slice(0, 8)}...
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Type Legend */}
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-3">
        {(Object.keys(EVENT_STYLES) as (keyof typeof EVENT_STYLES)[]).map(t => {
          const s = EVENT_STYLES[t];
          return (
            <div key={t} className="flex items-center space-x-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${s.color.replace("text-", "bg-")}`} />
              <span className="text-[8px] font-mono text-gray-600 uppercase">{t}</span>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
