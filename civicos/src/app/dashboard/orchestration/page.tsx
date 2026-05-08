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
  MessageSquare, 
  Network, 
  Radio, 
  Search, 
  ShieldCheck, 
  Smartphone, 
  Zap 
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { PulseNode } from "@/components/motion/PulseNode";
import { DataStream } from "@/components/motion/DataStream";
import { ActivityFeed } from "@/components/motion/ActivityFeed";
import { LiveStatusIndicator } from "@/components/motion/LiveStatusIndicator";
import { PulseIndicator } from "@/components/motion/PulseIndicator";
import { MetricCounter } from "@/components/motion/MetricCounter";
import { ReactiveCard } from "@/components/motion/ReactiveCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { staggerContainer, fadeSlideUp } from "@/lib/motionConfig";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AgentNode } from "@/components/agents/AgentNode";

const nodeTypes = {
  agentNode: AgentNode,
};

const initialNodes: Node[] = [
  { id: "input", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Civic Input", status: "Listening", icon: Radio, isActive: true } },
  { id: "vision", type: "agentNode", position: { x: 0, y: 120 }, data: { label: "Vision Agent", status: "Scanning Image", icon: Eye, isActive: false } },
  { id: "research", type: "agentNode", position: { x: 250, y: 120 }, data: { label: "Research Agent", status: "Querying DB", icon: Search, isActive: false } },
  { id: "validation", type: "agentNode", position: { x: 500, y: 120 }, data: { label: "Validation Agent", status: "Standby", icon: ShieldCheck, isActive: false } },
  { id: "routing", type: "agentNode", position: { x: 250, y: 240 }, data: { label: "Routing Engine", status: "Standby", icon: Network, isActive: false } },
  { id: "action", type: "agentNode", position: { x: 125, y: 360 }, data: { label: "Action Agent", status: "Standby", icon: Zap, isActive: false } },
  { id: "notify", type: "agentNode", position: { x: 375, y: 360 }, data: { label: "Notification Agent", status: "Standby", icon: MessageSquare, isActive: false } },
];

const initialEdges: Edge[] = [
  { id: "e-in-vis", source: "input", target: "vision", animated: true, style: { stroke: "#3b82f6", strokeWidth: 3, filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))" } },
  { id: "e-in-res", source: "input", target: "research", animated: true, style: { stroke: "#3b82f6", strokeWidth: 3, filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))" } },
  { id: "e-vis-val", source: "vision", target: "validation", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2, filter: "drop-shadow(0 0 5px rgba(139, 92, 246, 0.5))" } },
  { id: "e-res-val", source: "research", target: "validation", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2, filter: "drop-shadow(0 0 5px rgba(139, 92, 246, 0.5))" } },
  { id: "e-val-rout", source: "validation", target: "routing", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2, filter: "drop-shadow(0 0 5px rgba(139, 92, 246, 0.5))" } },
  { id: "e-rout-act", source: "routing", target: "action", animated: true, style: { stroke: "#ec4899", strokeWidth: 2, filter: "drop-shadow(0 0 5px rgba(236, 72, 153, 0.5))" } },
  { id: "e-rout-not", source: "routing", target: "notify", animated: true, style: { stroke: "#ec4899", strokeWidth: 2, filter: "drop-shadow(0 0 5px rgba(236, 72, 153, 0.5))" } },
];

const logs = [
  { time: "13:41:02", msg: "Incident 89X reported: Pothole at 5th Ave." },
  { time: "13:41:03", msg: "Vision Agent analyzing uploaded image..." },
  { time: "13:41:04", msg: "Confidence 98.2%. Severity: Medium." },
  { time: "13:41:04", msg: "Validation Agent cross-referencing GIS mapping." },
  { time: "13:41:05", msg: "Research Agent fetching maintenance budget." },
  { time: "13:41:06", msg: "Routing issue to Dept. of Transportation." },
  { time: "13:41:07", msg: "Action Agent generating work order #4492." },
  { time: "13:41:08", msg: "Notification Agent sent WhatsApp to Citizen." },
];

export default function OrchestrationPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeStep, setActiveStep] = useState(0);

  // Simulate Workflow Animation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update nodes based on active step
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

    // Update edges
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
            stroke: isAnimated ? "#a855f7" : "#4b5563", 
            strokeWidth: isAnimated ? 2 : 1 
          }
        };
      })
    );
  }, [activeStep, setNodes, setEdges]);

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-8rem)]">
      
      {/* Central Flow and Bottom Panels */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Holographic Neural Network Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 glass-panel rounded-2xl border border-blue-500/30 relative overflow-hidden flex flex-col"
        >
          {/* Holographic Particles Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-screen z-0"></div>
          
          <div className="p-4 border-b border-white/10 flex justify-between items-center z-10 bg-black/40">
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-lg neon-text-blue">AI Agent Orchestration</h2>
            </div>
            <div className="flex items-center gap-4">
              <MagneticButton variant="secondary" className="px-3 py-1 rounded-full text-[10px] font-mono tracking-tighter">
                OPTIMIZE MESH
              </MagneticButton>
              <PulseIndicator status="active" showLabel />
            </div>
          </div>

          <div className="flex-1 relative z-10">
            {/* We override the default React Flow background to be dark/transparent */}
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              onNodesChange={onNodesChange} 
              onEdgesChange={onEdgesChange} 
              nodeTypes={nodeTypes}
              fitView
              className="bg-transparent"
              colorMode="dark"
            >
              <Background color="#1e3a8a" gap={20} size={1} />
            </ReactFlow>
          </div>
        </motion.div>

        {/* Bottom AI Thinking & Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64 shrink-0">
          
          {/* AI Thinking Panel */}
          <ReactiveCard tiltStrength={5} hoverLift={4} glowColor="rgba(139,92,246,0.15)"
             className="glass-panel rounded-2xl p-5 border border-purple-500/20 flex flex-col overflow-hidden relative h-full"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Reasoning Engine</h3>
              </div>
              <PulseIndicator status="syncing" size="xs" showLabel={false} />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Visual Confidence</span>
                  <MetricCounter value={98.2} target={98.2} fluctuate fluctuateRange={0.5} interval={2000} suffix="%" color="emerald" decimals={1} valueClassName="text-xs" />
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "98.2%" }} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></motion.div>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 uppercase">Severity Analysis</div>
                  <div className="text-sm font-semibold text-rose-400">Medium Risk</div>
                </div>
                <PulseIndicator status="warning" size="sm" showLabel={false} />
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 uppercase">Predicted Impact</div>
                  <div className="text-sm font-semibold text-blue-400">Traffic Delay +4m</div>
                </div>
                <Car className="w-5 h-5 text-blue-400 opacity-50" />
              </div>
            </div>
          </ReactiveCard>

          {/* Tools & API Usage */}
          <ReactiveCard tiltStrength={5} hoverLift={4} glowColor="rgba(59,130,246,0.15)"
             className="glass-panel rounded-2xl p-5 border border-blue-500/20 flex flex-col overflow-hidden relative h-full"
          >
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase">Tool Integrations</h3>
              </div>
              <PulseIndicator status="active" size="xs" showLabel={false} />
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { name: "Google Maps API", status: "Active", icon: MapPin },
                { name: "Gemini Vision", status: "Processing", icon: Eye },
                { name: "City Traffic DB", status: "Connected", icon: Database },
                { name: "WhatsApp API", status: "Standby", icon: Smartphone },
              ].map((tool, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center space-x-3 hover:bg-white/10 transition group">
                  <tool.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold truncate">{tool.name}</div>
                    <PulseIndicator status={tool.status.toLowerCase() as any} showLabel={false} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </ReactiveCard>
        </div>
      </div>

      {/* Right Column: Execution Timeline & Pipeline */}
      <div className="w-full xl:w-96 flex flex-col gap-6 shrink-0">
        
        {/* Workflow Pipeline */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center space-x-2 mb-6">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-wider uppercase">Civic Pipeline</h3>
          </div>
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-800 -translate-y-1/2 z-0"></div>
            {[
              { id: 0, icon: Radio },
              { id: 1, icon: Cpu },
              { id: 2, icon: ShieldCheck },
              { id: 3, icon: Network },
              { id: 4, icon: Zap },
            ].map((step, idx) => {
              const isActive = activeStep >= step.id;
              const isCurrent = activeStep === step.id;
              return (
                <div key={idx} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                  ${isActive ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.8)]' : 'bg-[#030014] border-2 border-gray-700 text-gray-600'}
                  ${isCurrent && 'ring-4 ring-blue-500/30'}
                `}>
                  <step.icon className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Execution Timeline logs */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-0 border border-white/10 flex-1 flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Execution Logs</h3>
            </div>
            <PulseIndicator status="active" size="xs" showLabel={false} />
          </div>
          <div className="flex-1 p-3 overflow-y-auto no-scrollbar">
            <ActivityFeed maxVisible={14} compact />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
