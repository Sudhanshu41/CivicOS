"use client";

import { ActivityFeed } from "../motion/ActivityFeed";
import { PulseIndicator } from "../motion/PulseIndicator";
import { GlassPanel } from "../ui/GlassPanel";

/**
 * CIVICOS — CONSCIOUSNESS FEED
 * Live AI event stream for the dashboard.
 */

export function ConsciousnessFeed() {
  return (
    <GlassPanel className="p-0 flex-1 flex flex-col overflow-hidden">
      <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
        <h3 className="font-medium text-sm tracking-widest text-white uppercase">Consciousness Feed</h3>
        <div className="flex items-center gap-2">
          <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Live Stream</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pt-4 no-scrollbar">
        <ActivityFeed maxVisible={10} compact />
      </div>
    </GlassPanel>
  );
}
