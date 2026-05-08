"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, ChevronDown, ChevronUp, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useCityOperations, EscalationEvent, IncidentSeverity } from "../../stores/cityOperations";
import { GlassPanel } from "../ui/GlassPanel";

const SEVERITY_STYLES: Record<IncidentSeverity, { ring: string; badge: string; glow: string }> = {
  low:      { ring: "border-gray-600", badge: "bg-gray-700 text-gray-300", glow: "" },
  medium:   { ring: "border-amber-500/40", badge: "bg-amber-500/20 text-amber-300", glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]" },
  high:     { ring: "border-orange-500/40", badge: "bg-orange-500/20 text-orange-300", glow: "shadow-[0_0_20px_rgba(249,115,22,0.2)]" },
  critical: { ring: "border-rose-500/60", badge: "bg-rose-500/20 text-rose-300", glow: "shadow-[0_0_25px_rgba(239,68,68,0.3)]" },
};

function EscalationCard({ event }: { event: EscalationEvent }) {
  const [expanded, setExpanded] = useState(false);
  const styles = SEVERITY_STYLES[event.severity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className={`border rounded-xl p-4 bg-black/30 cursor-pointer transition-all ${styles.ring} ${styles.glow}`}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-widest ${styles.badge}`}>
            {event.severity}
          </div>
          <span className="text-[10px] font-mono text-gray-300 truncate max-w-[180px]">
            {event.reason}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!event.resolved && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"
            />
          )}
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center space-x-2 text-[9px] font-mono text-gray-500">
                <span className="text-white font-bold">{event.fromWorkflow.slice(0, 8)}...</span>
                <ArrowRight className="w-3 h-3" />
                <span>{event.toWorkflow ? `${event.toWorkflow.slice(0, 8)}...` : "Emergency Queue"}</span>
              </div>
              <div className="text-[9px] font-mono text-gray-600 uppercase">
                {new Date(event.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                {event.resolved && (
                  <span className="ml-3 text-emerald-500">● RESOLVED</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * CIVICOS — ESCALATION TRACKER
 * Realtime escalation chain visualization for the orchestration system.
 */
export function EscalationTracker() {
  const escalations = useCityOperations((s) => s.escalations);
  const active = escalations.filter(e => !e.resolved);
  const resolved = escalations.filter(e => e.resolved).slice(-3); // last 3 resolved

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-xs font-medium text-white uppercase tracking-widest">Escalation Chains</h3>
          {active.length > 0 && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full"
            >
              {active.length} LIVE
            </motion.span>
          )}
        </div>
        <Shield className="w-4 h-4 text-gray-500" />
      </div>

      {escalations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-700 space-y-2">
          <Zap className="w-8 h-8 opacity-20" />
          <p className="text-[10px] font-mono uppercase tracking-widest italic">No escalations active</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.length > 0 && (
            <div className="space-y-2">
              <div className="text-[8px] font-mono text-rose-400 uppercase tracking-widest mb-2 flex items-center space-x-1.5">
                <AlertTriangle className="w-3 h-3" />
                <span>Active Escalations</span>
              </div>
              <AnimatePresence>
                {active.map(e => <EscalationCard key={e.id} event={e} />)}
              </AnimatePresence>
            </div>
          )}

          {resolved.length > 0 && (
            <div className="space-y-2 mt-4">
              <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-2">
                Recent Resolutions
              </div>
              {resolved.map(e => <EscalationCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      )}
    </GlassPanel>
  );
}
