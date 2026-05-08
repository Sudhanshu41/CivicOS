"use client";

import { PulseStatus, ThemeColor } from "../../types";
import { PulseIndicator } from "../motion/PulseIndicator";

/**
 * CIVICOS — STATUS BADGE
 * Standardized status indicator for agents, nodes, and infrastructure.
 */

interface StatusBadgeProps {
  status: PulseStatus;
  label?: string;
  color?: ThemeColor;
  size?: "xs" | "sm";
  className?: string;
}

export function StatusBadge({ 
  status, 
  label, 
  color, 
  size = "xs",
  className = "" 
}: StatusBadgeProps) {
  return (
    <div className={`status-badge ${className}`}>
      <PulseIndicator 
        status={status} 
        color={color as any} 
        size={size} 
        showLabel={false} 
      />
      <span>{label || status.toUpperCase()}</span>
    </div>
  );
}
