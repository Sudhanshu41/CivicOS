"use client";

import { useState, useEffect } from "react";

/**
 * CIVICOS — USE WORKFLOW HOOK
 * Manages the animated workflow steps for the AI Orchestration system.
 */
export function useWorkflow(totalSteps: number = 5, interval: number = 3000) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % totalSteps);
    }, interval);
    
    return () => clearInterval(timer);
  }, [totalSteps, interval]);

  return { activeStep, setActiveStep };
}
