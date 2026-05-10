"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, AlertTriangle, Car, Crosshair, Eye,
  Globe, Layers, MapPin, Navigation, Radio,
  Shield, Signal, Siren, Zap, Flame, BarChart2,
  Brain, Cpu, History, Clock, BarChart3
} from "lucide-react";

import { TacticalMap } from "../../../components/maps/TacticalMap";
import { DepartmentCoverageOverlay } from "../../../components/maps/overlays/DepartmentCoverageOverlay";
import { WorkflowPropagationOverlay } from "../../../components/maps/overlays/WorkflowPropagationOverlay";
import { InfrastructureIntelligenceOverlay } from "../../../components/maps/overlays/InfrastructureIntelligenceOverlay";
import { OperationalTimeline } from "../../../components/dashboard/map/OperationalTimeline";
import { GeospatialReplayHUD } from "../../../components/dashboard/map/GeospatialReplayHUD";
import { HistoricalUrbanAnalytics } from "../../../components/dashboard/map/HistoricalUrbanAnalytics";
import { EscalationTracker } from "../../../components/dashboard/EscalationTracker";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { useMapContext } from "../../../providers/MapProvider";
import { useCityOperations, IncidentCategory } from "../../../stores/cityOperations";
import { useOrchestrationRegistry } from "../../../stores/orchestrationRegistry";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LayerState {
  heatmap:        boolean;
  departments:    boolean;
  propagation:    boolean;
  workflows:      boolean;
  infrastructure: boolean;
}

const CATEGORY_ICONS: Record<IncidentCategory, typeof Globe> = {
  infrastructure:  Shield,
  traffic:         Car,
  emergency:       Siren,
  sanitation:      Layers,
  environmental:   Globe,
  utility_failure: Zap,
  public_safety:   Radio,
};

const CATEGORY_COLORS: Record<IncidentCategory, string> = {
  infrastructure:  "text-blue-400",
  traffic:         "text-amber-400",
  emergency:       "text-rose-400",
  sanitation:      "text-green-400",
  environmental:   "text-teal-400",
  utility_failure: "text-orange-400",
  public_safety:   "text-purple-400",
};

type MapFilter = "all" | IncidentCategory;
const ALL_CATEGORIES: IncidentCategory[] = [
  "infrastructure", "traffic", "emergency", "sanitation",
  "environmental", "utility_failure", "public_safety"
];

// ─── Fallback map ─────────────────────────────────────────────────────────────

function TacticalMapFallback() {
  return (
    <div className="absolute inset-0 bg-[#02000a]">
      <div
        className="absolute inset-0 opacity-15 mix-blend-luminosity grayscale"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-10 mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030014]/60 to-[#030014]" />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-5 text-center space-y-2">
          <MapPin className="w-6 h-6 text-[#FFD500] mx-auto" />
          <p className="text-xs font-mono text-white uppercase tracking-widest">City Map — Tactical Mode</p>
          <p className="text-[9px] font-mono text-gray-500">
            Set <span className="text-[#FFD500]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> to enable live map
          </p>
        </div>
      </div>
      {[
        { top: "30%", left: "40%", label: "City Core",   Icon: Radio },
        { top: "45%", left: "60%", label: "Emergency",   Icon: Flame },
        { top: "60%", left: "30%", label: "Traffic Hub", Icon: Car },
        { top: "25%", left: "65%", label: "Data Centre", Icon: Signal },
        { top: "70%", left: "55%", label: "Utilities",   Icon: Zap },
      ].map(({ top, left, label, Icon }, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center"
          style={{ top, left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15 + 0.3 }}
        >
          <div className="relative w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-500" />
            <motion.div
              className="absolute inset-0 rounded-full border border-white/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            />
          </div>
          <div className="mt-2 text-[8px] text-gray-600 font-mono tracking-widest uppercase">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, badge, live }: {
  icon: typeof Globe;
  title: string;
  badge?: string | number;
  live?: boolean;
}) {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-[#FFD500]/10 border border-[#FFD500]/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#FFD500]" />
      </div>
      <div className="flex-1">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white">{title}</h2>
        {badge !== undefined && (
          <span className="text-[8px] font-mono text-gray-500">{badge} events</span>
        )}
      </div>
      {live && (
        <div className="flex items-center space-x-1.5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          />
          <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Live</span>
        </div>
      )}
    </div>
  );
}

// ─── Department Pressure Panel ────────────────────────────────────────────────

function DepartmentPressurePanel() {
  const departments = useCityOperations((s) => s.departments);
  return (
    <GlassPanel className="p-6">
      <SectionHeader icon={Activity} title="Department Pressure Matrix" live />
      <div className="space-y-4">
        {departments.map(dept => {
          const pct = Math.min(100, Math.round((dept.activeIncidents / dept.capacity) * 100));
          const color = dept.status === "critical" ? "bg-rose-500" :
                        dept.status === "elevated"  ? "bg-amber-400" : "bg-[#FFD500]/40";
          const textColor = dept.status === "critical" ? "text-rose-400" :
                            dept.status === "elevated"  ? "text-amber-400" : "text-gray-500";
          return (
            <div key={dept.id} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-300">{dept.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-[8px] font-mono uppercase font-bold ${textColor}`}>{dept.status}</span>
                  <span className={`text-[9px] font-mono font-bold ${textColor}`}>{pct}%</span>
                </div>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

// ─── Escalation Metrics Panel ─────────────────────────────────────────────────

function EscalationMetricsPanel() {
  const cityMetrics = useCityOperations((s) => s.cityMetrics);
  const telemetry   = useOrchestrationRegistry((s) => s.systemTelemetry);

  const stats = [
    { label: "Active Incidents",    value: cityMetrics.activeIncidents,      color: "text-amber-400",   icon: AlertTriangle },
    { label: "Resolved Today",      value: cityMetrics.resolvedToday,         color: "text-emerald-400", icon: Shield },
    { label: "Critical Escalations",value: cityMetrics.criticalEscalations,   color: "text-rose-400",    icon: Siren },
    { label: "AI Coordination",     value: `${cityMetrics.aiCoordinationScore}%`, color: "text-[#FFD500]", icon: Brain },
    { label: "Active AI Flows",     value: telemetry.activeWorkflows,         color: "text-[#FFD500]",   icon: Cpu },
    { label: "Completed Flows",     value: telemetry.totalCompleted,          color: "text-emerald-400", icon: Activity },
  ];

  return (
    <GlassPanel className="p-6">
      <SectionHeader icon={BarChart2} title="Operational Telemetry" live />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col space-y-2"
            >
              <Icon className={`w-4 h-4 ${s.color}`} />
              <div className={`text-xl font-mono font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">{s.label}</div>
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DigitalTwinMapPage() {
  const { isConfigured } = useMapContext();
  const [activeFilter, setActiveFilter]         = useState<MapFilter>("all");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [layers, setLayers]                     = useState<LayerState>({
    heatmap: true, departments: true, propagation: true, workflows: true, infrastructure: true,
  });
  const [clock, setClock] = useState("");

  const incidents       = useCityOperations((s) => s.incidents);
  const cityMetrics     = useCityOperations((s) => s.cityMetrics);
  const systemTelemetry = useOrchestrationRegistry((s) => s.systemTelemetry);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleLayer = useCallback((key: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const allIncidents = Object.values(incidents);
  const selectedIncident = selectedIncidentId ? incidents[selectedIncidentId] : null;

  return (
    <div className="w-full space-y-8 pb-16" style={{ scrollBehavior: "smooth" }}>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — LIVE CITY MAP HERO
      ══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        id="map-hero"
      >
        {/* Section label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-px h-6 bg-[#FFD500]" />
            <Globe className="w-4 h-4 text-[#FFD500]" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white">Live City Intelligence Map</span>
            <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
          </div>
          <span className="text-[9px] font-mono text-gray-600">{clock} UTC</span>
        </div>

        {/* Map container — dominant hero surface */}
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-white/8"
          style={{
            height: "calc(75vh - 6rem)",
            minHeight: 480,
            boxShadow: "0 0 60px rgba(255,213,0,0.04), 0 0 1px rgba(255,213,0,0.15)",
          }}
        >
          {/* Cinematic glow edge */}
          <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
            style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)" }} />

          {/* Map render */}
          <div className="absolute inset-0">
            {isConfigured ? (
              <TacticalMap
                filter={activeFilter}
                showHeatmap={layers.heatmap}
                showWorkflows={layers.workflows}
                onIncidentSelect={setSelectedIncidentId}
                selectedIncidentId={selectedIncidentId}
              >
                {layers.departments   && <DepartmentCoverageOverlay />}
                {layers.propagation   && <WorkflowPropagationOverlay />}
                {layers.infrastructure && <InfrastructureIntelligenceOverlay />}
              </TacticalMap>
            ) : (
              <TacticalMapFallback />
            )}
          </div>

          {/* ── LIGHTWEIGHT MAP HUD — top-left ── */}
          <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-none">
            {/* Live status chip */}
            <motion.div
              initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-2 bg-black/75 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 pointer-events-auto"
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-400"
              />
              <span className="text-[9px] font-mono font-bold text-white uppercase tracking-widest">Operational</span>
              <span className="text-[8px] font-mono text-gray-500 border-l border-white/10 pl-2">{clock}</span>
            </motion.div>

            {/* Quick stats row */}
            <motion.div
              initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.07 }}
              className="grid grid-cols-2 gap-1.5 w-48 pointer-events-auto"
            >
              {[
                { label: "Incidents",  value: cityMetrics.activeIncidents,    color: "text-amber-400" },
                { label: "AI Flows",   value: systemTelemetry.activeWorkflows, color: "text-[#FFD500]" },
              ].map((m, i) => (
                <div key={i} className="bg-black/70 backdrop-blur-xl border border-white/8 rounded-lg px-2.5 py-2">
                  <div className={`text-sm font-mono font-bold ${m.color}`}>{m.value}</div>
                  <div className="text-[6px] font-mono text-gray-600 uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── LIGHTWEIGHT MAP HUD — top-right: layer controls ── */}
          <motion.div
            initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="absolute top-4 right-4 z-20 pointer-events-auto"
          >
            <div className="bg-black/75 backdrop-blur-xl border border-white/10 rounded-xl p-3 w-44">
              <div className="text-[7px] font-mono text-gray-600 uppercase tracking-widest mb-2 flex items-center space-x-1">
                <Layers className="w-2.5 h-2.5" /><span>Map Layers</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {(Object.keys(layers) as (keyof LayerState)[]).map(layer => (
                  <button
                    key={layer}
                    onClick={() => toggleLayer(layer)}
                    className={`text-[6px] font-mono uppercase px-1.5 py-1 rounded border transition-all flex items-center space-x-1 ${
                      layers[layer]
                        ? "border-[#FFD500]/40 bg-[#FFD500]/10 text-[#FFD500]"
                        : "border-white/5 text-gray-700 hover:text-gray-500"
                    }`}
                  >
                    <div className={`w-1 h-1 rounded-full ${layers[layer] ? "bg-[#FFD500]" : "bg-gray-700"}`} />
                    <span>{layer}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── CATEGORY FILTER — bottom-left ── */}
          <motion.div
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}
            className="absolute bottom-4 left-4 z-20 pointer-events-auto"
          >
            <div className="bg-black/75 backdrop-blur-xl border border-white/10 rounded-xl p-3">
              <div className="text-[7px] font-mono text-gray-600 uppercase tracking-widest mb-2">Filter Layer</div>
              <div className="flex flex-wrap gap-1.5 max-w-xs">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`text-[7px] font-mono uppercase px-2 py-0.5 rounded border transition-all ${
                    activeFilter === "all"
                      ? "bg-white/15 border-white/30 text-white"
                      : "border-white/5 text-gray-600 hover:text-gray-400"
                  }`}
                >All</button>
                {ALL_CATEGORIES.map(cat => {
                  const Icon = CATEGORY_ICONS[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`flex items-center space-x-1 text-[7px] font-mono uppercase px-2 py-0.5 rounded border transition-all ${
                        activeFilter === cat
                          ? `bg-white/10 border-white/20 ${CATEGORY_COLORS[cat]}`
                          : "border-white/5 text-gray-700 hover:text-gray-500"
                      }`}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      <span>{cat.replace("_", " ")}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── NAV CONTROLS — bottom-right ── */}
          <motion.div
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
            className="absolute bottom-4 right-4 z-20 pointer-events-auto"
          >
            <div className="bg-black/75 backdrop-blur-xl border border-white/10 rounded-xl p-1 flex flex-col space-y-0.5">
              {[Navigation, Crosshair, MapPin, Eye].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors text-gray-600 hover:text-white"
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── INCIDENT DETAIL POPUP ── */}
          <AnimatePresence>
            {selectedIncident && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/90 backdrop-blur-xl border border-white/15 rounded-xl p-4 w-72"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[9px] font-mono font-bold text-white">{selectedIncident.title}</div>
                    <div className="text-[7px] font-mono text-gray-600 uppercase mt-0.5">
                      {selectedIncident.category.replace("_", " ")} · {selectedIncident.severity}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIncidentId(null)}
                    className="text-gray-700 hover:text-white transition-colors text-[10px]"
                  >✕</button>
                </div>
                <div className="text-[8px] font-mono text-gray-500">{selectedIncident.location.label}</div>
                <div className={`mt-2 inline-block text-[7px] font-mono uppercase px-2 py-0.5 rounded border ${
                  selectedIncident.status === "escalated" ? "border-rose-500/40 text-rose-400 bg-rose-500/10" :
                  selectedIncident.status === "resolved"  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" :
                  "border-amber-500/40 text-amber-400 bg-amber-500/10"
                }`}>
                  {selectedIncident.status}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — OPERATIONAL TELEMETRY
      ══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        id="telemetry"
      >
        <EscalationMetricsPanel />
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — ACTIVE INCIDENT FEED + OPERATIONAL TIMELINE
      ══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        id="incident-feed"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <GlassPanel className="p-6">
          <SectionHeader icon={Signal} title="Active Incident Feed" live />
          <ActivityFeed compact={false} maxVisible={8} />
        </GlassPanel>

        <div>
          <OperationalTimeline
            onEventFocus={(location, workflowId) => {
              console.log("Focus:", location, workflowId);
            }}
          />
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — ESCALATION TRACKER
      ══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        id="escalation-tracker"
      >
        <EscalationTracker />
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — DEPARTMENT PRESSURE + HISTORICAL ANALYTICS
      ══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        id="analytics"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <DepartmentPressurePanel />
        <div>
          <HistoricalUrbanAnalytics />
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — SIMULATION & REPLAY ENGINE
      ══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        id="simulation-replay"
      >
        <div>
          <GeospatialReplayHUD />
        </div>
      </motion.section>

      {/* Footer scan line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD500]/20 to-transparent" />
    </div>
  );
}
