"use client";

import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  Menu, 
  LayoutDashboard, 
  Network, 
  Car, 
  AlertTriangle, 
  BarChart2, 
  Map, 
  Activity, 
  Settings, 
  ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PulseIndicator } from "../motion/PulseIndicator";

/**
 * CIVICOS — DASHBOARD SIDEBAR
 * Core navigation system for the AI Operating System.
 */

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

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export function DashboardSidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ width: 280, x: -20, opacity: 0 }}
      animate={{ width: isOpen ? 280 : 80, x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="z-20 border-r border-white/5 flex flex-col relative h-screen bg-black overflow-hidden"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className={`flex items-center space-x-3 ${!isOpen && "justify-center w-full"}`}>
          <BrainCircuit className="w-6 h-6 text-[#FFD500] shrink-0" />
          {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
              <span className="font-bold text-lg tracking-wider text-white">CivicOS</span>
              <span className="text-[9px] font-mono text-gray-500 tracking-[0.2em] uppercase">System v2.0</span>
            </motion.div>
          )}
        </Link>
        {isOpen && (
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition p-1">
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="mx-6 border-b border-white/5 mb-2" />

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="mx-auto mt-6 text-gray-500 hover:text-white transition p-2">
          <Menu className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-0.5 no-scrollbar">
        {sidebarItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link key={idx} href={item.href}>
              <motion.div 
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? "text-[#FFD500] bg-white/[0.03]" 
                  : "text-gray-500 hover:text-white hover:bg-white/[0.01]"
              }`}
              >
                <item.icon className={`w-[16px] h-[16px] shrink-0 ${
                  isActive ? "text-[#FFD500]" : "group-hover:text-white"
                } ${!isOpen ? "mx-auto" : ""}`} />
                {isOpen && (
                  <span className={`ml-3 text-sm tracking-wide ${
                    isActive ? "text-white font-medium" : "text-gray-400 group-hover:text-white"
                  }`}>{item.label}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-6 pt-4 border-t border-white/5">
        <div className={`flex items-center ${isOpen ? "space-x-3" : "justify-center"}`}>
          <PulseIndicator status="active" size="xs" color="yellow" showLabel={false} />
          {isOpen && <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">System Active</div>}
        </div>
      </div>
    </motion.aside>
  );
}
