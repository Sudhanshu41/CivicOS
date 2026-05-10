"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * CIVICOS — GLASS PANEL
 * Primary container component for all dashboard modules.
 */

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "solid" | "ghost";
  hover?: boolean;
}

export function GlassPanel({ 
  children, 
  className, 
  variant = "default", 
  hover = true,
  ...props 
}: GlassPanelProps) {
  const baseStyles = "relative overflow-hidden rounded-xl border transition-all duration-500";
  
  const variants = {
    default: "bg-white/[0.02] border-white/5 backdrop-blur-xl",
    solid: "bg-black/40 border-white/10 backdrop-blur-2xl",
    ghost: "bg-transparent border-transparent",
  };

  const hoverStyles = hover ? "hover:border-white/10 hover:bg-white/[0.04]" : "";

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

