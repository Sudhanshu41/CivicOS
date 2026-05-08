"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

import { StatsOverview } from "../../components/dashboard/StatsOverview";
import { SubsystemPanel } from "../../components/dashboard/SubsystemPanel";
import { HealthPanel } from "../../components/dashboard/HealthPanel";
import { CoreVisual } from "../../components/dashboard/CoreVisual";
import { TelemetryGrid } from "../../components/dashboard/TelemetryGrid";
import { ConsciousnessFeed } from "../../components/dashboard/ConsciousnessFeed";

import { LiveStatusIndicator } from "../../components/motion/LiveStatusIndicator";
import { GlassPanel } from "../../components/ui/GlassPanel";

/**
 * CIVICOS — MASTER CORE DASHBOARD
 * Production-grade refactored entry point for the AI Operating System.
 */
export default function MasterCorePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] relative">
      
      {/* Background Ambience (Standardized) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-grid opacity-5 mix-blend-screen" />
        <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent rounded-full blur-[100px]" />
      </div>

      {/* 1. Stats Overview Section */}
      <StatsOverview />

      <div className="flex flex-col xl:flex-row gap-8 z-10 flex-1">
        
        {/* 2. Left Column: Subsystems & Health */}
        <div className="w-full xl:w-1/3 flex flex-col space-y-8">
          <SubsystemPanel />
          <HealthPanel />
        </div>

        {/* 3. Center Column: Core Intelligence Visual */}
        <CoreVisual />

        {/* 4. Right Column: Telemetry & Consciousness */}
        <div className="w-full xl:w-1/3 flex flex-col space-y-8">
          
          {/* System Status Monitor */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h3 className="font-medium text-sm tracking-widest text-white uppercase">System Status</h3>
              <Cpu className="w-4 h-4 text-gray-500" />
            </div>
            <LiveStatusIndicator />
          </GlassPanel>

          <TelemetryGrid />
          <ConsciousnessFeed />
        </div>

      </div>
    </div>
  );
}
