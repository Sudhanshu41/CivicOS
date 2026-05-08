"use client";

import { motion } from "framer-motion";

export function CinematicText({ 
  text, 
  className = "", 
  delay = 0 
}: { 
  text: string, 
  className?: string,
  delay?: number 
}) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span key={idx} variants={item} className="mr-[0.25em] inline-block">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
