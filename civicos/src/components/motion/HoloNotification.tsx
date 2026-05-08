"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, BrainCircuit, CheckCircle2, Info, X, Zap } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "critical" | "intel";
  duration?: number;
}

const typeConfig = {
  info:     { icon: Info,          border: "border-blue-500/40",    bg: "from-blue-900/40",   glow: "rgba(59,130,246,0.3)",   tag: "text-blue-400"    },
  success:  { icon: CheckCircle2,  border: "border-emerald-500/40", bg: "from-emerald-900/40",glow: "rgba(16,185,129,0.3)",   tag: "text-emerald-400" },
  warning:  { icon: AlertTriangle, border: "border-orange-500/40",  bg: "from-orange-900/40", glow: "rgba(234,88,12,0.3)",    tag: "text-orange-400"  },
  critical: { icon: Zap,           border: "border-rose-500/40",    bg: "from-rose-900/50",   glow: "rgba(244,63,94,0.4)",    tag: "text-rose-400"    },
  intel:    { icon: BrainCircuit,  border: "border-purple-500/40",  bg: "from-purple-900/40", glow: "rgba(139,92,246,0.3)",   tag: "text-purple-400"  },
};

const AUTO_NOTIFICATIONS: Omit<Notification, "id" | "duration">[] = [
  { title: "Pothole Alert", message: "Severity increase detected in Sector 7-B. Dispatch queued.", type: "warning" },
  { title: "AI Optimization", message: "City energy consumption reduced by 4.2 MWh this cycle.", type: "success" },
  { title: "Neural Sync", message: "Intelligence mesh retrained on 48h mobility dataset.", type: "intel" },
  { title: "Emergency Signal", message: "Structural anomaly detected on Overpass-12. Inspecting.", type: "critical" },
  { title: "Traffic Update", message: "Smart routing applied. Avg commute reduced by 11 minutes.", type: "success" },
  { title: "Security Alert", message: "Unusual network activity at Port Gate-3. Monitoring active.", type: "critical" },
  { title: "Prediction Engine", message: "94.2% rainfall confidence in 3 hours. Drainage pre-activated.", type: "intel" },
  { title: "Civic Report", message: "Satisfaction index: 92.4% (+0.8%). Governance score: Optimal.", type: "info" },
];

export function HoloNotification() {
  const [queue, setQueue] = useState<Notification[]>([]);
  const [counter, setCounter] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const notif = AUTO_NOTIFICATIONS[msgIdx % AUTO_NOTIFICATIONS.length];
      const newNotif: Notification = { ...notif, id: Date.now(), duration: 5000 };
      setQueue(prev => [newNotif, ...prev].slice(0, 4));
      setMsgIdx(i => i + 1);
      setCounter(c => c + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, [msgIdx]);

  useEffect(() => {
    if (queue.length === 0) return;
    const oldest = queue[queue.length - 1];
    const timer = setTimeout(() => {
      setQueue(prev => prev.filter(n => n.id !== oldest.id));
    }, oldest.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [queue]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 pointer-events-none w-80">
      <AnimatePresence mode="popLayout">
        {queue.map((notif) => {
          const cfg = typeConfig[notif.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.85, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 80, scale: 0.9, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className={`pointer-events-auto relative overflow-hidden rounded-xl border ${cfg.border} backdrop-blur-2xl cursor-pointer`}
              style={{
                background: `linear-gradient(135deg, ${cfg.bg.replace("from-", "")} 0%, rgba(5,6,15,0.95) 100%)`,
                boxShadow: `0 0 30px ${cfg.glow}, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`,
              }}
              onClick={() => setQueue(p => p.filter(n => n.id !== notif.id))}
            >
              {/* Animated top accent bar */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${cfg.glow}, transparent)` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Sweep shimmer */}
              <motion.div
                className="absolute inset-y-0 w-20 pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)` }}
                animate={{ left: ["-25%", "125%"] }}
                transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
              />
              <div className="relative z-10 p-3.5 flex items-start gap-3">
                <div className={`p-1.5 rounded-lg shrink-0`}
                  style={{ background: `${cfg.glow.replace("0.3", "0.15")}`, border: `1px solid ${cfg.glow}` }}
                >
                  <Icon className={`w-3.5 h-3.5 ${cfg.tag}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[11px] font-bold ${cfg.tag} mb-0.5 uppercase tracking-wider`}>{notif.title}</div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{notif.message}</p>
                </div>
                <button className="text-gray-600 hover:text-gray-300 transition shrink-0 mt-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
              {/* Progress bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px]"
                style={{ background: cfg.glow }}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: (notif.duration ?? 5000) / 1000, ease: "linear" }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
