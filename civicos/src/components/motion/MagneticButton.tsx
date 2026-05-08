"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  glowColor?: string;
}

const variants = {
  primary:   { base: "bg-blue-600 text-white border border-blue-500/50", glow: "rgba(59,130,246,0.6)" },
  secondary: { base: "glass-panel text-white border border-white/10", glow: "rgba(139,92,246,0.5)" },
  ghost:     { base: "text-gray-300 border border-white/10", glow: "rgba(255,255,255,0.3)" },
  danger:    { base: "bg-rose-600/80 text-white border border-rose-500/50", glow: "rgba(244,63,94,0.6)" },
};

export function MagneticButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  glowColor,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.1 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  function handleMouse(e: MouseEvent<HTMLButtonElement>) {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(Math.max(-18, Math.min(18, (clientX - cx) * 0.55)));
    y.set(Math.max(-10, Math.min(10, (clientY - cy) * 0.55)));
    glowX.set(((clientX - rect.left) / rect.width) * 100);
    glowY.set(((clientY - rect.top) / rect.height) * 100);
  }

  function handleLeave() {
    x.set(0); y.set(0);
    glowX.set(50); glowY.set(50);
    setHovered(false);
  }

  const effectiveGlow = glowColor ?? variants[variant].glow;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onTapStart={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer select-none ${variants[variant].base} ${className}`}
    >
      {/* Radial glow that follows cursor */}
      {hovered && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, ${effectiveGlow} 0%, transparent 65%)`,
            opacity: 0.6,
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {/* Energy sweep on hover */}
      {hovered && (
        <motion.span
          className="absolute inset-y-0 w-16 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${effectiveGlow}50, transparent)` }}
          animate={{ left: ["-20%", "120%"] }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}
      {/* Outer glow ring */}
      <motion.span
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        animate={hovered ? {
          boxShadow: [`0 0 0px ${effectiveGlow}00`, `0 0 24px ${effectiveGlow}`, `0 0 0px ${effectiveGlow}00`],
        } : { boxShadow: "none" }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
