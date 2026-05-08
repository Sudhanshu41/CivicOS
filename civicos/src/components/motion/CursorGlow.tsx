"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: -200, y: -200 });
  const currentRef = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Smooth lerp loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.12);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.12);
      setPos({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Large ambient glow */}
      <div
        className="fixed pointer-events-none z-[999] transition-opacity duration-500"
        style={{
          left: pos.x - 200,
          top: pos.y - 200,
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)",
          opacity: visible ? 1 : 0,
          borderRadius: "50%",
          mixBlendMode: "screen",
        }}
      />
      {/* Small precise cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[1000] rounded-full"
        style={{
          left: pos.x - 4,
          top: pos.y - 4,
          width: clicking ? 6 : 8,
          height: clicking ? 6 : 8,
          background: "rgba(96,165,250,0.9)",
          boxShadow: "0 0 8px rgba(59,130,246,0.8), 0 0 20px rgba(59,130,246,0.4)",
          opacity: visible ? 1 : 0,
          mixBlendMode: "screen",
        }}
        animate={{ scale: clicking ? 0.7 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
      {/* Ring around cursor */}
      <div
        className="fixed pointer-events-none z-[999] rounded-full border border-blue-400/30 transition-all duration-100"
        style={{
          left: pos.x - 20,
          top: pos.y - 20,
          width: clicking ? 30 : 40,
          height: clicking ? 30 : 40,
          opacity: visible ? 0.6 : 0,
          transform: "translate(0, 0)",
          transition: "width 0.2s, height 0.2s, opacity 0.5s",
        }}
      />
    </>
  );
}
