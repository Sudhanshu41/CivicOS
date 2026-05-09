"use client";

import { Network } from "lucide-react";
import { ReactFlow, Background, Node, Edge, OnNodesChange, OnEdgesChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PulseIndicator } from "../../motion/PulseIndicator";
import { AgentNode } from "./AgentNode";

/**
 * CIVICOS — FLOW VISUALIZER
 * Visual orchestration of autonomous AI agents using ReactFlow.
 * Connected to real-time orchestration store.
 */

const nodeTypes = {
  agentNode: AgentNode,
};

interface FlowVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  status?: string;
}

export function FlowVisualizer({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onNodeClick,
  status = "idle"
}: FlowVisualizerProps) {
  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <h2 className="font-medium text-sm tracking-widest text-white uppercase">AI Orchestration</h2>
          <Network className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-center gap-4">

          <PulseIndicator 
            status={status === 'running' ? 'active' : 'offline'} 
            size="xs" 
            showLabel 
            color="yellow" 
          />
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange} 
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
          colorMode="dark"
        >
          <Background color="#111" gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
