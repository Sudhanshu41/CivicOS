"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BrainCircuit, 
  Car, 
  Cpu, 
  Eye, 
  Radio, 
  Search, 
  ShieldCheck,  
  Siren, 
  Zap 
} from "lucide-react";

import { Hero } from "../components/landing/Hero";
import { PulseIndicator } from "../components/motion/PulseIndicator";
import { MetricCounter } from "../components/motion/MetricCounter";
import { GlassPanel } from "../components/ui/GlassPanel";

/**
 * CIVICOS — LANDING PAGE
 * Refactored for production-grade modularity and cleaner architecture.
 */
export default function Home() {
  return (
    <main className="min-h-screen text-white overflow-hidden relative bg-black font-sans selection:bg-[#FFD500] selection:text-black">
      
      {/* Structural Background Primitives */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5 mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-white/[0.02] rounded-full blur-[160px]" />
      </div>

      {/* 1. Hero Experience */}
      <Hero />

      {/* 2. Global Performance Stats */}
      <section className="relative z-10 py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-32">
            {[
              { label: "AI Nodes", value: 1402, icon: Cpu },
              { label: "Resolved", value: 84392, suffix: "+", icon: Zap },
              { label: "Efficiency", value: 34, suffix: "%", icon: Car },
              { label: "Response", value: 1.2, suffix: "M", icon: Siren },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col space-y-6">
                <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 flex items-center gap-3">
                  <stat.icon className="w-3.5 h-3.5" /> {stat.label}
                </div>
                <MetricCounter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                  color="white"
                  valueClassName="text-5xl font-light tracking-tighter"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Neural Engine Framework */}
      <section className="relative z-10 py-48 px-8 lg:px-24">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-12">
            <div className="max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8 text-white">Neural Engine</h2>
              <p className="text-gray-500 text-xl font-medium uppercase tracking-tight leading-relaxed max-w-xl">
                A synchronized mesh of specialized AI agents working in tandem to perceive, 
                reason, and act across city infrastructure.
              </p>
            </div>
            <div className="text-right">
              <PulseIndicator status="active" size="sm" color="yellow" label="System Sync Active" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            {[
              { name: "Vision", icon: Eye, desc: "Multimodal sensor monitoring" },
              { name: "Research", icon: Search, desc: "Deep historical indexing" },
              { name: "Validation", icon: ShieldCheck, desc: "Confidence scoring & logic" },
              { name: "Action", icon: Zap, desc: "Autonomous resource dispatch" },
              { name: "Notify", icon: Radio, desc: "Gov & Citizen communications" }
            ].map((agent, idx) => (
              <div key={idx} className="bg-black p-12 flex flex-col items-center text-center group hover:bg-white/[0.02] transition-all duration-500">
                <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center mb-10 group-hover:border-white transition-all duration-500">
                  <agent.icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="font-bold text-[11px] uppercase tracking-[0.3em] mb-4 text-white">{agent.name}</h3>
                <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-[0.2em] font-bold">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OS Preview Display */}
      <section className="relative z-10 py-48 px-8 lg:px-24 border-t border-white/5 bg-white/[0.01]">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-32">
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8 text-white">Operating System</h2>
            <p className="text-gray-500 text-xl font-medium uppercase tracking-[0.2em]">
              The core interface for high-frequency city management.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="p-1 bg-white/5 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            <div className="bg-black rounded-2xl overflow-hidden flex flex-col lg:flex-row h-[750px] border border-white/10 shadow-2xl relative">
              <div className="w-72 border-r border-white/5 p-10 flex flex-col space-y-16 bg-white/[0.01]">
                <div className="flex items-center space-x-4">
                  <div className="w-2.5 h-2.5 bg-[#FFD500] rounded-full shadow-[0_0_10px_#FFD500]" />
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white">Command</span>
                </div>
                <div className="space-y-8">
                  {['Traffic', 'Emergency', 'Analytics', 'Infra'].map(item => (
                    <div key={item} className="text-[10px] font-bold text-gray-600 tracking-[0.4em] hover:text-white cursor-pointer transition-colors uppercase">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-auto p-5 border border-white/5 rounded-xl bg-white/[0.01]">
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Network Load</div>
                  <div className="h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 bg-white/[0.02] p-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-overlay" />
                <div className="grid grid-cols-2 gap-10 relative z-10">
                  <GlassPanel className="p-10 h-72 flex flex-col justify-between" hover={false}>
                    <div className="flex justify-between items-start">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.3em]">Live Telemetry</div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                    </div>
                    <div className="text-5xl font-light tracking-tighter text-white">98.4%</div>
                  </GlassPanel>
                  <GlassPanel className="p-10 h-72 flex items-center justify-center" hover={false}>
                    <div className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.5em] text-center">Grid Analysis Active</div>
                  </GlassPanel>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Production Footer */}
      <footer className="relative z-10 py-48 px-8 lg:px-24 border-t border-white/5 bg-black">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center mb-56">
            <h2 className="text-6xl lg:text-9xl font-bold tracking-tighter mb-16 text-white">Evolve Your City</h2>
            <Link href="/dashboard">
              <button className="bg-white text-black font-bold py-7 px-20 rounded-lg text-[13px] uppercase tracking-[0.4em] hover:bg-[#FFD500] transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.15)] group">
                Initialize System
              </button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-16 border-t border-white/5 pt-16">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-4">
                <BrainCircuit className="w-8 h-8 text-white" />
                <span className="font-bold text-xl tracking-[0.3em] uppercase">CivicOS</span>
              </div>
              <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">Architecting Tomorrow's Cities</p>
            </div>
            
            <div className="flex flex-wrap gap-x-16 gap-y-8 text-[11px] font-bold uppercase tracking-[0.4em] text-gray-500">
              {['Platform', 'Network', 'Security', 'Docs'].map(link => (
                <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
              ))}
            </div>

            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} CivicOS Systems Ltd.
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
