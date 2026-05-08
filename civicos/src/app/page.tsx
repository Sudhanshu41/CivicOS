"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Activity, 
  AlertTriangle, 
  BrainCircuit, 
  Car, 
  ChevronRight, 
  Cpu, 
  Eye, 
  Globe,
  Globe2, 
  Map, 
  Radio, 
  Search, 
  ShieldCheck,  
  Siren, 
  Zap 
} from "lucide-react";
import { CinematicText } from "@/components/ui/CinematicText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PulseNode } from "@/components/motion/PulseNode";
import { DataStream } from "@/components/motion/DataStream";
import { AIWavePulse } from "@/components/motion/AIWavePulse";

export default function Home() {
  return (
    <main className="min-h-screen text-white overflow-hidden relative bg-transparent">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 lg:px-20 z-10">
        {/* Hero Section Cinematic Background Additions */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/3 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Parallax Holographic Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -left-[20%] w-[800px] h-[800px] rounded-full border border-blue-500/10 pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] right-[10%] w-[1000px] h-[1000px] rounded-full border border-purple-500/10 border-dashed pointer-events-none"
        ></motion.div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full text-blue-400 text-sm font-semibold w-max border border-blue-500/30"
            >
              <PulseNode color="blue" size="w-2 h-2" /> CivicOS v2.0 Online
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <CinematicText 
                text="AI Operating System" 
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
                delay={0.2}
              />
              <CinematicText 
                text="For Smarter Communities"
                delay={0.7}
              />
            </h1>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}
              className="text-lg text-gray-400 max-w-xl leading-relaxed"
            >
              Experience the next evolution of urban infrastructure. Autonomous civic intelligence 
              monitoring, analyzing, and responding to your city's needs in real-time.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/dashboard">
                <MagneticButton className="bg-blue-600 hover:bg-blue-500 w-full text-white font-medium py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center">
                  Launch Dashboard <ChevronRight className="ml-2 w-5 h-5" />
                </MagneticButton>
              </Link>
              <Link href="/dashboard/map">
                <button className="glass-panel hover:bg-white/5 w-full text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center justify-center">
                  <Globe className="mr-2 w-5 h-5 text-purple-400" /> View Live City
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Enhanced AI Core Orb */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              {/* Massive ambient glow */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-blue-500 rounded-full blur-[80px]"
              ></motion.div>
              
              {/* Inner intelligence sphere */}
              <div className="absolute inset-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-spin-slow" style={{ animationDuration: "12s" }}>
                <div className="absolute inset-0 bg-black/40 rounded-full mix-blend-overlay"></div>
              </div>

              {/* Rotating Digital Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[3px] border-dashed border-blue-400/40 rounded-full"
              ></motion.div>
              
              <motion.div 
                animate={{ rotate: -360, scale: [1, 1.05, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-2 border-2 border-purple-500/30 rounded-full rotate-45"
              ></motion.div>

              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 border border-blue-300/20 rounded-full"
              ></motion.div>

              {/* Central Neural Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-black/80 rounded-full border border-blue-500/50 flex items-center justify-center backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <BrainCircuit className="w-12 h-12 text-blue-400" />
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 left-0 lg:-left-10 glass-panel p-4 rounded-xl flex items-center space-x-3"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="text-blue-400 w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400">System Status</div>
                <div className="font-bold text-sm">Optimal</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 right-0 lg:-right-10 glass-panel p-4 rounded-xl flex items-center space-x-3"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <ShieldCheck className="text-purple-400 w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400">City Security</div>
                <div className="font-bold text-sm">Secured</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Live Metrics Section */}
      <section className="relative z-10 py-20 px-6 lg:px-20 border-t border-white/10 bg-black/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active AI Agents", value: "1,402", icon: Cpu, color: "text-blue-400" },
              { label: "Issues Resolved", value: "84,392", icon: Zap, color: "text-purple-400" },
              { label: "Traffic Efficiency", value: "+34%", icon: Car, color: "text-emerald-400" },
              { label: "Response Time", value: "1.2m", icon: Siren, color: "text-rose-400" },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-2xl border-t border-t-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  <div className="text-2xl font-bold neon-text-blue">{metric.value}</div>
                </div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agent Workflow Section */}
      <section className="relative z-10 py-32 px-6 lg:px-20">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Neural Agent Workflow</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Multiple specialized AI agents working synchronously to perceive, analyze, and resolve civic issues autonomously.</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-blue-500/20 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
              {[
                { name: "Vision Agent", icon: Eye, desc: "Monitors CCTV & sensors" },
                { name: "Research Agent", icon: Search, desc: "Gathers historical data" },
                { name: "Validation Agent", icon: ShieldCheck, desc: "Confirms issue priority" },
                { name: "Action Agent", icon: Zap, desc: "Dispatches resources" },
                { name: "Notification Agent", icon: Radio, desc: "Alerts citizens & Gov" }
              ].map((agent, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="glass-panel p-6 rounded-xl flex flex-col items-center text-center relative group hover:bg-white/5 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-900/40 border border-blue-500/50 flex items-center justify-center mb-4 group-hover:glow-blue transition-all">
                    <agent.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{agent.name}</h3>
                  <p className="text-xs text-gray-400">{agent.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Smart City Dashboard Preview */}
      <section className="relative z-10 py-32 px-6 lg:px-20 bg-black/60">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Command Center
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Holographic city overview with real-time tracking of infrastructure, traffic flow, and autonomous analytics.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel rounded-3xl p-2 md:p-6 shadow-2xl shadow-blue-900/20"
          >
            <div className="bg-[#050510] rounded-2xl overflow-hidden border border-white/5 flex flex-col lg:flex-row h-[600px]">
              {/* Sidebar */}
              <div className="w-full lg:w-64 border-r border-white/10 p-6 flex flex-col space-y-6">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-bold mb-3">Monitoring Modules</div>
                  <div className="space-y-2">
                    <div className="bg-blue-500/10 text-blue-400 px-3 py-2 rounded-lg text-sm flex items-center"><Map className="w-4 h-4 mr-2" /> City Map</div>
                    <div className="hover:bg-white/5 text-gray-400 px-3 py-2 rounded-lg text-sm flex items-center transition-colors cursor-pointer"><Car className="w-4 h-4 mr-2" /> Traffic Flow</div>
                    <div className="hover:bg-white/5 text-gray-400 px-3 py-2 rounded-lg text-sm flex items-center transition-colors cursor-pointer"><AlertTriangle className="w-4 h-4 mr-2" /> Incidents</div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="glass-panel p-4 rounded-xl border border-rose-500/30 bg-rose-500/5">
                    <div className="text-rose-400 text-xs font-bold uppercase mb-1">Active Alert</div>
                    <div className="text-sm">Sector 4 Traffic Congestion</div>
                    <div className="text-xs text-gray-500 mt-2">AI re-routing...</div>
                  </div>
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
                <div className="absolute inset-0 bg-[#050510]/80 backdrop-blur-sm"></div>
                
                {/* Dashboard Overlay UI */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="glass-panel px-4 py-2 rounded-lg inline-block">
                      <div className="text-xs text-blue-300">Live Grid Coverage</div>
                      <div className="text-xl font-bold">98.4%</div>
                    </div>
                    <div className="glass-panel px-4 py-2 rounded-lg flex space-x-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse mt-1"></div>
                      <div>
                        <div className="text-xs text-gray-400">Main Server</div>
                        <div className="text-sm font-semibold">Online</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-32 w-1/3 glass-panel rounded-xl p-4 flex flex-col justify-end">
                      <div className="h-1/2 w-full bg-gradient-to-t from-blue-500/40 to-transparent rounded-t-md border-b-2 border-blue-400"></div>
                      <div className="text-xs text-gray-400 mt-2">Energy Usage</div>
                    </div>
                    <div className="h-32 w-2/3 glass-panel rounded-xl p-4 flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Interactive Map Visualization Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6 lg:px-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Core Infrastructure Modules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Traffic Intelligence", icon: Car, desc: "Adaptive signal control and predictive congestion rerouting." },
              { title: "AI Civic Monitoring", icon: Activity, desc: "24/7 analysis of public infrastructure wear and anomalies." },
              { title: "Predictive Analytics", icon: BrainCircuit, desc: "Forecast urban trends before they become critical issues." },
              { title: "Autonomous Resolution", icon: Zap, desc: "Self-dispatching repair drones and service requests." },
              { title: "Resource Discovery", icon: Search, desc: "Optimal allocation of government budgets and physical assets." },
              { title: "Emergency Coord", icon: Siren, desc: "Instant sync between police, fire, and medical responders." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border-t border-t-blue-500/30 group"
              >
                <feature.icon className="w-10 h-10 text-blue-400 mb-6 group-hover:text-purple-400 transition-colors" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/80 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-xl tracking-wider">CivicOS</span>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} CivicOS AI Infrastructure. All rights reserved.
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
