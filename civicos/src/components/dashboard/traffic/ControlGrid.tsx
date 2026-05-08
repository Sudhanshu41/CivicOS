"use client";

import { motion } from "framer-motion";
import { Route } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";

/**
 * CIVICOS — CONTROL GRID
 * Large interactive traffic map and route visualization.
 */

export function ControlGrid() {
  return (
    <GlassPanel className="rounded-xl overflow-hidden relative flex-1 min-h-[450px]" hover={false}>
      {/* Map Background Layer */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity grayscale" />
      </div>

      {/* Glowing Map Overlay Grids */}
      <div className="absolute inset-0 opacity-10 mix-blend-screen bg-grid pointer-events-none" />

      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Live Traffic Control Grid</span>
        <Route className="w-3.5 h-3.5 text-gray-500" />
      </div>

      {/* Animated SVG Traffic Routes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-40" preserveAspectRatio="none">
        {/* Route 1: Main Highway */}
        <motion.path 
          d="M 10% 80% Q 40% 70% 50% 50% T 90% 20%" 
          stroke="rgba(255, 255, 255, 0.15)" 
          strokeWidth="3" 
          fill="transparent" 
          strokeLinecap="round"
        />
        <motion.path 
          d="M 10% 80% Q 40% 70% 50% 50% T 90% 20%" 
          stroke="white" 
          strokeWidth="1" 
          strokeDasharray="4 12"
          fill="transparent" 
          animate={{ strokeDashoffset: [100, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Route 2: Emergency Corridor */}
        <motion.path 
          d="M 20% 10% Q 30% 50% 80% 80%" 
          stroke="rgba(255, 255, 255, 0.05)" 
          strokeWidth="4" 
          fill="transparent" 
          strokeLinecap="round"
        />
        <motion.path 
          d="M 20% 10% Q 30% 50% 80% 80%" 
          stroke="#FFD500" 
          strokeWidth="1.5" 
          strokeDasharray="10 20"
          fill="transparent" 
          animate={{ strokeDashoffset: [0, 100] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Intersection Nodes */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border border-white/20 bg-black flex items-center justify-center relative">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
        </div>
        <div className="mt-3 text-[8px] font-mono text-gray-500 uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap">
          Hub: Omni-1
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-20 bg-black/80 backdrop-blur-xl px-4 py-3 rounded-xl border border-white/5 flex flex-col space-y-2">
        <div className="flex items-center space-x-3 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-white/40" /> <span>Standard Flow</span>
        </div>
        <div className="flex items-center space-x-3 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-[#FFD500]" /> <span>Emergency</span>
        </div>
      </div>
    </GlassPanel>
  );
}
