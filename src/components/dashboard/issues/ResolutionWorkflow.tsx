"use client";

import { motion } from "framer-motion";
import { Radio, Eye, Search, AlertTriangle, ArrowRight, Wrench } from "lucide-react";
import { GlassPanel } from "../../ui/GlassPanel";

/**
 * CIVICOS — RESOLUTION WORKFLOW
 * Visual pipeline for civic issue processing and resolution.
 */

interface ResolutionWorkflowProps {
  activeStep: number;
}

const steps = [
  { name: "Report", icon: Radio },
  { name: "AI Detect", icon: Eye },
  { name: "Validate", icon: Search },
  { name: "Severity", icon: AlertTriangle },
  { name: "Route", icon: ArrowRight },
  { name: "Resolve", icon: Wrench },
];

export function ResolutionWorkflow({ activeStep }: ResolutionWorkflowProps) {
  return (
    <GlassPanel className="p-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-10">
        <h3 className="font-medium text-xs tracking-widest text-white uppercase">Resolution Workflow</h3>
        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Automated Pipeline</div>
      </div>
      
      <div className="flex items-center justify-between relative px-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center relative z-10 group">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-700 ${
              activeStep >= idx 
                ? 'border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                : 'border-white/5 bg-black/40 text-gray-600'
            }`}>
              <step.icon className="w-4 h-4" />
            </div>
            <div className={`text-[8px] mt-4 uppercase font-bold tracking-[0.2em] transition-colors duration-500 ${
              activeStep >= idx ? 'text-white' : 'text-gray-700'
            }`}>
              {step.name}
            </div>
            
            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div className="absolute top-5.5 left-11 w-[calc(100%+2.5rem)] h-[1px] bg-white/5 -z-10">
                <motion.div 
                  className="h-full bg-white shadow-[0_0_5px_white]" 
                  initial={{ width: "0%" }}
                  animate={{ width: activeStep > idx ? "100%" : "0%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
