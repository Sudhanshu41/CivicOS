"use client";

import { BrainCircuit } from "lucide-react";
import { GlassPanel } from "../ui/GlassPanel";

/**
 * CIVICOS — CORE VISUAL
 * Central brain visualization of the Omni-5 intelligence.
 */

export function CoreVisual() {
  return (
    <GlassPanel className="w-full xl:w-1/3 flex flex-col items-center justify-center relative min-h-[400px]" hover={false}>
      <div className="absolute inset-0 bg-grid-fine opacity-20 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center p-8">
        <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-black relative">
          <div 
            className="absolute inset-0 rounded-full border border-white/20 animate-ping" 
            style={{ animationDuration: '3s' }} 
          />
          <BrainCircuit className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-xl font-light tracking-wider text-white mb-2 uppercase">Omni-5 Core</h2>
        <p className="text-[10px] text-gray-500 max-w-[200px] leading-relaxed uppercase tracking-widest font-medium">
          Central intelligence routing all city subsystems and autonomous agents in real-time.
        </p>
      </div>
    </GlassPanel>
  );
}
