"use client";

import { Search, Bell, User, Activity } from "lucide-react";
import { PulseIndicator } from "../motion/PulseIndicator";
import { useSocket } from "../../providers/SocketProvider";
import { useWorkflowStore } from "../../stores/workflowStore";

/**
 * CIVICOS — DASHBOARD HEADER
 * High-end cinematic top navigation bar.
 * Updated to reflect real-time system health and connectivity.
 */

export function DashboardHeader() {
  const socket = useSocket();
  const status = socket?.status || "DISCONNECTED";
  const health = useWorkflowStore(state => state.health);

  const getStatusColor = () => {
    switch (status) {
      case "CONNECTED": return "yellow";
      case "CONNECTING":
      case "RECONNECTING": return "yellow";
      case "DEGRADED": return "red";
      default: return "gray";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "CONNECTED": return "Network Optimized";
      case "CONNECTING": return "Initializing Sync";
      case "RECONNECTING": return "Restoring Link";
      case "DEGRADED": return "Latency Warning";
      default: return "Link Offline";
    }
  };

  return (
    <header className="h-16 shrink-0 z-20 flex items-center justify-between px-8 bg-black/80 backdrop-blur-2xl border-b border-white/5">
      
      {/* Search Bar */}
      <div className="flex items-center">
        <div className="hidden md:flex items-center rounded-lg px-3 py-1.5 w-64 bg-white/[0.02] border border-white/5 transition-all focus-within:border-white/10">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-gray-600 uppercase tracking-widest"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        
        {/* AI Health */}
        <div className="hidden xl:flex items-center space-x-2 text-[9px] font-mono text-gray-500 mr-4">
          <Activity className="w-3 h-3" />
          <span className="uppercase tracking-tighter">AI Provider:</span>
          <span className={health.aiProvider === 'online' ? "text-emerald-500" : "text-rose-500"}>
            {health.aiProvider.toUpperCase()}
          </span>
        </div>

        {/* WebSocket Status */}
        <div className="hidden lg:flex items-center space-x-2 text-[10px] font-mono text-gray-400 px-3 py-1 rounded-full border border-white/5 bg-white/[0.01]">
          <PulseIndicator 
            status={status === "CONNECTED" ? "active" : "offline"} 
            size="xs" 
            color={getStatusColor() as any} 
            showLabel={false} 
          />
          <span className="tracking-[0.2em] uppercase">{getStatusLabel()}</span>
        </div>
        
        <button className="relative text-gray-500 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#FFD500] rounded-full shadow-[0_0_5px_#FFD500]" />
        </button>
        
        <div className="w-px h-4 bg-white/10" />
        
        <button className="flex items-center space-x-3 group">
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-white group-hover:text-[#FFD500] transition-colors uppercase tracking-widest">Vance</div>
            <div className="text-[9px] text-gray-500 font-mono uppercase">Admin</div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.02] border border-white/10 group-hover:border-white/20 transition-all">
            <User className="w-4 h-4 text-gray-400" />
          </div>
        </button>
      </div>
    </header>
  );
}
