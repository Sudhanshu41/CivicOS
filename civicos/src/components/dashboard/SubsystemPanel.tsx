"use client";

import { motion } from "framer-motion";
import { Network, Car, Siren, BrainCircuit, Building2, Leaf, Database } from "lucide-react";
import { GlassPanel } from "../ui/GlassPanel";
import { fadeSlideLeft } from "../../lib/motionConfig";

/**
 * CIVICOS — SUBSYSTEM PANEL
 * Monitoring active autonomous city systems.
 */

const subsystems = [
  { name: "Traffic Engine", icon: Car, acc: "98%", status: "Active" },
  { name: "Emergency Coord", icon: Siren, acc: "99%", status: "Active" },
  { name: "Predictive Analytics", icon: BrainCircuit, acc: "95%", status: "Processing" },
  { name: "Infra Monitor", icon: Building2, acc: "100%", status: "Active" },
  { name: "Environmental AI", icon: Leaf, acc: "92%", status: "Active" },
  { name: "Gov Resources", icon: Database, acc: "96%", status: "Syncing" },
];

export function SubsystemPanel() {
  return (
    <GlassPanel className="p-6 flex-1">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <h3 className="font-medium text-sm tracking-widest text-white uppercase">Active Subsystems</h3>
        <Network className="w-4 h-4 text-gray-500" />
      </div>
      
      <div className="space-y-2">
        {subsystems.map((sys, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white/[0.02] rounded-md p-3 flex items-center justify-between border border-transparent hover:border-white/10 transition group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <sys.icon className={`w-4 h-4 ${sys.status === 'Processing' ? 'text-[#FFD500]' : 'text-gray-400'}`} />
              <span className="text-xs text-gray-300 group-hover:text-white transition">{sys.name}</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 font-mono tracking-tighter">{sys.acc} ACC</div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
