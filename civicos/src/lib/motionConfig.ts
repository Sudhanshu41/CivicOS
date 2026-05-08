import { Variants } from "framer-motion";

export const transitionSmooth = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export const transitionCinematic = {
  duration: 1.2,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: transitionSmooth,
  },
};

export const holographicReveal: Variants = {
  hidden: { opacity: 0, filter: "brightness(2) blur(20px)", scale: 1.1 },
  show: {
    opacity: 1,
    filter: "brightness(1) blur(0px)",
    scale: 1,
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

export const neuralPulse: Variants = {
  hidden: { opacity: 0.5, scale: 1, filter: "drop-shadow(0 0 0px rgba(59,130,246,0))" },
  pulse: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    filter: [
      "drop-shadow(0 0 0px rgba(59,130,246,0))",
      "drop-shadow(0 0 15px rgba(59,130,246,0.8))",
      "drop-shadow(0 0 0px rgba(59,130,246,0))"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const floatHover: Variants = {
  initial: { y: 0, rotateX: 0, rotateY: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    y: -5,
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.3)",
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(20px)", scale: 0.98 },
  enter: { opacity: 1, filter: "blur(0px)", scale: 1, transition: transitionCinematic },
  exit: { opacity: 0, filter: "blur(20px)", scale: 1.02, transition: { duration: 0.5 } },
};
