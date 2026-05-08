"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  BarChart2, 
  Bell, 
  BrainCircuit, 
  Car, 
  LayoutDashboard, 
  Map, 
  Menu, 
  Network, 
  Search, 
  Settings, 
  ShieldAlert, 
  User 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { PulseIndicator } from "@/components/motion/PulseIndicator";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { fadeSlideUp } from "@/lib/motionConfig";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Network, label: "AI Agents", href: "/dashboard/orchestration" },
  { icon: Car, label: "Traffic Intelligence", href: "/dashboard/traffic" },
  { icon: AlertTriangle, label: "Civic Issues", href: "/dashboard/issues" },
  { icon: ShieldAlert, label: "Emergency Response", href: "/dashboard/emergency" },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Map, label: "Live City Map", href: "/dashboard/map" },
  { icon: Activity, label: "Infrastructure", href: "/dashboard/infrastructure" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-white flex overflow-hidden bg-transparent">
      <ScrollProgress />
      
      {/* Sidebar Navigation - Deep Floating Glass */}
      <motion.aside
        initial={{ width: 280, x: -20, opacity: 0 }}
        animate={{ width: sidebarOpen ? 280 : 80, x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="z-20 border-r border-white/[0.06] flex flex-col relative h-screen rounded-none overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(6,7,18,0.97) 0%, rgba(3,4,12,0.99) 100%)",
          backdropFilter: "blur(48px) saturate(180%)",
          WebkitBackdropFilter: "blur(48px) saturate(180%)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.6), inset -1px 0 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className={`flex items-center space-x-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md animate-pulse" />
              <BrainCircuit className="w-8 h-8 text-blue-400 relative z-10 shrink-0" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <span className="font-bold text-lg tracking-wider neon-text-blue">CivicOS</span>
                <span className="text-[9px] font-mono text-gray-500 tracking-[0.2em] uppercase">Neural OS v2.0</span>
              </motion.div>
            )}
          </Link>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-gray-300 transition p-1 rounded-lg hover:bg-white/5">
              <Menu className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="mx-4 divider-glow-blue opacity-40" />

        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="mx-auto mt-6 text-gray-500 hover:text-white transition p-2 rounded-lg hover:bg-white/5">
            <Menu className="w-4 h-4" />
          </button>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 no-scrollbar">
          {sidebarItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link key={idx} href={item.href}>
                <motion.div 
                  whileHover={{ x: 4 }}
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                  isActive 
                    ? "text-white" 
                    : "text-gray-500 hover:text-white"
                }`}
                  style={isActive ? {
                    background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.08))",
                    border: "1px solid rgba(59,130,246,0.25)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
                  } : {}}
                >
                  {/* Hover glow */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  )}
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                      style={{ background: "linear-gradient(180deg, #60a5fa, #a78bfa)", boxShadow: "0 0 12px rgba(96,165,250,0.8)" }}
                    />
                  )}
                  <item.icon className={`w-[18px] h-[18px] shrink-0 transition-all duration-300 ${
                    isActive ? "text-blue-400" : "group-hover:text-blue-400"
                  } ${!sidebarOpen ? "mx-auto" : ""}`} />
                  {sidebarOpen && (
                    <span className={`ml-3 text-sm font-medium tracking-wide group-hover:translate-x-0.5 transition-transform duration-300 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    }`}>{item.label}</span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Status */}
        <div className="p-4 pb-6">
          <div className="mx-1 divider-glow-blue opacity-30 mb-4" />
          {sidebarOpen ? (
            <div className="rounded-xl p-3 relative overflow-hidden border-sweep"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.04))",
                border: "1px solid rgba(16,185,129,0.2)",
                boxShadow: "0 0 20px rgba(16,185,129,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <PulseIndicator status="active" size="xs" color="emerald" showLabel labelClassName="text-[10px] font-bold text-emerald-400 uppercase tracking-widest" />
              </div>
              <div className="text-[9px] text-gray-500 font-mono">NODE: CV-88X-OMNI // UPTIME 99.98%</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <PulseIndicator status="active" size="xs" color="emerald" showLabel={false} />
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
        {/* Top Navigation - Floating Cinematic Header */}
        <header className="h-18 shrink-0 z-20 flex items-center justify-between px-8 py-4 relative"
          style={{
            background: "linear-gradient(180deg, rgba(4,5,14,0.95) 0%, rgba(2,3,10,0.85) 100%)",
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Header top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="flex items-center">
            <div className="hidden md:flex items-center rounded-full px-4 py-2 w-80 transition-all"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <Search className="w-4 h-4 text-gray-600 mr-2" />
              <input 
                type="text" 
                placeholder="Search civic entities, agents..." 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-blue-400 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.25)",
                boxShadow: "0 0 16px rgba(59,130,246,0.1)",
              }}
            >
              <PulseIndicator status="active" size="xs" color="blue" showLabel labelClassName="text-blue-400" />
              <span className="ml-1 tracking-widest">AI NETWORK</span>
            </div>
            
            <button className="relative text-gray-500 hover:text-white transition">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" style={{ boxShadow: "0 0 6px rgba(244,63,94,0.8)" }} />
            </button>
            
            <div className="w-px h-5 bg-white/[0.08]" />
            
            <button className="flex items-center space-x-3 group">
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition">Cmdr. Vance</div>
                <div className="text-[10px] text-blue-500 font-mono uppercase tracking-wider">Level 5 Clearance</div>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                  border: "1px solid rgba(59,130,246,0.4)",
                  boxShadow: "0 0 16px rgba(59,130,246,0.2)",
                }}
              >
                <User className="w-4 h-4 text-blue-400" />
              </div>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar scroll-smooth">
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
  );
}
