"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
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
  Zap,
  Activity,
  Clock
} from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNodesState, useEdgesState, Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FlowVisualizer } from "../../../components/dashboard/orchestration/FlowVisualizer";
import { ActivityFeed } from "../../../components/motion/ActivityFeed";
import { PulseIndicator } from "../../../components/motion/PulseIndicator";
import { MetricCounter } from "../../../components/motion/MetricCounter";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { useOrchestration } from "../../../hooks/useOrchestration";
import { useOrchestrationRegistry } from "../../../stores/orchestrationRegistry";
import { ReasoningEngine } from "../../../components/dashboard/orchestration/ReasoningEngine";
import { TraceInspector } from "../../../components/dashboard/orchestration/TraceInspector";
import { AgentNode } from "../../../components/dashboard/orchestration/AgentNode";

/**
 * CIVICOS — AI ORCHESTRATION PAGE
 * Fully event-driven production interface.
 */

const nodeTypes = {
  agentNode: AgentNode,
};

const initialNodes: Node[] = [
  { id: "input", type: "agentNode", position: { x: 250, y: 0 }, data: { label: "Civic Input", status: "QUEUED", icon: Radio, isActive: false } },
  { id: "vision", type: "agentNode", position: { x: 0, y: 120 }, data: { label: "Vision Agent", status: "QUEUED", icon: Eye, isActive: false } },
  { id: "research", type: "agentNode", position: { x: 250, y: 120 }, data: { label: "Research Agent", status: "QUEUED", icon: Search, isActive: false } },
  { id: "validation", type: "agentNode", position: { x: 500, y: 120 }, data: { label: "Validation Agent", status: "QUEUED", icon: ShieldCheck, isActive: false } },
  { id: "routing", type: "agentNode", position: { x: 250, y: 240 }, data: { label: "Routing Engine", status: "QUEUED", icon: Network, isActive: false } },
  { id: "action", type: "agentNode", position: { x: 125, y: 360 }, data: { label: "Action Agent", status: "QUEUED", icon: Zap, isActive: false } },
  { id: "notify", type: "agentNode", position: { x: 375, y: 360 }, data: { label: "Notification Agent", status: "QUEUED", icon: Smartphone, isActive: false } },
];

const initialEdges: Edge[] = [
  { id: "e-in-vis", source: "input", target: "vision", animated: false },
  { id: "e-in-res", source: "input", target: "research", animated: false },
  { id: "e-vis-val", source: "vision", target: "validation", animated: false },
  { id: "e-res-val", source: "research", target: "validation", animated: false },
  { id: "e-val-rout", source: "validation", target: "routing", animated: false },
  { id: "e-rout-act", source: "routing", target: "action", animated: false },
  { id: "e-rout-not", source: "routing", target: "notify", animated: false },
];

// Stable empty fallbacks — defined outside component to maintain referential equality
const EMPTY_NODES: Record<string, any> = {};
const EMPTY_TELEMETRY = { totalLatency: 0, tokensUsed: 0, retries: 0 };

export default function OrchestrationPage() {
  useOrchestration(); // global event listener — no args needed anymore
  const activeId = useOrchestrationRegistry(s => s.activeWorkflowId);
  const workflows = useOrchestrationRegistry(s => s.workflows);
  const activeWf = activeId ? workflows[activeId] : null;
  // Stabilize liveNodes reference — avoid new {} on every render
  const liveNodes = activeWf?.nodes ?? EMPTY_NODES;
  const status = activeWf?.status ?? "idle";
  const telemetry = activeWf?.telemetry ?? EMPTY_TELEMETRY;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Sync ReactFlow State with Realtime Store
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => {
        const liveNode = liveNodes[node.id];
        const status = liveNode?.status || "QUEUED";
        const isActive = status === "ACTIVE";
        
        return { 
          ...node, 
          data: { 
            ...node.data, 
            isActive, 
            status,
            label: liveNode?.label || node.data.label
          } 
        };
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        const sourceNode = liveNodes[edge.source];
        const targetNode = liveNodes[edge.target];
        
        const isAnimated = sourceNode?.status === "COMPLETED" && targetNode?.status === "ACTIVE";
        const isCompleted = sourceNode?.status === "COMPLETED" && targetNode?.status === "COMPLETED";

        return {
          ...edge,
          animated: isAnimated,
          style: { 
            stroke: isAnimated ? "#ffffff" : (isCompleted ? "#FFD500" : "#222"), 
            strokeWidth: isAnimated || isCompleted ? 2 : 1,
            opacity: isAnimated || isCompleted ? 1 : 0.2
          }
        };
      })
    );
  }, [liveNodes, setNodes, setEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const selectedNode = selectedNodeId ? liveNodes[selectedNodeId] || {
    node_id: selectedNodeId,
    status: "QUEUED",
    label: initialNodes.find(n => n.id === selectedNodeId)?.data.label
  } : null;

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-10rem)] relative">
      
      {/* 1. Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* ReactFlow Visualizer */}
        <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden">
          <FlowVisualizer 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange} 
            onNodeClick={onNodeClick}
          />
          
          {/* Overlay Status */}
          <div className="absolute top-6 left-6 pointer-events-none">
            <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <PulseIndicator status={status === 'running' ? 'active' : 'offline'} size="xs" color="yellow" showLabel={false} />
              <span className="text-[10px] font-mono text-white uppercase tracking-[0.3em]">
                Orchestration: {status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Intelligence & Tooling Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64 shrink-0">
          <GlassPanel className="p-6 flex flex-col">
            <ReasoningEngine />
          </GlassPanel>

          <GlassPanel className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="font-medium text-xs tracking-widest text-white uppercase">Operational Telemetry</h3>
              <Activity className="w-4 h-4 text-gray-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { name: "Execution Time", value: telemetry.totalLatency || 0, suffix: "ms", icon: Clock },
                { name: "Tokens Consumed", value: telemetry.tokensUsed || 0, suffix: "", icon: Cpu },
                { name: "Retry Count", value: telemetry.retries || 0, suffix: "", icon: Zap },
                { name: "Status", value: status === 'completed' ? 100 : (status === 'running' ? 45 : 0), suffix: "%", icon: CheckCircle },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-lg p-3 flex flex-col justify-center space-y-2 hover:border-white/10 transition">
                  <div className="flex items-center justify-between">
                    <item.icon className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">{item.name}</div>
                  <div className="text-sm font-mono text-white">
                    {item.value}{item.suffix}
                  </div>
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
            {[Radio, Eye, ShieldCheck, Network, Zap].map((Icon, idx) => {
              // Derive pipeline state from node statuses
              const nodeIds = ["input", "vision", "validation", "routing", "action"];
              const nodeStatus = liveNodes[nodeIds[idx]]?.status;
              const isActive = nodeStatus === "ACTIVE";
              const isCompleted = nodeStatus === "COMPLETED";

              return (
                <div key={idx} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700
                  ${isCompleted ? 'bg-[#FFD500] text-black shadow-[0_0_15px_rgba(255,213,0,0.3)]' : (isActive ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-black border border-white/10 text-gray-700')}
                  ${isActive && 'ring-4 ring-white/10'}
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
            <ActivityFeed maxVisible={14} compact live />
          </div>
        </GlassPanel>

      </div>

      {/* Trace Inspector Sidebar */}
      <AnimatePresence>
        {selectedNodeId && (
          <TraceInspector 
            node={selectedNode as any} 
            onClose={() => setSelectedNodeId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
