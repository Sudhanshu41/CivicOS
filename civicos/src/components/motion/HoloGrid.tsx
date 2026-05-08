"use client";

import { motion } from "framer-motion";

export function HoloGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-30 perspective-[1000px] z-0">
      <motion.div
        animate={{ rotateX: [60, 65, 60], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="w-[200%] h-[200%] absolute -bottom-1/2 -left-1/2 bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[length:40px_40px] transform-gpu"
        style={{
          maskImage: "radial-gradient(circle at center, black 10%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 10%, transparent 60%)"
        }}
      />
    </div>
  );
}
