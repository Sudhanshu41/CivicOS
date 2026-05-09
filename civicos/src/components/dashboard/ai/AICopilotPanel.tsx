"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, Terminal, Activity } from "lucide-react";
import { useUIStore } from "../../../stores/uiStore";
import { useCityOperations } from "../../../stores/cityOperations";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  telemetry?: Record<string, unknown>;
}

const SUGGESTIONS = [
  "Show active emergencies",
  "Why is Traffic Control overloaded?",
  "Summarize current city risk",
  "Predict escalation zones"
];

export function AICopilotPanel() {
  const { aiCopilotOpen, closeAiCopilot } = useUIStore();
  const { cityMetrics } = useCityOperations();
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "init",
      role: "ai",
      content: "CivicOS Core AI initialized. I am monitoring city orchestration, traffic anomalies, and active emergencies. How can I assist your command?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiCopilotOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, aiCopilotOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context: { cityMetrics } })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.reply || "I encountered a processing anomaly.",
        timestamp: new Date().toISOString(),
        telemetry: data.telemetry
      }]);

    } catch (_error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "System anomaly: Unable to reach AI orchestration core.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {aiCopilotOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAiCopilot}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0f]/95 backdrop-blur-3xl border-l border-white/10 z-50 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD500]/10 border border-[#FFD500]/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#FFD500]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center">
                    CivicOS Copilot <span className="ml-2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                  </h2>
                  <p className="text-[10px] text-gray-500 font-mono uppercase">Operational AI Core</p>
                </div>
              </div>
              <button 
                onClick={closeAiCopilot}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-white/10 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-transparent text-gray-300'} px-4 py-3 text-sm`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Terminal className="w-3 h-3 text-[#FFD500]" />
                        <span className="text-[9px] font-mono uppercase text-[#FFD500] tracking-widest">System Response</span>
                        <span className="text-[9px] font-mono text-gray-600">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                    )}
                    <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                    
                    {/* Telemetry Block */}
                    {msg.telemetry && (
                      <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                          <span className="text-gray-500">Confidence</span>
                          <span className="text-emerald-400">{msg.telemetry.confidence}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                          <span className="text-gray-500">Execution Time</span>
                          <span className="text-blue-400">{msg.telemetry.latency}ms</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-transparent text-gray-500 px-4 py-3">
                    <Activity className="w-4 h-4 animate-pulse text-[#FFD500]" />
                    <span className="text-xs font-mono uppercase tracking-widest">Processing</span>
                    <span className="flex space-x-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/40 border-t border-white/5">
              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {SUGGESTIONS.map(s => (
                    <button 
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 bg-white/5 hover:bg-white/10 hover:text-[#FFD500] border border-white/5 hover:border-[#FFD500]/30 transition-all rounded-full text-gray-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form 
                onSubmit={e => { e.preventDefault(); handleSend(input); }}
                className="relative flex items-center"
              >
                <Sparkles className="absolute left-4 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Command AI..."
                  className="w-full bg-white/5 border border-white/10 focus:border-[#FFD500]/50 rounded-xl py-4 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 w-10 h-10 rounded-lg bg-[#FFD500]/10 hover:bg-[#FFD500]/20 flex items-center justify-center text-[#FFD500] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
