"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, MapPin, BrainCircuit, CheckCircle2 } from "lucide-react";
import { useUIStore } from "../../../stores/uiStore";
import { useCityOperations, IncidentCategory, IncidentSeverity } from "../../../stores/cityOperations";

export function IncidentSubmissionModal() {
  const { incidentModalOpen, closeIncidentModal } = useUIStore();
  const { upsertIncident } = useCityOperations();
  
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, unknown> | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAiAnalysis(null);

    try {
      // Create FormData to send to our API
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);
      if (file) {
        formData.append("file", file);
      }

      // We send it to Gemini-powered backend for analysis
      const res = await fetch("/api/incident", {
        method: "POST",
        body: formData,
      });

      const analysis = await res.json();
      setAiAnalysis(analysis);

      // Add to store after a brief delay to show analysis
      setTimeout(() => {
        const newIncident = {
          id: `inc-${Date.now()}`,
          title: title || (analysis.inferredTitle as string) || "Reported Incident",
          category: ((analysis.category as string) || "infrastructure") as IncidentCategory,
          severity: ((analysis.severity as string) || "medium") as IncidentSeverity,
          status: "active" as const,
          location: { lat: 12.97 + (Math.random() - 0.5) * 0.1, lng: 77.59 + (Math.random() - 0.5) * 0.1, label: "User Reported" },
          timestamp: new Date().toISOString(),
          department: (analysis.department as string) || "infrastructure",
        };
        upsertIncident(newIncident);
        setIsSubmitting(false);
        reset();
        closeIncidentModal();
      }, 3000);

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setTitle("");
    setDesc("");
    setFile(null);
    setPreview(null);
    setAiAnalysis(null);
    setAnonymous(false);
  };

  if (!incidentModalOpen) return null;

  return (
    <AnimatePresence>
      {incidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-black/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-widest text-white">Report Incident</h2>
                  <p className="text-xs text-gray-500 font-mono uppercase">Citizen Reporting Portal</p>
                </div>
              </div>
              <button 
                onClick={closeIncidentModal}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {!isSubmitting && !aiAnalysis ? (
                <form id="incident-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Location / Title</label>
                      <input 
                        required
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Broken Water Main on 5th Avenue"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD500]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                      <textarea 
                        required
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        placeholder="Describe the situation..."
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD500]/50 transition-colors resize-none"
                      />
                    </div>

                    {/* Drag and Drop */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Visual Evidence (Image/Video)</label>
                      <div 
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-white/10 hover:border-[#FFD500]/30 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                      >
                        {preview ? (
                          <>
                            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="relative z-10 flex items-center space-x-2 text-white">
                              <CheckCircle2 className="w-5 h-5 text-[#FFD500]" />
                              <span className="text-xs font-bold uppercase tracking-widest">Media Attached</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 text-gray-500 mb-2 group-hover:text-[#FFD500] transition-colors" />
                            <span className="text-xs text-gray-400 font-mono">Drag & Drop or Click to Browse</span>
                          </>
                        )}
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" />
                      </div>
                    </div>

                    {/* Anonymous Toggle */}
                    <div className="flex items-center space-x-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setAnonymous(!anonymous)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${anonymous ? 'bg-[#FFD500]' : 'bg-white/10'}`}
                      >
                        <motion.div 
                          className="w-4 h-4 bg-black rounded-full absolute top-0.5"
                          animate={{ left: anonymous ? '1.25rem' : '0.125rem' }}
                        />
                      </button>
                      <span className="text-xs text-gray-400 font-mono">Submit Anonymously</span>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-6">
                  {aiAnalysis ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-widest">Incident Processed</h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left max-w-sm mx-auto text-xs font-mono space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category:</span>
                          <span className="text-[#FFD500] uppercase">{aiAnalysis.category as string}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Severity:</span>
                          <span className="text-rose-500 uppercase">{aiAnalysis.severity as string}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Routing to:</span>
                          <span className="text-blue-400 uppercase">{aiAnalysis.department as string}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-4">Generating workflow...</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-t-[#FFD500] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                        <BrainCircuit className="w-8 h-8 text-[#FFD500] animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">AI Image Intelligence</h3>
                        <p className="text-xs text-gray-500 font-mono">Gemini is analyzing visual evidence and predicting escalation routing...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end">
              {!isSubmitting && !aiAnalysis && (
                <div className="flex space-x-4">
                  <button 
                    onClick={closeIncidentModal}
                    className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    form="incident-form"
                    type="submit"
                    className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-[#FFD500] text-black hover:bg-yellow-400 transition-colors flex items-center shadow-[0_0_15px_rgba(255,213,0,0.3)]"
                  >
                    Submit & Analyze
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
