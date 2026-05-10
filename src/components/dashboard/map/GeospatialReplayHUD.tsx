"use client";

import { motion } from "framer-motion";
import { 
  Play, Pause, RotateCcw, FastForward, 
  Clock, Calendar, History
} from "lucide-react";
import { useReplayStore } from "../../../stores/replayStore";
import { GlassPanel } from "../../ui/GlassPanel";
import { useEffect, useRef } from "react";

/**
 * CIVICOS — GEOSPATIAL REPLAY HUD
 * Cinematic controls for city-scale historical playback and simulation.
 * Integrated with the global ReplayStore.
 */
export function GeospatialReplayHUD() {
  const { 
    status, currentTime, playbackRate, 
    setStatus, setCurrentTime, setPlaybackRate, reset,
    startTime 
  } = useReplayStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => {
        setCurrentTime(Math.min(100, currentTime + (0.1 * playbackRate)));
        if (currentTime >= 100) setStatus("paused");
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, currentTime, playbackRate, setCurrentTime, setStatus]);

  const togglePlayback = () => {
    if (status === "live") {
      setStatus("playing");
      setCurrentTime(0);
    } else if (status === "playing") {
      setStatus("paused");
    } else {
      setStatus("playing");
    }
  };

  const cycleRate = () => {
    const rates: (1|2|4|8)[] = [1, 2, 4, 8];
    const next = rates[(rates.indexOf(playbackRate as typeof rates[number]) + 1) % rates.length];
    setPlaybackRate(next);
  };

  // Calculate display time based on offset from startTime
  const displayDate = new Date(new Date(startTime).getTime() + (currentTime / 100) * 24 * 60 * 60 * 1000);

  return (
    <GlassPanel className="p-4 flex flex-col space-y-4">
      {/* Header & Status */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <History className={`w-3.5 h-3.5 ${status === "live" ? "text-gray-500" : "text-[#FFD500]"}`} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Simulation Engine
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === "live" ? "bg-emerald-400" : "bg-[#FFD500] animate-pulse"}`} />
          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
            {status}
          </span>
        </div>
      </div>

      {/* Time Display */}
      <div className="flex items-center justify-between bg-black/40 rounded-lg px-4 py-3 border border-white/5">
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-gray-600" />
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-gray-600 uppercase">Archive Date</span>
            <span className="text-xs font-mono text-white">
              {displayDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-right">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-gray-600 uppercase">Sim Time</span>
            <span className="text-xs font-mono text-[#FFD500]">
              {displayDate.toLocaleTimeString([], { hour12: false })}
            </span>
          </div>
          <Clock className="w-4 h-4 text-[#FFD500]" />
        </div>
      </div>

      {/* Scrubber */}
      <div className="relative h-6 flex items-center group">
        <div 
          className="absolute inset-x-0 h-1 bg-white/5 rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            setCurrentTime(pct);
            if (status === "live") setStatus("paused");
          }}
        >
          <motion.div 
            className="h-full bg-[#FFD500] shadow-[0_0_10px_rgba(255,213,0,0.3)]"
            animate={{ width: `${currentTime}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
        </div>
        <motion.div 
          className="absolute w-3 h-3 bg-white rounded-full border-2 border-[#FFD500] shadow-lg pointer-events-none"
          animate={{ left: `calc(${currentTime}% - 6px)` }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlayback}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              status === "playing" 
                ? "bg-white/10 text-white border border-white/10" 
                : "bg-[#FFD500] text-black hover:bg-white"
            }`}
          >
            {status === "playing" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <button 
            onClick={() => { reset(); }}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            title="Return to Live"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={cycleRate}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-all"
          >
            <FastForward className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] font-mono text-white">{playbackRate}×</span>
          </button>
          
          <button 
            onClick={() => setStatus("live")}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
              status === "live" 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-white/5 text-gray-500 border border-white/5 hover:border-white/20"
            }`}
          >
            Go Live
          </button>
        </div>
      </div>
    </GlassPanel>
  );
}
