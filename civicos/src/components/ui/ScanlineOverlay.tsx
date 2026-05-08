"use client";

import { motion } from "framer-motion";

export function ScanlineOverlay() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      <motion.div 
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="fixed left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none z-[90] mix-blend-screen"
      />
    </>
  );
}
