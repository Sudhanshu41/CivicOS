"use client";

import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  Car,
  CheckCircle, 
  Cpu, 
  Database, 
  Eye, 
  MapPin,
  Network, 
  Radio, 
  Search, 
  ShieldCheck, 
  Smartphone, 
  Zap 
} from "lucide-react";
import { useEffect } from "react";
import { useNodesState, useEdgesState, Edge, Node } from "@xyflow/react";

import { FlowVisualizer } from "../../../components/dashboard/orchestration/FlowVisualizer";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { MetricCounter } from "../../../components/motion/MetricCounter";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { useWorkflow } from "../../../hooks/useWorkflow";

/**
 * CIVICOS — AI ORCHESTRATION PAGE
 * Refactored for production-grade modularity and maintainability.
 */

const initialNodes: Node[] = [
  { id: "input", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Civic Input", status: "Listening", icon: Radio, isActive: true } },
  { id: "vision", type: "agentNode", position: { x: 0, y: 120 }, data: { label: "Vision Agent", status: "Standby", icon: Eye, isActive: false } },
  { id: "research", type: "agentNode", position: { x: 250, y: 120 }, data: { label: "Research Agent", status: "Standby", icon: Search, isActive: false } },
  { id: "validation", type: "agentNode", position: { x: 500, y: 120 }, data: { label: "Validation Agent", status: "Standby", icon: ShieldCheck, isActive: false } },
  { id: "routing", type: "agentNode", position: { x: 250, y: 240 }, data: { label: "Routing Engine", status: "Standby", icon: Network, isActive: false } },
  { id: "action", type: "agentNode", position: { x: 125, y: 360 }, data: { label: "Action Agent", status: "Standby", icon: Zap, isActive: false } },
  { id: "notify", type: "agentNode", position: { x: 375, y: 360 }, data: { label: "Notification Agent", status: "Standby", icon: Smartphone, isActive: false } },
];

const initialEdges: Edge[] = [
  { id: "e-in-vis", source: "input", target: "vision", animated: true },
  { id: "e-in-res", source: "input", target: "research", animated: true },
  { id: "e-vis-val", source: "vision", target: "validation", animated: true },
  { id: "e-res-val", source: "research", target: "validation", animated: true },
  { id: "e-val-rout", source: "validation", target: "routing", animated: true },
  { id: "e-rout-act", source: "routing", target: "action", animated: true },
  { id: "e-rout-not", source: "routing", target: "notify", animated: true },
];

export default function OrchestrationPage() {
  const { activeStep } = useWorkflow(5);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync ReactFlow State with Workflow
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => {
        let isActive = false;
        let status = "Standby";
        
        if (activeStep === 0 && node.id === "input") { isActive = true; status = "Processing Input"; }
        if (activeStep === 1 && (node.id === "vision" || node.id === "research")) { isActive = true; status = "Analyzing"; }
        if (activeStep === 2 && node.id === "validation") { isActive = true; status = "Verifying"; }
        if (activeStep === 3 && node.id === "routing") { isActive = true; status = "Routing Task"; }
        if (activeStep === 4 && (node.id === "action" || node.id === "notify")) { isActive = true; status = "Executing"; }
        
        return { ...node, data: { ...node.data, isActive, status: isActive ? status : "Standby" } };
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        let isAnimated = false;
        if (activeStep === 0 && (edge.source === "input")) isAnimated = true;
        if (activeStep === 1 && (edge.source === "vision" || edge.source === "research")) isAnimated = true;
        if (activeStep === 2 && edge.source === "validation") isAnimated = true;
        if (activeStep === 3 && edge.source === "routing") isAnimated = true;

        return {
          ...edge,
          animated: isAnimated,
          style: { 
            stroke: isAnimated ? "#ffffff" : "#222", 
            strokeWidth: 1 
          }
        };
      })
    );
  }, [activeStep, setNodes, setEdges]);

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-10rem)]">
      
      {/* 1. Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* ReactFlow Visualizer */}
        <FlowVisualizer 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange} 
        />

        {/* Intelligence & Tooling Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64 shrink-0">
          
          {/* Reasoning Engine Panel */}
          <GlassPanel className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Reasoning Engine</h3>
              <BrainCircuit className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="flex-1 space-y-5">
              <div className="bg-white/[0.01] rounded-lg p-3 border border-white/5">
                <div className="flex justify-between text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                  <span>Visual Confidence</span>
                  <MetricCounter value={98.2} target={98.2} fluctuate fluctuateRange={0.5} suffix="%" color="white" decimals={1} valueClassName="text-xs font-light" />
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "98.2%" }} className="h-full bg-white shadow-[0_0_8px_white]" />
                </div>
              </div>
              <div className="flex justify-between items-center bg-white/[0.01] p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Severity Analysis</div>
                <div className="text-xs font-medium text-[#FFD500] uppercase tracking-wider">Medium Risk</div>
              </div>
            </div>
          </GlassPanel>

          {/* Tools & API usage */}
          <GlassPanel className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Tool Integrations</h3>
              <Database className="w-4 h-4 text-gray-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { name: "Maps API", status: "online", icon: MapPin },
                { name: "Gemini", status: "active", icon: Eye },
                { name: "Traffic DB", status: "online", icon: Database },
                { name: "WhatsApp", status: "syncing", icon: Smartphone },
              ].map((tool, idx) => (
                <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-lg p-3 flex flex-col justify-center space-y-2 hover:border-white/10 transition">
                  <div className="flex items-center justify-between">
                    <tool.icon className="w-3.5 h-3.5 text-gray-500" />
                    <PulseIndicator status={tool.status as any} showLabel={false} size="xs" color="white" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{tool.name}</div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* 2. Side Timeline & Pipeline */}
      <div className="w-full xl:w-96 flex flex-col gap-6 shrink-0">
        
        {/* Pipeline Step Indicator */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
            <h3 className="font-medium text-xs tracking-widest text-white uppercase">Civic Pipeline</h3>
            <CheckCircle className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex justify-between items-center relative px-2">
            <div className="absolute left-6 right-6 top-1/2 h-[1px] bg-white/5 -translate-y-1/2 z-0" />
            {[Radio, Cpu, ShieldCheck, Network, Zap].map((Icon, idx) => {
              const isActive = activeStep >= idx;
              const isCurrent = activeStep === idx;
              return (
                <div key={idx} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700
                  ${isActive ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-black border border-white/10 text-gray-700'}
                  ${isCurrent && 'ring-4 ring-white/10'}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Execution Logs */}
        <GlassPanel className="p-0 flex-1 flex flex-col overflow-hidden">
          <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-medium text-xs tracking-widest text-white uppercase">Execution Logs</h3>
            <Cpu className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 p-6 pt-4 overflow-y-auto no-scrollbar">
            <ActivityFeed maxVisible={14} compact />
          </div>
        </GlassPanel>

      </div>
    </div>
  );
}
