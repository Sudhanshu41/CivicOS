"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Activity, AlertTriangle, Car, Crosshair, Eye,
  MapPin, Navigation, Shield, Signal, Siren, Zap,
  Globe, Layers, Radio
} from "lucide-react";

import { MapBase } from "../../../components/dashboard/map/MapBase";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { LiveStatusIndicator } from "../../../components/motion/LiveStatusIndicator";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { MetricCounter } from "../../../components/motion/MetricCounter";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { useCityOperations, IncidentCategory } from "../../../stores/cityOperations";
import { useOrchestrationRegistry } from "../../../stores/orchestrationRegistry";

const CATEGORY_ICONS: Record<IncidentCategory, typeof AlertTriangle> = {
  infrastructure: Shield,
  traffic:        Car,
  emergency:      Siren,
  sanitation:     Layers,
  environmental:  Globe,
  utility_failure: Zap,
  public_safety:  Radio,
};

const CATEGORY_COLORS: Record<IncidentCategory, string> = {
  infrastructure: "text-blue-400",
  traffic:        "text-amber-400",
  emergency:      "text-rose-400",
  sanitation:     "text-green-400",
  environmental:  "text-teal-400",
  utility_failure:"text-orange-400",
  public_safety:  "text-purple-400",
};

type MapFilter = "all" | IncidentCategory;

/**
 * CIVICOS — CITY INTELLIGENCE MAP
 * Upgraded with realtime incident plotting, workflow geolocation,
 * severity overlays, department coverage, and live AI orchestration telemetry.
 */
export default function DigitalTwinMapPage() {
  const [activeFilter, setActiveFilter] = useState<MapFilter>("all");
  const cityMetrics    = useCityOperations((s) => s.cityMetrics);
  const incidents      = useCityOperations((s) => s.incidents);
  const departments    = useCityOperations((s) => s.departments);
  const systemTelemetry = useOrchestrationRegistry((s) => s.systemTelemetry);

  // Live clock for realism
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const allIncidents = Object.values(incidents);
  const filtered = activeFilter === "all" ? allIncidents : allIncidents.filter(i => i.category === activeFilter);

  const categories: IncidentCategory[] = [
    "infrastructure", "traffic", "emergency", "sanitation",
    "environmental", "utility_failure", "public_safety"
  ];

  return (
    <div className="relative w-full h-[calc(100vh-10rem)] overflow-hidden rounded-2xl border border-white/5 bg-black flex flex-col">

      {/* 1. Map Foundation */}
      <MapBase />

      {/* 2. Top Overlays */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">

        {/* Left: City Command Metrics */}
        <motion.div
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="w-72 space-y-3 pointer-events-auto"
        >
          {/* Title */}
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-3.5 h-3.5 text-[#FFD500]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">City Operations</span>
            <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
          </div>

          <GlassPanel className="p-4 space-y-3">
            {[
              { label: "Active Incidents", value: cityMetrics.activeIncidents, icon: AlertTriangle, color: "text-amber-400" },
              { label: "AI Orchestrations", value: systemTelemetry.activeWorkflows, icon: Zap, color: "text-[#FFD500]" },
              { label: "Resolved Today", value: cityMetrics.resolvedToday, icon: Activity, color: "text-emerald-400" },
              { label: "Avg Resolution", value: (cityMetrics.avgResolutionMs / 1000).toFixed(1), suffix: "s", icon: Signal, color: "text-blue-400" },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <m.icon className={`w-3 h-3 ${m.color}`} />
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{m.label}</span>
                </div>
                <span className={`text-[11px] font-mono ${m.color}`}>
                  {typeof m.value === "number" ? m.value : m.value}{(m as any).suffix || ""}
                </span>
              </div>
            ))}
          </GlassPanel>

          {/* Category filter chips */}
          <GlassPanel className="p-3">
            <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-2">Filter Layer</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveFilter("all")}
                className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded border transition-all ${
                  activeFilter === "all"
                    ? "bg-white/10 border-white/20 text-white"
                    : "border-white/5 text-gray-600 hover:text-gray-400"
                }`}
              >
                All
              </button>
              {categories.map(cat => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`flex items-center space-x-1 text-[8px] font-mono uppercase px-2 py-0.5 rounded border transition-all ${
                      activeFilter === cat
                        ? `bg-white/10 border-white/20 ${CATEGORY_COLORS[cat]}`
                        : "border-white/5 text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    <span>{cat.replace("_", " ")}</span>
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Right: Emergency Panel + Workflow Status */}
        <motion.div
          initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="w-80 space-y-3 pointer-events-auto"
        >
          {/* Clock */}
          <div className="text-right mb-1">
            <span className="text-[9px] font-mono text-gray-600">{clock} UTC</span>
          </div>

          <GlassPanel className="overflow-hidden border-[#FFD500]/10">
            <div className="bg-white/[0.02] p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Siren className="w-3.5 h-3.5 text-[#FFD500]" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Emergency Hub</span>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[9px] font-mono text-rose-400 uppercase"
              >
                Live
              </motion.div>
            </div>
            <div className="p-5">
              <div className="text-xs font-bold text-white uppercase tracking-widest mb-1">Sector 4 Structural Fire</div>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-4">Engines 4, 7 & 9 dispatched. Autonomous drone routing active. Monitoring structural integrity.</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Units", value: 3 },
                  { label: "ETA", value: "02:14" },
                  { label: "Severity", value: "HIGH" },
                ].map((s, i) => (
                  <div key={i} className="text-center bg-white/[0.02] rounded-lg p-2">
                    <div className="text-[10px] font-mono text-white font-bold">{s.value}</div>
                    <div className="text-[8px] text-gray-600 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 bg-white/[0.01] hover:bg-white/[0.05] border border-white/5 rounded-lg text-[9px] text-white font-bold tracking-[0.2em] uppercase transition-all">
                View Protocols
              </button>
            </div>
          </GlassPanel>

          {/* Department load summary */}
          <GlassPanel className="p-4">
            <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-3">Department Pressure</div>
            <div className="space-y-2">
              {departments.filter(d => d.status !== "nominal").map(dept => (
                <div key={dept.id} className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-400">{dept.name}</span>
                  <span className={`text-[9px] font-mono uppercase font-bold ${
                    dept.status === "critical" ? "text-rose-400" : "text-amber-400"
                  }`}>{dept.status}</span>
                </div>
              ))}
              {departments.filter(d => d.status !== "nominal").length === 0 && (
                <div className="text-[9px] font-mono text-emerald-400">All departments nominal</div>
              )}
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* 3. Bottom Overlays */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none flex justify-between items-end">

        {/* Left: Map Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex flex-col space-y-2 pointer-events-auto"
        >
          <GlassPanel className="p-1 flex flex-col space-y-1">
            {[Navigation, Crosshair, MapPin].map((Icon, i) => (
              <button key={i} className="p-2.5 hover:bg-white/[0.05] rounded-lg transition-colors text-gray-500 hover:text-white">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </GlassPanel>
        </motion.div>

        {/* Center: Active Incident Feed (filtered) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="flex-1 max-w-xl mx-6 pointer-events-auto"
        >
          <GlassPanel className="p-4">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  {activeFilter === "all" ? "All Incidents" : activeFilter.replace("_", " ")}
                </span>
              </div>
              <span className="text-[9px] font-mono text-gray-600">{filtered.length} active</span>
            </div>
            {filtered.length === 0 ? (
              <p className="text-[10px] font-mono text-gray-700 italic text-center py-3">
                No incidents matching filter
              </p>
            ) : (
              <div className="space-y-1.5 max-h-28 overflow-y-auto no-scrollbar">
                <AnimatePresence>
                  {filtered.slice(0, 5).map(incident => {
                    const Icon = CATEGORY_ICONS[incident.category];
                    return (
                      <motion.div
                        key={incident.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-2 bg-white/[0.02] border border-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-3 h-3 ${CATEGORY_COLORS[incident.category]}`} />
                          <span className="text-[9px] font-mono text-gray-300 truncate max-w-[180px]">{incident.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[8px] font-mono text-gray-600">{incident.location.label}</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            incident.severity === "critical" ? "bg-rose-500 animate-pulse" :
                            incident.severity === "high"     ? "bg-orange-500" :
                            incident.severity === "medium"   ? "bg-amber-400" : "bg-gray-500"
                          }`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* Right: Live Telemetry */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="w-72 pointer-events-auto"
        >
          <GlassPanel className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center space-x-2">
                <Signal className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Live Intel</span>
              </div>
              <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
            </div>
            <div className="h-36 p-3 pt-2 overflow-y-auto no-scrollbar">
              <ActivityFeed maxVisible={5} compact />
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
