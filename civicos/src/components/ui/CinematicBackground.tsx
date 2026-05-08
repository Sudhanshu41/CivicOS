"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  size: number;
  top: number;
  left: number;
  yOffset: number;
  duration: number;
  delay: number;
}

export default function CinematicBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generatedParticles = [...Array(15)].map(() => ({
      size: Math.random() * 4 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      yOffset: Math.random() * 50,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // @ts-ignore
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#010008]">
      
      {/* Layer 1: Cinematic Environment & Dark Gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.08] mix-blend-luminosity"></div>
        {/* Deep space radial gradient for vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(30,25,60,0.3)_0%,_rgba(1,0,8,1)_80%)]"></div>
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Layer 2: Animated Holographic Grid & Geometric Overlays */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen">
        <div className="absolute inset-0 bg-grid"></div>
        
        {/* Subtle moving light lines representing scanning */}
        <motion.div 
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-[200px] bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"
        ></motion.div>
      </div>

      {/* Layer 3: Floating Neural Data Streams & Holographic Particles */}
      <div className="absolute inset-0 opacity-40">
        <svg className="absolute inset-0 w-full h-full">
           <motion.path 
             d="M 10% -10% Q 20% 50% 10% 110%" 
             stroke="rgba(56, 189, 248, 0.15)" 
             strokeWidth="1" 
             fill="transparent" 
             animate={{ d: ["M 10% -10% Q 20% 50% 10% 110%", "M 10% -10% Q 0% 50% 10% 110%", "M 10% -10% Q 20% 50% 10% 110%"] }} 
             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
           />
           <motion.path 
             d="M 90% -10% Q 80% 50% 90% 110%" 
             stroke="rgba(168, 85, 247, 0.15)" 
             strokeWidth="1" 
             fill="transparent" 
             animate={{ d: ["M 90% -10% Q 80% 50% 90% 110%", "M 90% -10% Q 100% 50% 90% 110%", "M 90% -10% Q 80% 50% 90% 110%"] }} 
             transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} 
           />
           <motion.path 
             d="M -10% 20% Q 50% 30% 110% 20%" 
             stroke="rgba(56, 189, 248, 0.1)" 
             strokeWidth="2" 
             strokeDasharray="4 8"
             fill="transparent" 
             animate={{ strokeDashoffset: [100, 0] }} 
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
           />
        </svg>

        {/* Floating Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size + "px",
              height: p.size + "px",
              background: i % 2 === 0 ? "rgba(56, 189, 248, 0.5)" : "rgba(168, 85, 247, 0.5)",
              boxShadow: `0 0 10px ${i % 2 === 0 ? "rgba(56, 189, 248, 0.8)" : "rgba(168, 85, 247, 0.8)"}`,
              top: p.top + "%",
              left: p.left + "%",
            }}
            animate={{
              y: [0, -100 - p.yOffset],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Layer 4: Atmospheric Digital Fog & Volumetric Lighting */}
      <div className="absolute inset-0 mix-blend-screen opacity-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
        
        {/* Slow moving volumetric light ray */}
        <motion.div 
          animate={{ rotate: [15, 25, 15], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[50%] -left-[20%] w-[150%] h-[150%] origin-top-left"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)' }}
        ></motion.div>
      </div>

    </div>
  );
}
