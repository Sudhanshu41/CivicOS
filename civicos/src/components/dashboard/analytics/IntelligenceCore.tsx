"use client";

import { motion } from "framer-motion";
import { Cpu, BrainCircuit } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";
import { PulseIndicator } from "../../motion/PulseIndicator";

/**
 * CIVICOS — INTELLIGENCE CORE
 * Visualization of the prediction engine's neural processing.
 */

export function IntelligenceCore() {
  return (
    <GlassPanel className="p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[350px]" hover={false}>
      {/* Neural Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black opacity-80" />
      </div>
      
      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-10 flex items-center space-x-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Engine Core</span>
        <Cpu className="w-3.5 h-3.5 text-gray-500" />
      </div>
      
      <div className="absolute top-6 right-6 z-10">
        <div className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full flex items-center">
          <PulseIndicator status="active" size="xs" color="white" showLabel={false} className="mr-2" />
          <span className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.1em]">1.2M Nodes/Sec</span>
        </div>
      </div>

      {/* Central Visual */}
      <div className="relative z-10 flex items-center justify-center w-full h-full my-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-64 h-64 border border-dashed border-white/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 border border-white/5 rounded-full"
        />
        
        <div className="relative w-20 h-20 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-white/20 rounded-full blur-2xl"
          />
          <div className="relative w-14 h-14 border border-white/20 rounded-full flex items-center justify-center bg-black/80 backdrop-blur-md">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Data Stream Simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {[0, 90, 180, 270].map(angle => (
            <motion.path 
              key={angle}
              d={`M 50% 50% L ${50 + 40 * Math.cos(angle * Math.PI / 180)}% ${50 + 40 * Math.sin(angle * Math.PI / 180)}%`} 
              stroke="white" 
              strokeWidth="0.5" 
              fill="transparent" 
              strokeDasharray="2 4" 
              animate={{ strokeDashoffset: [20, 0] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
            />
          ))}
        </svg>
      </div>
    </GlassPanel>
  );
}
