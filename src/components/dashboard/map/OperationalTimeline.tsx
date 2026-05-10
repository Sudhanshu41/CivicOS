"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import {
  AlertTriangle, ArrowUp, Cpu, Globe, Shield, Signal, Zap, ChevronDown
} from "lucide-react";
import { useOrchestrationRegistry } from "../../../stores/orchestrationRegistry";
import { useCityOperations } from "../../../stores/cityOperations";
import { GlassPanel } from "../../ui/GlassPanel";
import { PulseIndicator } from "../../motion/PulseIndicator";

// ─── Operational Timeline Event ────────────────────────────────────────────────

interface TimelineEvent {
  id: string;
  type: "incident" | "escalation" | "workflow_completed" | "ai_decision" | "infrastructure";
  title: string;
  detail?: string;
  severity?: "low" | "medium" | "high" | "critical";
  timestamp: string;
  workflowId?: string;
  location?: string;
}

const EVENT_ICONS: Record<TimelineEvent["type"], typeof Globe> = {
  incident:            AlertTriangle,
  escalation:          ArrowUp,
  workflow_completed:  Cpu,
  ai_decision:         Shield,
  infrastructure:      Zap,
};

const EVENT_COLORS: Record<TimelineEvent["type"], string> = {
  incident:            "text-amber-400 border-amber-500/30 bg-amber-500/5",
  escalation:          "text-rose-400 border-rose-500/30 bg-rose-500/5",
  workflow_completed:  "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  ai_decision:         "text-[#FFD500] border-[#FFD500]/30 bg-[#FFD500]/5",
  infrastructure:      "text-blue-400 border-blue-500/30 bg-blue-500/5",
};

// Auto-generate demo timeline events from realtime stores
function buildTimeline(
  incidents: ReturnType<typeof useCityOperations.getState>["incidents"],
  escalations: ReturnType<typeof useCityOperations.getState>["escalations"],
  workflows: ReturnType<typeof useOrchestrationRegistry.getState>["workflows"],
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Incidents
  Object.values(incidents).slice(0, 6).forEach((inc) => {
    events.push({
      id: `inc-${inc.id}`,
      type: "incident",
      title: inc.title,
      detail: `${inc.category} — ${inc.severity}`,
      severity: inc.severity,
      timestamp: inc.timestamp,
      location: inc.location.label,
    });
  });

  // Escalations
  escalations.slice(-4).forEach((esc) => {
    events.push({
      id: `esc-${esc.id}`,
      type: "escalation",
      title: `Escalation: ${esc.reason.slice(0, 40)}`,
      severity: esc.severity,
      timestamp: esc.timestamp,
      workflowId: esc.fromWorkflow,
    });
  });

  // Completed workflows
  Object.values(workflows)
    .filter((w) => w.status === "completed")
    .slice(-4)
    .forEach((wf) => {
      events.push({
        id: `wf-${wf.issue_id}`,
        type: "workflow_completed",
        title: "Orchestration Completed",
        detail: `${wf.issue_id.slice(0, 10)}...`,
        timestamp: wf.telemetry.endTime || new Date().toISOString(),
        workflowId: wf.issue_id,
      });
    });

  // Running workflows → ai_decision events
  Object.values(workflows)
    .filter((w) => w.status === "running")
    .slice(-3)
    .forEach((wf) => {
      events.push({
        id: `ai-${wf.issue_id}`,
        type: "ai_decision",
        title: "AI Routing Decision",
        detail: `Priority: ${wf.priority}`,
        timestamp: wf.telemetry.startTime || new Date().toISOString(),
        workflowId: wf.issue_id,
      });
    });

  // Sort newest first
  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

interface OperationalTimelineProps {
  onEventFocus?: (location?: string, workflowId?: string) => void;
}

/**
 * CIVICOS — OPERATIONAL TIMELINE
 * Global city operations timeline synchronized with map events.
 * Clickable incidents focus the map view.
 */
export function OperationalTimeline({ onEventFocus }: OperationalTimelineProps) {
  const incidents   = useCityOperations((s) => s.incidents);
  const escalations = useCityOperations((s) => s.escalations);
  const workflows   = useOrchestrationRegistry((s) => s.workflows);
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const events = buildTimeline(incidents, escalations, workflows);

  const handleClick = useCallback((evt: TimelineEvent) => {
    setActiveId(evt.id);
    onEventFocus?.(evt.location, evt.workflowId);
  }, [onEventFocus]);

  return (
    <GlassPanel className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Signal className="w-3.5 h-3.5 text-gray-500" />
          <h3 className="text-[10px] font-medium text-white uppercase tracking-widest">
            Operational Timeline
          </h3>
          {events.length > 0 && (
            <span className="text-[8px] font-mono text-gray-600 border border-white/10 px-1.5 py-0.5 rounded">
              {events.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
          <button onClick={() => setCollapsed(c => !c)} className="text-gray-600 hover:text-white transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Events list */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-y-auto no-scrollbar"
            style={{ maxHeight: 220 }}
          >
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-700">
                <Globe className="w-6 h-6 opacity-20 mb-2" />
                <p className="text-[9px] font-mono uppercase tracking-widest italic">
                  Monitoring city...
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-1.5">
                <AnimatePresence mode="popLayout">
                  {events.map((evt) => {
                    const Icon = EVENT_ICONS[evt.type];
                    const colorClass = EVENT_COLORS[evt.type];
                    const isActive = activeId === evt.id;

                    return (
                      <motion.button
                        key={evt.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        onClick={() => handleClick(evt)}
                        className={`w-full text-left flex items-start space-x-2.5 p-2 rounded-lg border transition-all ${colorClass} ${
                          isActive ? "ring-1 ring-white/20" : "hover:bg-white/5"
                        }`}
                      >
                        <Icon className={`w-3 h-3 mt-0.5 shrink-0 ${colorClass.split(" ")[0]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-mono font-medium text-white truncate">
                              {evt.title}
                            </span>
                            <span className="text-[8px] font-mono text-gray-600 shrink-0">
                              {new Date(evt.timestamp).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          {evt.detail && (
                            <p className="text-[8px] text-gray-600 truncate mt-0.5">{evt.detail}</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}
