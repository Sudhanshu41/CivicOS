import { Variants } from "framer-motion";

/**
 * CIVICOS — MOTION ARCHITECTURE
 * Centralized Framer Motion configurations for consistent cinematic experiences.
 */

export const transitionSmooth = {
  type: "spring" as const,
  stiffness: 70,
  damping: 20,
  mass: 1,
};

export const transitionCinematic = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

// --- Container Variants ---
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// --- Base Animation Variants ---
export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transitionCinematic,
  },
};

export const fadeSlideRight: Variants = {
  hidden: { opacity: 0, x: -15, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: transitionCinematic,
  },
};

export const fadeSlideLeft: Variants = {
  hidden: { opacity: 0, x: 15, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: transitionCinematic,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: transitionCinematic,
  },
};

// --- Specialized Effects ---
export const holographicReveal: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", scale: 1.02 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
};

export const neuralPulse: Variants = {
  hidden: { opacity: 0.8, filter: "drop-shadow(0 0 0px rgba(255,255,255,0))" },
  pulse: {
    opacity: [0.8, 1, 0.8],
    filter: [
      "drop-shadow(0 0 0px rgba(255,255,255,0))",
      "drop-shadow(0 0 8px rgba(255,255,255,0.2))",
      "drop-shadow(0 0 0px rgba(255,255,255,0))"
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const floatHover: Variants = {
  initial: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    y: -2,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
  enter: { opacity: 1, filter: "blur(0px)", y: 0, transition: transitionCinematic },
  exit: { opacity: 0, filter: "blur(10px)", y: -10, transition: { duration: 0.4, ease: "easeIn" } },
};
