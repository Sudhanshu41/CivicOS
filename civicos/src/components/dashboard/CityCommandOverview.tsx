"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle, Clock, Globe, Shield, Zap } from "lucide-react";
import { useOrchestrationRegistry } from "../../stores/orchestrationRegistry";
import { useCityOperations } from "../../stores/cityOperations";
import { MetricCounter } from "../motion/MetricCounter";
import { GlassPanel } from "../ui/GlassPanel";

const CATEGORY_COLORS: Record<string, string> = {
  infrastructure: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  traffic:        "text-amber-400 bg-amber-500/10 border-amber-500/20",
  emergency:      "text-rose-400 bg-rose-500/10 border-rose-500/20",
  sanitation:     "text-green-400 bg-green-500/10 border-green-500/20",
  environmental:  "text-teal-400 bg-teal-500/10 border-teal-500/20",
  utility_failure:"text-orange-400 bg-orange-500/10 border-orange-500/20",
  public_safety:  "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const SEVERITY_PULSE: Record<string, string> = {
  low:      "bg-gray-500",
  medium:   "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
  high:     "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]",
  critical: "bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]",
};

/**
 * CIVICOS — CITY COMMAND OVERVIEW
 * Full-width city operations status panel.
 * Displays active workflows, incident categories, department loads, and escalation status.
 */
export function CityCommandOverview() {
  const systemTelemetry = useOrchestrationRegistry((s) => s.systemTelemetry);
  const workflows       = useOrchestrationRegistry((s) => s.workflows);
  const cityMetrics     = useCityOperations((s) => s.cityMetrics);
  const departments     = useCityOperations((s) => s.departments);
  const incidents       = useCityOperations((s) => s.incidents);
  const escalations     = useCityOperations((s) => s.escalations);

  const allIncidents = Object.values(incidents);
  const activeIncidents = allIncidents.filter(i => i.status === "active" || i.status === "escalated");
  const criticalIncidents = activeIncidents.filter(i => i.severity === "critical");

  // Category distribution
  const categoryCount: Record<string, number> = {};
  allIncidents.forEach(i => {
    categoryCount[i.category] = (categoryCount[i.category] || 0) + 1;
  });

  // Workflow statuses
  const workflowList = Object.values(workflows);
  const runningCount = workflowList.filter(w => w.status === "running").length;
  const failedCount  = workflowList.filter(w => w.status === "failed").length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* --- Column 1: City Health Metrics --- */}
      <GlassPanel className="p-6 xl:col-span-1">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <h3 className="text-xs font-medium text-white uppercase tracking-widest">City Intelligence</h3>
          <Globe className="w-4 h-4 text-gray-500" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: "Active Incidents", value: cityMetrics.activeIncidents + activeIncidents.length, icon: AlertTriangle, color: "text-amber-400" },
            { label: "Resolved Today",  value: cityMetrics.resolvedToday,  icon: CheckCircle, color: "text-emerald-400" },
            { label: "AI Workflows",    value: systemTelemetry.activeWorkflows, icon: Zap, color: "text-[#FFD500]" },
            { label: "Escalations",     value: cityMetrics.criticalEscalations + escalations.filter(e => !e.resolved).length, icon: Shield, color: "text-rose-400" },
          ].map((m, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 group hover:border-white/10 transition-all">
              <m.icon className={`w-4 h-4 ${m.color} mb-3`} />
              <MetricCounter
                value={m.value}
                label={m.label}
                color="white"
                valueClassName="text-xl font-light text-white"
                fluctuate={m.label === "AI Workflows"}
                fluctuateRange={0}
              />
            </div>
          ))}
        </div>

        {/* AI Coordination Score */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">AI Coordination Score</span>
            <span className="text-sm font-mono text-[#FFD500]">{cityMetrics.aiCoordinationScore.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cityMetrics.aiCoordinationScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-[#FFD500] shadow-[0_0_8px_rgba(255,213,0,0.4)]"
            />
          </div>
        </div>
      </GlassPanel>

      {/* --- Column 2: Concurrent Workflow Registry --- */}
      <GlassPanel className="p-6 xl:col-span-1">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <h3 className="text-xs font-medium text-white uppercase tracking-widest">Active Orchestrations</h3>
          <Activity className="w-4 h-4 text-gray-500" />
        </div>

        {workflowList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-700 space-y-2">
            <Zap className="w-8 h-8 opacity-20" />
            <p className="text-[10px] font-mono uppercase tracking-widest italic">No active orchestrations</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-64 no-scrollbar">
            <AnimatePresence>
              {workflowList.map((wf) => (
                <motion.div
                  key={wf.issue_id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      wf.status === "running"   ? "bg-[#FFD500] animate-pulse shadow-[0_0_6px_rgba(255,213,0,0.7)]" :
                      wf.status === "completed" ? "bg-emerald-400" :
                      wf.status === "failed"    ? "bg-rose-500" : "bg-gray-600"
                    }`} />
                    <div>
                      <div className="text-[10px] font-mono text-white truncate max-w-[130px]">{wf.issue_id.slice(0, 8)}...</div>
                      <div className="text-[8px] font-mono text-gray-600 uppercase">{wf.status} • {wf.priority}</div>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-gray-500 text-right">
                    <div className="text-white">{wf.telemetry.retries > 0 ? `${wf.telemetry.retries}R` : "—"}</div>
                    <div className="text-gray-700 uppercase">{wf.priority}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Running", value: runningCount, color: "text-[#FFD500]" },
            { label: "Failed",  value: failedCount,  color: "text-rose-400" },
            { label: "Total",   value: workflowList.length, color: "text-white" },
          ].map((s, i) => (
            <div key={i}>
              <div className={`text-sm font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* --- Column 3: Department Load --- */}
      <GlassPanel className="p-6 xl:col-span-1">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <h3 className="text-xs font-medium text-white uppercase tracking-widest">Department Load</h3>
          <Clock className="w-4 h-4 text-gray-500" />
        </div>

        <div className="space-y-4">
          {departments.map((dept, i) => {
            const pct = Math.min(100, Math.round((dept.activeIncidents / dept.capacity) * 100));
            const barColor =
              dept.status === "critical"  ? "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
              dept.status === "elevated"  ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]" :
              "bg-[#FFD500]";

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{dept.name}</span>
                  <span className="text-[9px] font-mono text-gray-500">{dept.activeIncidents}/{dept.capacity}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Category distribution */}
        {Object.keys(categoryCount).length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-3">Incident Categories</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryCount).map(([cat, cnt]) => (
                <span
                  key={cat}
                  className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded border ${CATEGORY_COLORS[cat] || "text-gray-400 bg-white/5 border-white/10"}`}
                >
                  {cat.replace("_", " ")} {cnt}
                </span>
              ))}
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
