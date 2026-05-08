"use client";

import { motion } from "framer-motion";
import { Network, Zap, Droplet, Router } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";

/**
 * CIVICOS — UTILITY GRID
 * Schematic visualization of macro-infrastructure nodes.
 */

export function UtilityGrid() {
  return (
    <GlassPanel className="rounded-xl overflow-hidden relative flex-1 min-h-[400px]" hover={false}>
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen" />
        <div className="absolute inset-0 bg-grid opacity-10 mix-blend-screen" />
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-3">
        <Network className="w-4 h-4 text-gray-500" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Macro Infra Grid</span>
      </div>

      {/* Nodes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Energy Core */}
        <div className="absolute top-[50%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-[#FFD500]" />
          </div>
          <div className="mt-3 text-[8px] font-mono text-gray-500 uppercase tracking-widest">Energy Core</div>
        </div>

        {/* Water Distro */}
        <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center">
            <Droplet className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="mt-3 text-[8px] font-mono text-gray-500 uppercase tracking-widest">Water Distro</div>
        </div>

        {/* Comms Hub */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center">
            <Router className="w-3.5 h-3.5 text-gray-500" />
          </div>
        </div>

        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <motion.path 
            d="M 30% 50% L 60% 40% L 50% 20%" 
            stroke="white" 
            strokeWidth="0.5" 
            fill="transparent" 
            strokeDasharray="4 4" 
            animate={{ strokeDashoffset: [20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
    </GlassPanel>
  );
}
