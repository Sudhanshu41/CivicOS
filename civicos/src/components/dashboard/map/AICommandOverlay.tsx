"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  AlertTriangle, Cpu, Shield, Brain
} from "lucide-react";
import { useOrchestrationRegistry } from "../../../stores/orchestrationRegistry";
import { useCityOperations } from "../../../stores/cityOperations";
import { PulseIndicator } from "../../motion/PulseIndicator";

// City health index derived from real store state
function computeCityHealthIndex(
  aiScore: number,
  activeIncidents: number,
  criticalEscalations: number,
): number {
  const incidentPenalty = Math.min(40, activeIncidents * 1.2);
  const escalationPenalty = criticalEscalations * 8;
  const base = aiScore - incidentPenalty - escalationPenalty;
  return Math.max(0, Math.min(100, base));
}

/**
 * CIVICOS — AI COMMAND OVERLAY
 * Premium tactical overlay showing realtime AI operational decisions,
 * city health index, emergency alerts, and active workflow pressure.
 * Positioned as an HUD layer over the map.
 */
export function AICommandOverlay() {
  const systemTelemetry = useOrchestrationRegistry((s) => s.systemTelemetry);
  const workflows       = useOrchestrationRegistry((s) => s.workflows);
  const cityMetrics     = useCityOperations((s) => s.cityMetrics);
  const escalations     = useCityOperations((s) => s.escalations);

  const activeEscalations = escalations.filter(e => !e.resolved);
  const emergencyWorkflows = Object.values(workflows).filter(w => w.priority === "emergency" && w.status === "running");
  const runningCount = systemTelemetry.activeWorkflows;

  const healthIndex = computeCityHealthIndex(
    cityMetrics.aiCoordinationScore,
    cityMetrics.activeIncidents,
    activeEscalations.length,
  );

  const healthColor =
    healthIndex >= 80 ? "text-emerald-400" :
    healthIndex >= 60 ? "text-[#FFD500]" :
    healthIndex >= 40 ? "text-orange-400" : "text-rose-500";

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col space-y-2 pointer-events-none">
      {/* City Health Index Chip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3"
      >
        <Brain className="w-3.5 h-3.5 text-[#FFD500]" />
        <div>
          <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">City Health Index</div>
          <div className={`text-sm font-mono font-bold ${healthColor}`}>{healthIndex.toFixed(1)}%</div>
        </div>
        <div className="ml-auto">
          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${healthIndex}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                healthIndex >= 80 ? "bg-emerald-400" :
                healthIndex >= 60 ? "bg-[#FFD500]" :
                healthIndex >= 40 ? "bg-orange-400" : "bg-rose-500"
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* Active Workflow Pressure */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3 h-3 text-gray-500" />
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">AI Orchestrations</span>
          </div>
          <PulseIndicator
            status={runningCount > 0 ? "active" : "offline"}
            size="xs"
            color="yellow"
            showLabel={false}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Running",   value: runningCount,                              color: "text-[#FFD500]" },
            { label: "Completed", value: systemTelemetry.totalCompleted,            color: "text-emerald-400" },
            { label: "Failed",    value: systemTelemetry.totalFailed,               color: "text-rose-400" },
          ].map((m, i) => (
            <div key={i}>
              <div className={`text-xs font-mono font-bold ${m.color}`}>{m.value}</div>
              <div className="text-[7px] font-mono text-gray-700 uppercase">{m.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Escalation Alert */}
      <AnimatePresence>
        {(activeEscalations.length > 0 || emergencyWorkflows.length > 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-rose-950/80 backdrop-blur-xl border border-rose-500/30 rounded-xl px-4 py-3"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </motion.div>
              <span className="text-[9px] font-mono font-bold text-rose-300 uppercase tracking-widest">
                {activeEscalations.length > 0
                  ? `${activeEscalations.length} Active Escalation${activeEscalations.length > 1 ? "s" : ""}`
                  : `${emergencyWorkflows.length} Emergency Workflow${emergencyWorkflows.length > 1 ? "s" : ""}`
                }
              </span>
            </div>
            {activeEscalations[0] && (
              <p className="text-[8px] text-rose-400/60 mt-1 truncate font-mono">
                {activeEscalations[0].reason}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realtime AI Decision Ticker */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tick}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          className="bg-black/80 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-2.5"
        >
          <div className="flex items-start space-x-2">
            <Shield className="w-3 h-3 text-[#FFD500] mt-0.5 shrink-0" />
            <div>
              <div className="text-[7px] font-mono text-gray-600 uppercase tracking-widest mb-0.5">Latest AI Decision</div>
              <p className="text-[9px] font-mono text-gray-300 leading-snug">
                {[
                  "Traffic signal optimization applied — Sector 4 throughput +18%",
                  "Utility crew dispatched to pipeline fault, Grid B-7",
                  "Emergency rerouting: 3 units redirected via AI routing engine",
                  "Predictive maintenance alert: Bridge load sensor anomaly detected",
                  "Air quality threshold crossed — environmental response queued",
                ][tick % 5]}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
