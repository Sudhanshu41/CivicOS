"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ScrollProgress } from "../../components/ui/ScrollProgress";
import { fadeSlideUp } from "../../lib/motionConfig";
import { DashboardSidebar } from "../../components/layout/DashboardSidebar";
import { DashboardHeader } from "../../components/layout/DashboardHeader";
import { SocketProvider } from "../../providers/SocketProvider";
import { MapProvider } from "../../providers/MapProvider";

/**
 * CIVICOS — DASHBOARD LAYOUT
 * Production-grade shell for the Smart City Intelligence Platform.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <MapProvider>
      <SocketProvider>
        <div className="min-h-screen text-white flex overflow-hidden bg-black font-inter">
          <ScrollProgress />
          
          {/* 1. Sidebar Navigation */}
          <DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          {/* 2. Main Viewport Area */}
          <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
            
            {/* 3. Global Header */}
            <DashboardHeader />

            {/* 4. Page Content with View Transitions */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar scroll-smooth">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  variants={fadeSlideUp}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="w-full h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </SocketProvider>
    </MapProvider>
  );
}

