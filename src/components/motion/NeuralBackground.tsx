"use client";

import { motion } from "framer-motion";

export function NeuralBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 mix-blend-screen z-0">
      <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="blueNode" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="purpleNode" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Static base connection lines */}
        <path d="M 100 120 L 300 90 L 400 240 L 600 150 L 800 180 L 900 60" stroke="rgba(139,92,246,0.18)" strokeWidth="1" fill="none" />
        <path d="M 200 480 L 400 360 L 500 510 L 700 420 L 850 540" stroke="rgba(59,130,246,0.18)" strokeWidth="1" fill="none" />
        <path d="M 400 240 L 400 360" stroke="rgba(139,92,246,0.15)" strokeWidth="1" fill="none" />
        <path d="M 600 150 L 700 420" stroke="rgba(59,130,246,0.15)" strokeWidth="1" fill="none" />
        <path d="M 800 180 L 850 540" stroke="rgba(139,92,246,0.12)" strokeWidth="1" fill="none" />

        {/* Animated data packet - line 1 */}
        <motion.path
          d="M 100 120 L 300 90 L 400 240 L 600 150 L 800 180 L 900 60"
          stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="12 180"
          animate={{ strokeDashoffset: [192, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        {/* Animated data packet - line 2 */}
        <motion.path
          d="M 200 480 L 400 360 L 500 510 L 700 420 L 850 540"
          stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="12 160"
          animate={{ strokeDashoffset: [172, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* Pulsing Nodes */}
        {[
          { cx: 100, cy: 120, grad: "blueNode", delay: 0 },
          { cx: 300, cy: 90, grad: "purpleNode", delay: 1 },
          { cx: 400, cy: 240, grad: "blueNode", delay: 2 },
          { cx: 600, cy: 150, grad: "purpleNode", delay: 0.5 },
          { cx: 800, cy: 180, grad: "blueNode", delay: 1.5 },
          { cx: 400, cy: 360, grad: "purpleNode", delay: 0 },
          { cx: 500, cy: 510, grad: "blueNode", delay: 1 },
          { cx: 700, cy: 420, grad: "purpleNode", delay: 2 },
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={5}
            fill={`url(#${node.grad})`}
            animate={{ r: [2, 7, 2], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}
