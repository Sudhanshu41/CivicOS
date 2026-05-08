"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useOrchestrationRegistry } from "../../stores/orchestrationRegistry";

interface ActivityEntry {
  id: string | number;
  time: string;
  msg: string;
  type: "system" | "alert" | "warn" | "success" | "action" | "intel" | "ai";
  agent?: string;
}

const typeStyles = {
  system:  { dot: "bg-blue-400",    text: "text-gray-300",   tag: "text-blue-400",   label: "SYS" },
  alert:   { dot: "bg-rose-500",    text: "text-rose-300",   tag: "text-rose-400",   label: "ALT" },
  warn:    { dot: "bg-orange-400",  text: "text-orange-300", tag: "text-orange-400", label: "WRN" },
  success: { dot: "bg-emerald-400", text: "text-emerald-300",tag: "text-emerald-400",label: "OK " },
  action:  { dot: "bg-cyan-400",    text: "text-cyan-200",   tag: "text-cyan-400",   label: "ACT" },
  intel:   { dot: "bg-purple-400",  text: "text-purple-200", tag: "text-purple-400", label: "INT" },
  ai:      { dot: "bg-yellow-400",  text: "text-yellow-200", tag: "text-yellow-400", label: "AI " },
};

function getSafeTime() {
  if (typeof window === "undefined") return "00:00:00";
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

const SEED_LOGS: Omit<ActivityEntry, "id">[] = [
  { time: "00:00:00", msg: "Neural mesh synchronization complete across 147 city nodes.", type: "system", agent: "Core-AI" },
  { time: "00:00:00", msg: "Pothole cluster detected: Sector 7, Grid B-14. Priority queued.", type: "alert", agent: "Vision" },
  { time: "00:00:00", msg: "Traffic signal optimization applied — avg speed +18%.", type: "success", agent: "Traffic" },
  { time: "00:00:00", msg: "Power grid load balancing active for Districts 4–9.", type: "action", agent: "Energy" },
  { time: "00:00:00", msg: "Prediction model updated. 94.2% confidence on rainfall in 3h.", type: "intel", agent: "Predict" },
  { time: "00:00:00", msg: "Garbage overflow flagged: Zone C-22. Dispatch scheduled.", type: "warn", agent: "Civic" },
];

const AUTO_MESSAGES: Omit<ActivityEntry, "id" | "time">[] = [
  { msg: "Bridge stress analysis complete — all structural metrics nominal.", type: "success", agent: "Infra" },
  { msg: "Emergency unit EMS-04 repositioned to cover Sector 3 gap.", type: "action", agent: "Emergency" },
  { msg: "Air quality index rising in Zone D. Environmental AI investigating.", type: "warn", agent: "Env-AI" },
  { msg: "14,092 active citizen queries processed. Avg resolution: 1.2s.", type: "system", agent: "Core-AI" },
  { msg: "Autonomous repair drone dispatched to streetlight cluster NW-8.", type: "action", agent: "Drone" },
  { msg: "Neural network retrained on 48h mobility data. Accuracy +0.3%.", type: "intel", agent: "ML-Engine" },
  { msg: "Water pressure anomaly detected in Pipeline-7. Valve adjusting.", type: "alert", agent: "Water" },
  { msg: "City-wide energy consumption optimized — saving 4.2 MWh/hr.", type: "success", agent: "Energy" },
  { msg: "Civic satisfaction score updated: 92.4% (+0.8% from last cycle).", type: "intel", agent: "Analytics" },
  { msg: "Smart parking system rerouted 340 vehicles to Zone G lots.", type: "action", agent: "Traffic" },
  { msg: "Noise pollution spike at Sector 12. Advisory issued to residents.", type: "warn", agent: "Env-AI" },
  { msg: "Security AI flagged unusual activity near Port Gate-3. Monitoring.", type: "alert", agent: "Security" },
];

export function ActivityFeed({ maxVisible = 8, compact = false, className = "", live = false }: {
  maxVisible?: number;
  compact?: boolean;
  className?: string;
  live?: boolean;
}) {
  const activeId = useOrchestrationRegistry(state => state.activeWorkflowId);
  const activeWf = useOrchestrationRegistry(state => activeId ? state.workflows[activeId] : null);
  const storeLogs = activeWf?.logs || [];
  const [mounted, setMounted] = useState(false);
  const [localLogs, setLocalLogs] = useState<ActivityEntry[]>(
    SEED_LOGS.map((l, i) => ({ ...l, id: i }))
  );
  const [msgIdx, setMsgIdx] = useState(0);
  const [counter, setCounter] = useState(SEED_LOGS.length);

  useEffect(() => {
    setMounted(true);
    // On mount, update the initial logs with real timestamps
    const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLocalLogs(prev => prev.map(l => ({ ...l, time: currentTime })));
  }, []);

  useEffect(() => {
    if (!mounted || live) return;
    const interval = setInterval(() => {
      const next = AUTO_MESSAGES[msgIdx % AUTO_MESSAGES.length];
      const time = new Date().toLocaleTimeString("en-US", { hour12: false });
      setLocalLogs(prev => [{ ...next, time, id: counter }, ...prev].slice(0, maxVisible + 4));
      setMsgIdx(i => i + 1);
      setCounter(c => c + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, [msgIdx, counter, maxVisible, mounted, live]);

  const displayLogs = live ? storeLogs.map((l, i) => ({
    id: `live-${i}`,
    time: new Date().toLocaleTimeString("en-US", { hour12: false }),
    msg: l.message,
    type: l.level === 'ai' ? 'ai' : (l.level === 'error' ? 'alert' : (l.level === 'warning' ? 'warn' : 'system')),
    agent: l.agent
  })).reverse() : localLogs;

  const visible = displayLogs.slice(0, maxVisible);

  return (
    <div className={`space-y-1.5 overflow-hidden ${className}`}>
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((log) => {
          const s = typeStyles[log.type as keyof typeof typeStyles] || typeStyles.system;
          return (
            <motion.div
              key={log.id}
              layout
              initial={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`flex items-start gap-2 ${compact ? "p-1.5" : "p-2.5"} rounded-lg bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05] transition-colors group`}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: (Number(log.id) % 10) * 0.2 || 0 }}
                className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${s.dot}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-bold font-mono ${s.tag} shrink-0`}>[{s.label}]</span>
                  {log.agent && <span className="text-[9px] text-gray-600 font-mono shrink-0">{log.agent}</span>}
                  <span className="text-[9px] text-gray-700 font-mono ml-auto shrink-0">{log.time}</span>
                </div>
                <p className={`text-[10px] leading-snug ${s.text} truncate group-hover:whitespace-normal transition-all`}>{log.msg}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
