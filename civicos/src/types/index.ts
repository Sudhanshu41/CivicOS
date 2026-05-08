/**
 * CIVICOS — CORE TYPE DEFINITIONS
 * Centralized types for a production-grade frontend architecture.
 */

// --- Status & Identity ---
export type PulseStatus = "online" | "active" | "warning" | "critical" | "offline" | "syncing";
export type RadarColor = "blue" | "green" | "red" | "white" | "yellow";
export type ThemeColor = "white" | "yellow" | "gray" | "blue" | "emerald" | "rose" | "purple" | "cyan";

// --- Data Models ---
export interface ActivityEntry {
  time: string;
  msg: string;
  type?: "system" | "action" | "warn" | "alert" | "success";
  id?: string;
}

export interface NotificationEntry {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
}

export interface MetricData {
  label: string;
  value: number;
  target?: number;
  prefix?: string;
  suffix?: string;
  color?: ThemeColor;
  icon?: any; // Lucide icon component
  trend?: "up" | "down" | "neutral";
}

export interface AgentData {
  id: string;
  name: string;
  status: PulseStatus;
  type: string;
  power: number;
  active: boolean;
  icon: any;
}

// --- Component Props ---
export interface BaseMotionProps {
  className?: string;
  delay?: number;
}
