"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "SCAN" | "RISK" | "SUCCESS" | "FAIL";
  message: string;
}

interface LiveTerminalProps {
  logs: LogEntry[];
}

const LiveTerminal: React.FC<LiveTerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "INFO": return "text-blue-400";
      case "WARNING": return "text-yellow-400";
      case "SCAN": return "text-cyan-400";
      case "RISK": return "text-orange-500";
      case "SUCCESS": return "text-green-400";
      case "FAIL": return "text-red-500";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/90 border border-slate-800 rounded-lg overflow-hidden font-mono text-[11px] glass relative">
      {/* Terminal Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/80 border-b border-slate-800 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/20" />
          </div>
          <div className="h-3 w-[1px] bg-slate-800 mx-1" />
          <span className="text-slate-400 text-[9px] tracking-[0.2em] uppercase font-bold">INTELLIGENCE_FEED::NODE_01</span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-bold tracking-widest text-slate-500">
           <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-cyan-500/80 uppercase">STREAMING</span>
           </div>
           <div className="h-3 w-[1px] bg-slate-800" />
           <span className="uppercase">LATENCY: 0.04ms</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800/50 z-10"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3"
            >
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={`font-bold shrink-0 w-20 ${getLevelColor(log.level)}`}>
                [{log.level}]
              </span>
              <span className="text-slate-300 break-all">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Animated cursor */}
        <div className="flex gap-3">
          <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
          <span className="w-2 h-4 bg-cyan-500/50 animate-pulse mt-0.5" />
        </div>
      </div>
    </div>
  );
};

export default LiveTerminal;
