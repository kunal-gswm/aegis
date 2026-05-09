"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Skull, Ghost, Lock, Zap, ShieldAlert, Bug, Send } from "lucide-react";

const ATTACK_TYPES = [
  { id: "prompt_injection", name: "Prompt Injection", icon: Bug, color: "text-red-400" },
  { id: "jailbreak", name: "Jailbreak Attack", icon: Lock, color: "text-orange-400" },
  { id: "system_leak", name: "System Prompt Leak", icon: Ghost, color: "text-purple-400" },
  { id: "override", name: "Instruction Override", icon: Zap, color: "text-yellow-400" },
  { id: "toxicity", name: "Toxicity Trigger", icon: Skull, color: "text-pink-400" },
  { id: "hallucination", name: "Hallucination Test", icon: ShieldAlert, color: "text-blue-400" },
];

interface AttackCenterProps {
  onLaunch: (attackType: string, payload: string) => void;
  isLaunching: boolean;
  disabled: boolean;
}

const AttackCenter: React.FC<AttackCenterProps> = ({ onLaunch, isLaunching, disabled }) => {
  const [selectedType, setSelectedType] = useState(ATTACK_TYPES[0].id);
  const [payload, setPayload] = useState("");

  return (
    <div className="flex flex-col h-full bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden glass">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
          <Skull size={16} className="text-red-500" /> Adversarial Command Center
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {ATTACK_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              disabled={disabled}
              className={`flex items-center gap-3 p-3 rounded-lg border text-xs transition-all duration-200 ${
                selectedType === type.id
                  ? "bg-red-500/10 border-red-500/50 text-red-100"
                  : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600"
              }`}
            >
              <type.icon size={16} className={selectedType === type.id ? type.color : "text-slate-500"} />
              {type.name}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Adversarial Payload</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            disabled={disabled}
            placeholder="Enter custom prompt injection or select a template..."
            className="flex-1 bg-black/40 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:border-red-500/50 transition-colors resize-none font-mono"
          />
        </div>

        <button
          onClick={() => onLaunch(selectedType, payload)}
          disabled={disabled || isLaunching || !payload}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${
            isLaunching || disabled || !payload
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          }`}
        >
          {isLaunching ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              EXECUTING...
            </>
          ) : (
            <>
              <Send size={18} /> INITIALIZE ATTACK
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AttackCenter;
