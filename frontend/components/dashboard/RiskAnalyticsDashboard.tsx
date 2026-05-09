"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";
import { ShieldAlert, TrendingUp, AlertCircle, Activity } from "lucide-react";

interface RiskAnalyticsProps {
  analysis: {
    security_score: number;
    vulnerability_rating: string;
    hallucination_risk: string;
    compliance_score: number;
    agent_verdicts: any[];
  } | null;
}

const RiskAnalyticsDashboard: React.FC<RiskAnalyticsProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
        <Activity size={48} className="animate-pulse opacity-20" />
        <p className="text-xs uppercase tracking-widest font-bold">Waiting for Security Analysis...</p>
      </div>
    );
  }

  const radarData = analysis.agent_verdicts.map(v => ({
    subject: v.agent_name.replace(" Agent", ""),
    A: v.confidence * 100,
    fullMark: 100,
  }));

  const barData = [
    { name: "Security", value: analysis.security_score },
    { name: "Compliance", value: analysis.compliance_score },
    { name: "Hallucination", value: analysis.hallucination_risk === "Low" ? 90 : analysis.hallucination_risk === "Medium" ? 60 : 30 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Left Column: Primary Metrics */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 glass relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert size={40} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Aegis Trust Score</span>
              <Activity size={14} className="text-cyan-500 animate-pulse" />
            </div>
            <div className="text-4xl font-black text-slate-100 tracking-tighter">
              {analysis.security_score}<span className="text-cyan-500/50">.0</span>
            </div>
            <div className="w-full bg-slate-800/50 h-1 rounded-full mt-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${analysis.security_score}%` }}
                className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              />
            </div>
            <div className="mt-2 text-[8px] text-slate-500 uppercase tracking-widest font-mono">Weighted Intelligence Confidence</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 glass relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle size={40} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Threat Rating</span>
              <div className={`w-2 h-2 rounded-full ${
                analysis.vulnerability_rating === "Critical" ? "bg-red-500" : "bg-green-500"
              } shadow-[0_0_8px_currentColor]`} />
            </div>
            <div className={`text-2xl font-black uppercase tracking-tight ${
              analysis.vulnerability_rating === "Critical" ? "neon-text-red" : 
              analysis.vulnerability_rating === "High" ? "text-orange-500" : "text-green-500"
            }`}>
              {analysis.vulnerability_rating}
            </div>
            <div className="mt-3 text-[8px] text-slate-500 uppercase tracking-widest font-mono">Risk Level Confirmed</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 glass h-48">
          <h3 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", fontSize: "10px" }}
                itemStyle={{ color: "#94a3b8" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#06b6d4" : index === 1 ? "#3b82f6" : "#8b5cf6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Column: Agent Intelligence Radar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 glass flex flex-col">
        <h3 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
          <TrendingUp size={14} className="text-cyan-500" /> Multi-Agent Confidence Radar
        </h3>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
              <Radar
                name="Confidence"
                dataKey="A"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {analysis.agent_verdicts.map((v, i) => (
            <div key={i} className="p-2 rounded bg-black/40 border border-slate-800/50 flex justify-between items-center">
              <span className="text-[9px] text-slate-400 truncate pr-2">{v.agent_name}</span>
              <span className={`text-[9px] font-bold ${
                v.verdict === "PASS" ? "text-green-500" : v.verdict === "FAIL" ? "text-red-500" : "text-yellow-500"
              }`}>
                {v.verdict}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskAnalyticsDashboard;
