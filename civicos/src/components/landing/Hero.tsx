"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Globe, BrainCircuit } from "lucide-react";
import { CinematicText } from "../ui/CinematicText";
import { PulseIndicator } from "../motion/PulseIndicator";

/**
 * CIVICOS — LANDING HERO
 * High-impact cinematic introduction to the platform.
 */

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-24 px-6 lg:px-20 z-10">
      <div className="container mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <div className="flex flex-col space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="inline-flex items-center gap-4 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full w-max backdrop-blur-md"
          >
            <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">System v2.5 Online</span>
          </motion.div>

          <h1 className="text-6xl lg:text-8xl font-bold leading-[0.95] tracking-tighter">
            <CinematicText 
              text="ARCHITECTED" 
              className="block text-white"
              delay={0.2}
            />
            <CinematicText 
              text="INTELLIGENCE"
              className="block text-[#FFD500]"
              delay={0.4}
            />
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="text-lg text-gray-500 max-w-xl leading-relaxed font-medium uppercase tracking-tight"
          >
            The next evolution of urban infrastructure. An autonomous operating system 
            designed to monitor, analyze, and optimize city health in real-time.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 pt-6"
          >
            <Link href="/dashboard">
              <button className="bg-white hover:bg-[#FFD500] text-black font-bold py-5 px-12 rounded-lg text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center group shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Enter Dashboard <ChevronRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/dashboard/map">
              <button className="bg-transparent border border-white/10 hover:border-white/20 text-white font-bold py-5 px-12 rounded-lg text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center backdrop-blur-sm">
                <Globe className="mr-3 w-4 h-4 text-gray-500" /> Digital Twin
              </button>
            </Link>
          </motion.div>
        </div>

        {/* AI Core Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative flex justify-center items-center"
        >
          <div className="relative w-72 h-72 lg:w-96 lg:h-96">
            <div className="absolute inset-0 border border-white/5 rounded-full shadow-[inset_0_0_50px_rgba(255,255,255,0.02)]" />
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border border-white/10 rounded-full border-dashed"
            />

            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute inset-12 border border-white/20 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-white/[0.01] border border-white/10 rounded-full backdrop-blur-2xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)]">
              <motion.div
                animate={{ scale: [1, 1.05, 1], filter: ["blur(0px)", "blur(1px)", "blur(0px)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <BrainCircuit className="w-14 h-14 text-white" />
              </motion.div>
            </div>

            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 15 + i * 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none"
              >
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_white]"
                  style={{ transform: `translateY(-${(i + 1) * 20}px)` }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
