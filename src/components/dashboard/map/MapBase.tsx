"use client";

import { motion } from "framer-motion";
import { Radio, Flame, Car } from "lucide-react";
import { RadarSweep } from "../../motion/RadarSweep";

/**
 * CIVICOS — MAP BASE
 * Digital twin visualization with nodes and real-time connectivity.
 */

export function MapBase() {
  return (
    <>
      {/* City Map Layer */}
      <div className="absolute inset-0 bg-[#02000a]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-grid opacity-10 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030014]/60 to-[#030014]" />
      </div>

      {/* Scanning Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-30">
        <RadarSweep color="white" />
      </div>

      {/* Nodes & Connections */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Node Alpha */}
        <motion.div 
          className="absolute top-[30%] left-[40%] flex flex-col items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-pointer group hover:border-white/40 transition">
            <Radio className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
          </div>
          <div className="mt-2 text-[8px] text-gray-600 font-mono tracking-widest uppercase">Node Alpha</div>
        </motion.div>

        {/* Emergency Node */}
        <motion.div 
          className="absolute top-[45%] left-[60%] flex flex-col items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        >
          <div className="w-14 h-14 rounded-full border border-white/40 bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-pointer group">
            <Flame className="w-5 h-5 text-white" />
            <div className="absolute inset-0 border border-white/20 rounded-full animate-ping" />
          </div>
          <div className="mt-2 bg-black border border-white/10 px-2 py-0.5 rounded text-[8px] text-white font-mono font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            Fire Alarm Sec-4
          </div>
        </motion.div>

        {/* Traffic Hub */}
        <motion.div 
          className="absolute top-[60%] left-[30%] flex flex-col items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        >
          <div className="w-8 h-8 rounded-full border border-white/10 bg-black/40 flex items-center justify-center pointer-events-auto cursor-pointer hover:border-white/40 transition">
            <Car className="w-3.5 h-3.5 text-gray-500" />
          </div>
          <div className="mt-2 text-[8px] text-gray-600 font-mono tracking-widest uppercase">Traffic Hub X</div>
        </motion.div>

        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
           <motion.path 
             d="M 40% 30% L 60% 45%" 
             stroke="rgba(255, 255, 255, 0.2)" 
             strokeWidth="0.5" 
             strokeDasharray="4,4" 
             fill="transparent"
             animate={{ strokeDashoffset: [20, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           />
           <circle cx="0" cy="0" r="1.5" fill="#fff">
             <animateMotion dur="3s" repeatCount="indefinite" path="M 40% 30% L 60% 45%" />
           </circle>
        </svg>
      </div>
    </>
  );
}
