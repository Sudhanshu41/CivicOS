"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, useRef, useState } from "react";

interface ReactiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltStrength?: number;
  hoverLift?: number;
}

export function ReactiveCard({
  children,
  className = "",
  glowColor = "rgba(59,130,246,0.25)",
  tiltStrength = 8,
  hoverLift = 6,
}: ReactiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawGlowX = useMotionValue(50);
  const rawGlowY = useMotionValue(50);

  const rotX = useSpring(useTransform(rawY, [-0.5, 0.5], [tiltStrength, -tiltStrength]), { damping: 22, stiffness: 200 });
  const rotY = useSpring(useTransform(rawX, [-0.5, 0.5], [-tiltStrength, tiltStrength]), { damping: 22, stiffness: 200 });
  const liftY = useSpring(hovered ? -hoverLift : 0, { damping: 20, stiffness: 200 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    rawGlowX.set(((e.clientX - rect.left) / rect.width) * 100);
    rawGlowY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function onLeave() {
    rawX.set(0); rawY.set(0);
    rawGlowX.set(50); rawGlowY.set(50);
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, y: liftY, perspective: 1000, transformStyle: "preserve-3d" }}
      className={`relative overflow-hidden cursor-default transition-shadow duration-300 ${className}`}
    >
      {/* Dynamic cursor-following glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${rawGlowX.get()}% ${rawGlowY.get()}%, ${glowColor} 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
      {/* Edge highlight that brightens on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        animate={hovered ? {
          boxShadow: [`0 0 0px ${glowColor}00`, `0 0 20px ${glowColor}`, `0 0 0px ${glowColor}00`],
        } : { boxShadow: "none" }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Top glass sheen that shifts with tilt */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
