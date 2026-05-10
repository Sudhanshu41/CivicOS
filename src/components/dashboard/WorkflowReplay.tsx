"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, FastForward, Film } from "lucide-react";
import { GlassPanel } from "../ui/GlassPanel";
import { useOrchestrationRegistry, WorkflowState } from "../../stores/orchestrationRegistry";

interface ReplayState {
  isPlaying: boolean;
  speed: 1 | 2 | 4;
  currentStep: number;
  totalSteps: number;
}

/**
 * CIVICOS — WORKFLOW REPLAY ENGINE
 * Cinematic AI mission-style replay of orchestration sequences.
 */
export function WorkflowReplay({ workflowId }: { workflowId: string }) {
  const workflow: WorkflowState | null = useOrchestrationRegistry(
    (s) => s.workflows[workflowId] || null
  );

  const nodeHistory = workflow ? Object.values(workflow.nodes) : [];
  const logHistory  = workflow?.logs || [];
  const totalSteps  = nodeHistory.length + logHistory.length;

  const [replay, setReplay] = useState<ReplayState>({
    isPlaying: false,
    speed: 1,
    currentStep: 0,
    totalSteps,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tick = useCallback(() => {
    setReplay(prev => {
      if (prev.currentStep >= prev.totalSteps - 1) {
        return { ...prev, isPlaying: false };
      }
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }, []);

  useEffect(() => {
    if (replay.isPlaying) {
      intervalRef.current = setInterval(tick, 800 / replay.speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [replay.isPlaying, replay.speed, tick]);

  // Visible events up to currentStep
  const visibleNodes = nodeHistory.slice(0, Math.min(replay.currentStep, nodeHistory.length));
  const visibleLogs  = logHistory.slice(0, Math.max(0, replay.currentStep - nodeHistory.length));

  const togglePlay = () => setReplay(p => ({ ...p, isPlaying: !p.isPlaying }));
  const reset      = () => setReplay(p => ({ ...p, currentStep: 0, isPlaying: false }));
  const skipEnd    = () => setReplay(p => ({ ...p, currentStep: totalSteps, isPlaying: false }));
  const cycleSpeed = () => setReplay(p => ({ ...p, speed: p.speed === 1 ? 2 : p.speed === 2 ? 4 : 1 }));

  const progress = totalSteps > 0 ? (replay.currentStep / totalSteps) * 100 : 0;

  if (!workflow) {
    return (
      <GlassPanel className="p-6 flex items-center justify-center">
        <p className="text-[11px] font-mono text-gray-600 uppercase tracking-widest italic">
          No workflow selected for replay
        </p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-6 flex flex-col space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <Film className="w-4 h-4 text-[#FFD500]" />
          <h3 className="text-xs font-medium text-white uppercase tracking-widest">Replay Engine</h3>
          <span className="text-[9px] font-mono text-gray-600 border border-white/10 px-2 py-0.5 rounded">
            {workflowId.slice(0, 8)}...
          </span>
        </div>
        <span className="text-[9px] font-mono text-gray-500">
          {replay.currentStep}/{totalSteps} events
        </span>
      </div>

      {/* Progress scrubber */}
      <div className="space-y-2">
        <div
          className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct  = (e.clientX - rect.left) / rect.width;
            setReplay(p => ({ ...p, currentStep: Math.round(pct * totalSteps), isPlaying: false }));
          }}
        >
          <motion.div
            className="h-full bg-[#FFD500] shadow-[0_0_8px_rgba(255,213,0,0.4)] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={reset} className="text-gray-500 hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFD500] text-black hover:bg-white transition-colors"
            >
              {replay.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button onClick={skipEnd} className="text-gray-500 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={cycleSpeed}
            className="flex items-center space-x-1.5 text-[9px] font-mono text-gray-500 hover:text-white transition-colors border border-white/10 px-2 py-0.5 rounded"
          >
            <FastForward className="w-3 h-3" />
            <span>{replay.speed}×</span>
          </button>
        </div>
      </div>

      {/* Node Events */}
      {visibleNodes.length > 0 && (
        <div>
          <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-2">Agent Execution Trace</div>
          <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
            <AnimatePresence mode="popLayout">
              {visibleNodes.map((node, i) => (
                <motion.div
                  key={`${node.node_id}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      node.status === "COMPLETED" ? "bg-emerald-400" :
                      node.status === "FAILED"    ? "bg-rose-500" :
                      node.status === "ACTIVE"    ? "bg-[#FFD500] animate-pulse" : "bg-gray-600"
                    }`} />
                    <span className="text-[10px] font-mono text-gray-300">{node.label || node.node_id}</span>
                  </div>
                  <span className={`text-[8px] font-mono uppercase tracking-widest ${
                    node.status === "COMPLETED" ? "text-emerald-400" :
                    node.status === "FAILED"    ? "text-rose-400" : "text-gray-500"
                  }`}>{node.status}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Log Replay */}
      {visibleLogs.length > 0 && (
        <div>
          <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-2">Reasoning Replay</div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
            <AnimatePresence mode="popLayout">
              {visibleLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-[10px] font-mono p-2 rounded border ${
                    log.level === "error"   ? "border-rose-500/20 text-rose-300 bg-rose-500/5" :
                    log.level === "ai"      ? "border-[#FFD500]/20 text-yellow-200 bg-[#FFD500]/5" :
                    log.level === "warning" ? "border-amber-500/20 text-amber-300 bg-amber-500/5" :
                    "border-white/5 text-gray-400 bg-white/[0.02]"
                  }`}
                >
                  {log.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
