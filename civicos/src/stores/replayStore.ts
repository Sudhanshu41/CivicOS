"use client";

import { create } from 'zustand';

// ==============================================================
// CIVICOS — REPLAY & SIMULATION STORE
// Manages global playback state for city-scale historical analysis.
// ==============================================================

export type ReplayStatus = "live" | "paused" | "playing" | "scrubbing";

interface ReplayState {
  status: ReplayStatus;
  playbackRate: 1 | 2 | 4 | 8;
  currentTime: number; // 0 to 100 (percentage of historical window)
  startTime: string;   // ISO string of start of window
  endTime: string;     // ISO string of end of window
  
  // Actions
  setStatus: (status: ReplayStatus) => void;
  setPlaybackRate: (rate: 1 | 2 | 4 | 8) => void;
  setCurrentTime: (time: number) => void;
  setWindow: (start: string, end: string) => void;
  reset: () => void;
}

export const useReplayStore = create<ReplayState>((set) => ({
  status: "live",
  playbackRate: 1,
  currentTime: 100,
  startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24h window default
  endTime: new Date().toISOString(),

  setStatus: (status) => set({ status }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setWindow: (startTime, endTime) => set({ startTime, endTime }),
  reset: () => set({ 
    status: "live", 
    currentTime: 100, 
    playbackRate: 1,
    endTime: new Date().toISOString() 
  }),
}));
