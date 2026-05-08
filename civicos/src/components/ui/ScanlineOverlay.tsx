"use client";

import { motion } from "framer-motion";

/**
 * CIVICOS — SCANLINE OVERLAY
 * Minimalist atmospheric effect for the production interface.
 */
export function ScanlineOverlay() {
  return (
    <>
      {/* Micro-grid scanlines */}
      <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px]"></div>
      
      {/* Subtle traveling light sweep */}
      <motion.div 
        animate={{ top: ["-20%", "120%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="fixed left-0 right-0 h-64 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none z-[90] mix-blend-screen"
      />
    </>
  );
}
