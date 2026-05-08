"use client";

import { motion } from "framer-motion";

type PulseStatus = "online" | "active" | "warning" | "critical" | "offline" | "syncing";

interface PulseIndicatorProps {
  status?: PulseStatus;
  label?: string;
  size?: "xs" | "sm" | "md";
  showLabel?: boolean;
  className?: string;
  labelClassName?: string;
  color?: "blue" | "emerald" | "purple" | "rose" | "yellow" | "cyan" | "gray" | "white";
}

const colorConfigs = {
  blue:    { core: "#3b82f6", ring: "rgba(59,130,246,0.4)",  text: "text-blue-400" },
  emerald: { core: "#10b981", ring: "rgba(16,185,129,0.4)",  text: "text-emerald-400" },
  purple:  { core: "#8b5cf6", ring: "rgba(139,92,246,0.4)",  text: "text-purple-400" },
  rose:    { core: "#ef4444", ring: "rgba(239,68,68,0.5)",   text: "text-rose-400" },
  yellow:  { core: "#f59e0b", ring: "rgba(245,158,11,0.4)",  text: "text-yellow-400" },
  cyan:    { core: "#06b6d4", ring: "rgba(6,182,212,0.4)",   text: "text-cyan-400" },
  gray:    { core: "#6b7280", ring: "rgba(107,114,128,0.3)", text: "text-gray-500" },
  white:   { core: "#ffffff", ring: "rgba(255,255,255,0.4)", text: "text-white" },
};

const statusConfig: Record<PulseStatus, { core: string; ring: string; text: string; label: string }> = {
  online:   { ...colorConfigs.emerald, label: "ONLINE" },
  active:   { ...colorConfigs.blue,    label: "ACTIVE" },
  warning:  { ...colorConfigs.yellow,  label: "WARNING" },
  critical: { ...colorConfigs.rose,    label: "CRITICAL" },
  offline:  { ...colorConfigs.gray,    label: "OFFLINE" },
  syncing:  { ...colorConfigs.purple,  label: "SYNCING" },
};

const sizeMap = { xs: "w-1.5 h-1.5", sm: "w-2 h-2", md: "w-3 h-3" };
const ringSizeMap = { xs: "w-4 h-4", sm: "w-5 h-5", md: "w-7 h-7" };

export function PulseIndicator({
  status = "online",
  label,
  size = "sm",
  showLabel = true,
  className = "",
  labelClassName = "",
  color,
}: PulseIndicatorProps) {
  const baseCfg = statusConfig[status] || statusConfig.online;
  const cfg = color ? { ...baseCfg, ...colorConfigs[color] } : baseCfg;
  const isSyncing = status === "syncing";
  const isOffline = status === "offline" || color === "gray";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Dot with expanding ring */}
      <div className="relative flex items-center justify-center">
        {/* Expanding ring */}
        {!isOffline && (
          <motion.div
            className={`absolute ${ringSizeMap[size]} rounded-full`}
            style={{ background: cfg.ring }}
            animate={isSyncing
              ? { scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.8, 0.3] }
              : { scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }
            }
            transition={{ duration: isSyncing ? 1.2 : 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {/* Core dot */}
        <motion.div
          className={`${sizeMap[size]} rounded-full relative z-10`}
          style={{ background: cfg.core, boxShadow: `0 0 8px ${cfg.core}` }}
          animate={isSyncing
            ? { opacity: [1, 0.4, 1], scale: [1, 0.8, 1] }
            : isOffline
            ? { opacity: 0.4 }
            : { opacity: [0.9, 1, 0.9] }
          }
          transition={{ duration: isSyncing ? 0.8 : 2, repeat: Infinity }}
        />
      </div>
      {/* Label */}
      {showLabel && (
        <span className={`text-[9px] font-bold font-mono tracking-widest uppercase ${cfg.text} ${labelClassName}`}>
          {label ?? cfg.label}
        </span>
      )}
    </div>
  );
}
