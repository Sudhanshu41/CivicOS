"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeSlideUp } from "../../lib/motionConfig";

/**
 * CIVICOS — STATS OVERVIEW
 * Top-level dashboard metrics for high-level awareness.
 */

interface Stat {
  label: string;
  val: string;
  color?: string;
}

export function StatsOverview() {
  const stats: Stat[] = [
    { label: "Intelligence Level", val: "Omni-5",   color: "text-white" },
    { label: "Active Agents",      val: "14,092",   color: "text-white" },
    { label: "Prediction Acc.",    val: "99.8%",    color: "text-white" },
    { label: "Infra Stability",    val: "Optimal",  color: "text-[#FFD500]" },
  ];

  return (
    <motion.div 
      variants={staggerContainer} 
      initial="hidden" 
      animate="show" 
      className="grid grid-cols-2 md:grid-cols-4 gap-6 z-10 mb-8"
    >
      {stats.map((stat, idx) => (
        <motion.div 
          key={idx} 
          variants={fadeSlideUp}
          className="glass-panel p-5 rounded-lg flex flex-col justify-center border-t border-white/10"
        >
          <div className={`text-2xl font-light tracking-tight ${stat.color} mb-1`}>{stat.val}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
