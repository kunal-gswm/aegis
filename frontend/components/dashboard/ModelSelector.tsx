"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface Model {
  model_id: string;
  provider: string;
  status: string;
  latency: number;
  risk_level: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModelId: string | null;
  onSelect: (id: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModelId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => (
        <motion.div
          key={model.model_id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(model.model_id)}
          className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 glass ${
            selectedModelId === model.model_id
              ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              : "border-slate-800 hover:border-slate-700 bg-slate-900/40"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-slate-100">{model.model_id}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-tighter">{model.provider}</p>
            </div>
            {model.status === "Online" ? (
              <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                <CheckCircle2 size={12} /> ONLINE
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
                <AlertTriangle size={12} /> OFFLINE
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs mt-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Zap size={14} className="text-yellow-500/70" />
              <span>{model.latency}s latency</span>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              model.risk_level === "Low" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
              model.risk_level === "Medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
              "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {model.risk_level} RISK
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ModelSelector;
