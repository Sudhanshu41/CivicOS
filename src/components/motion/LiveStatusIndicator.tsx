"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Activity, Cpu, Globe2, ShieldCheck, Zap } from "lucide-react";

interface StatusItem {
  id: string;
  label: string;
  value: string;
  status: "nominal" | "elevated" | "critical" | "syncing";
  icon: React.ElementType;
}

const statusColors = {
  nominal:  { dot: "bg-emerald-400", text: "text-emerald-400", glow: "rgba(16,185,129,0.4)" },
  elevated: { dot: "bg-yellow-400",  text: "text-yellow-400",  glow: "rgba(234,179,8,0.4)"  },
  critical: { dot: "bg-rose-500",    text: "text-rose-400",    glow: "rgba(239,68,68,0.5)"  },
  syncing:  { dot: "bg-blue-400",    text: "text-blue-400",    glow: "rgba(59,130,246,0.4)" },
};

const INITIAL: StatusItem[] = [
  { id: "ai-core",    label: "AI Core",            value: "Omni-5 Active",   status: "nominal",  icon: Cpu       },
  { id: "neural-net", label: "Neural Network",     value: "99.8% Accuracy",  status: "nominal",  icon: Activity  },
  { id: "infra",      label: "Infra Stability",    value: "96.4%",           status: "nominal",  icon: Globe2    },
  { id: "security",   label: "Security Layer",     value: "All Clear",       status: "nominal",  icon: ShieldCheck},
  { id: "energy",     label: "Power Grid",         value: "68.2% Load",      status: "elevated", icon: Zap       },
];

const FLUCTUATIONS: Partial<StatusItem>[][] = [
  [{ id: "energy", value: "71.4% Load", status: "elevated" }],
  [{ id: "neural-net", value: "Retraining...", status: "syncing" }],
  [{ id: "neural-net", value: "99.9% Accuracy", status: "nominal" }],
  [{ id: "infra", value: "97.1%", status: "nominal" }],
  [{ id: "energy", value: "65.8% Load", status: "nominal" }],
  [{ id: "security", value: "Scanning...", status: "syncing" }],
  [{ id: "security", value: "All Clear", status: "nominal" }],
];

export function LiveStatusIndicator({ className = "" }: { className?: string }) {
  const [items, setItems] = useState<StatusItem[]>(INITIAL);
  const [fluctIdx, setFluctIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const updates = FLUCTUATIONS[fluctIdx % FLUCTUATIONS.length];
      setItems(prev => prev.map(item => {
        const update = updates.find(u => u.id === item.id);
        return update ? { ...item, ...update } : item;
      }));
      setFluctIdx(i => i + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [fluctIdx]);

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, idx) => {
        const cfg = statusColors[item.status];
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center gap-3 p-2.5 rounded-lg group hover:bg-white/[0.04] transition-colors"
            style={{ borderLeft: `2px solid ${cfg.glow}` }}
          >
            <Icon className={`w-3.5 h-3.5 ${cfg.text} shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className={`text-xs font-bold ${cfg.text}`}
                >
                  {item.value}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Animated status dot */}
            <div className="relative shrink-0">
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full ${cfg.dot} blur-[2px]`}
              />
              <motion.div
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${cfg.dot} relative z-10`}
                style={{ boxShadow: `0 0 6px ${cfg.glow}` }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
