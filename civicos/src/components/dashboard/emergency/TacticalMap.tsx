"use client";

import { motion } from "framer-motion";
import { Crosshair, Flame } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";

/**
 * CIVICOS — TACTICAL MAP
 * High-fidelity coordination map for emergency response scenarios.
 */

export function TacticalMap() {
  return (
    <GlassPanel className="rounded-xl overflow-hidden relative flex-1 min-h-[400px]" hover={false}>
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black to-black opacity-80" />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Tactical Command</span>
        <Crosshair className="w-3.5 h-3.5 text-gray-500" />
      </div>

      {/* Tactical Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        {/* Emergency Zone Marker */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-40 h-40 border border-rose-500/30 rounded-full"
          />
          <div className="relative bg-rose-500/10 border border-rose-500/40 rounded-full w-10 h-10 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
        </div>

        {/* Tactical Indicators */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-xl px-3 py-1.5 border border-rose-500/20 rounded-md flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_#f43f5e]" />
            <span className="text-[9px] font-bold tracking-widest text-rose-500 uppercase">Crisis: Isolated</span>
          </div>
          <div className="bg-black/80 backdrop-blur-xl px-3 py-1.5 border border-white/10 rounded-md flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />
            <span className="text-[9px] font-bold tracking-widest text-white uppercase">Evac Path: Secure</span>
          </div>
        </div>

        {/* Animated Routing */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <motion.path 
            d="M 20% 80% Q 40% 60% 50% 33%" 
            stroke="white" 
            strokeWidth="0.5" 
            strokeDasharray="4 4"
            fill="transparent"
            animate={{ strokeDashoffset: [20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="0" cy="0" r="1.5" fill="#fff">
            <animateMotion dur="4s" repeatCount="indefinite" path="M 20% 80% Q 40% 60% 50% 33%" />
          </circle>
        </svg>
      </div>
    </GlassPanel>
  );
}
