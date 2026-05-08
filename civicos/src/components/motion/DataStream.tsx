"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DataStream({ direction = "down" }: { direction?: "up" | "down" | "left" | "right" }) {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, delay: number, speed: number }[]>([]);

  useEffect(() => {
    // Generate random particle positions only on client to avoid hydration errors
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      speed: 3 + Math.random() * 4,
    }));
    setParticles(generated);
  }, []);

  const getAnimation = (speed: number) => {
    if (direction === "down") return { y: ["-10%", "110%"] };
    if (direction === "up") return { y: ["110%", "-10%"] };
    if (direction === "right") return { x: ["-10%", "110%"] };
    if (direction === "left") return { x: ["110%", "-10%"] };
    return { y: ["-10%", "110%"] };
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40 mix-blend-screen">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-0.5 h-12 bg-gradient-to-b from-transparent via-blue-400 to-transparent blur-[1px]"
          style={{
            left: direction === "down" || direction === "up" ? `${p.x}%` : undefined,
            top: direction === "left" || direction === "right" ? `${p.y}%` : undefined,
            filter: "drop-shadow(0 0 5px rgba(59,130,246,0.8))"
          }}
          animate={getAnimation(p.speed)}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
