"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Terminal as TerminalIcon, BarChart3, Settings, LogOut, ChevronRight, Globe, Lock, Cpu, CheckCircle2, Activity } from "lucide-react";
import ModelSelector, { Model } from "@/components/dashboard/ModelSelector";
import AttackCenter from "@/components/dashboard/AttackCenter";
import LiveTerminal from "@/components/terminal/LiveTerminal";
import RiskAnalyticsDashboard from "@/components/dashboard/RiskAnalyticsDashboard";
import { useTerminalWebSocket } from "@/hooks/useTerminalWebSocket";

export default function Home() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // V2: Real-time Terminal Engine
  const { messages: logs, lastResult, clearMessages } = useTerminalWebSocket("ws://localhost:8000/ws/terminal");

  useEffect(() => {
    if (lastResult) {
      setAnalysis({
        security_score: lastResult.security_score,
        vulnerability_rating: lastResult.vulnerability_rating,
        hallucination_risk: "Low", // Mock for now
        compliance_score: 85,
        agent_verdicts: lastResult.verdicts.map((v: any) => ({
          agent_name: v.agent_name,
          verdict: v.verdict,
          confidence: v.confidence,
          reasoning: v.reasoning
        }))
      });
      setIsLaunching(false);
    }
  }, [lastResult]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/models/status");
        const data = await res.json();
        setModels(data);
        if (data.length > 0) setSelectedModelId(data[0].model_id);
      } catch (err) {
        console.error("Failed to fetch models", err);
      }
    };
    fetchModels();
  }, []);

  const handleLaunchAttack = async (type: string, payload: string) => {
    if (!selectedModelId) return;
    
    setIsLaunching(true);
    setAnalysis(null);
    clearMessages();
    
    try {
      await fetch("http://localhost:8000/api/v1/attacks/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: selectedModelId,
          attack_type: type,
          payload: payload
        })
      });
    } catch (err) {
      console.error("Launch failed", err);
      setIsLaunching(false);
    }
  };

  const handleDownloadReport = () => {
    if (!analysis) return;
    const reportContent = `AEGIS AI SECURITY AUDIT REPORT\n` +
      `==============================\n` +
      `Target: ${selectedModelId}\n` +
      `Score: ${analysis.security_score}%\n` +
      `Vulnerability: ${analysis.vulnerability_rating}\n\n` +
      `Nexus Verdicts:\n` +
      analysis.agent_verdicts.map((v: any) => `- ${v.agent_name}: ${v.verdict}`).join("\n");
    
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `AegisAI_${selectedModelId}_Audit.txt`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-black text-slate-200 overflow-hidden font-sans relative crt-flicker">
      <div className="scanline" />
      <aside className="w-64 border-r border-slate-800/50 bg-slate-950 flex flex-col items-center py-6 gap-8">
        <div className="flex items-center gap-3 px-6 mb-4">
          <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center border border-cyan-500/50">
            <Shield className="text-cyan-500" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-100">AEGIS<span className="text-cyan-500">AI</span></h1>
            <p className="text-[8px] uppercase tracking-[0.2em] text-cyan-500/70 font-bold">Enterprise SOC</p>
          </div>
        </div>

        <nav className="flex-1 w-full px-4 space-y-2">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Command Center" },
            { id: "terminal", icon: TerminalIcon, label: "Live Intel" },
            { id: "analytics", icon: BarChart3, label: "Threat Analytics" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
              }`}
            >
              <item.icon size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 uppercase tracking-widest">Enterprise_Root /</span>
            <span className="text-slate-100 font-bold uppercase tracking-widest">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-500">
                SOC_STATUS: ACTIVE_STREAMING
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto space-y-8">
            <section>
              <ModelSelector 
                models={models} 
                selectedModelId={selectedModelId} 
                onSelect={setSelectedModelId} 
              />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[550px]">
              <div className="xl:col-span-4 flex flex-col">
                <AttackCenter 
                  onLaunch={handleLaunchAttack} 
                  isLaunching={isLaunching}
                  disabled={!selectedModelId}
                />
              </div>
              <div className="xl:col-span-8 flex flex-col">
                <LiveTerminal logs={logs} />
              </div>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8 min-h-[400px]">
              <div className="2xl:col-span-8 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                    <ChevronRight size={14} className="text-cyan-500" /> Post-Inference Risk Evaluation
                  </h2>
                  {analysis && (
                    <button 
                      onClick={handleDownloadReport}
                      className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest hover:underline"
                    >
                      Download_Audit_Report.txt
                    </button>
                  )}
                </div>
                <RiskAnalyticsDashboard analysis={analysis} />
              </div>

              <div className="2xl:col-span-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                    <ChevronRight size={14} className="text-cyan-500" /> System Observability
                  </h2>
                </div>
                <div className="flex-1 p-6 rounded-xl bg-slate-900/40 border border-slate-800 glass space-y-6">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <span>Global Throughput</span>
                        <span className="text-xs text-slate-200 font-mono">1.2k req/min</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "30%" }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                          className="h-full bg-cyan-500"
                        />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <span>Evaluator Latency</span>
                        <span className="text-xs text-slate-200 font-mono">342ms avg</span>
                      </div>
                      <div className="grid grid-cols-8 gap-1 h-8">
                        {mounted && [...Array(8)].map((_, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: "40%" }}
                            animate={{ height: `${20 + Math.random() * 80}%` }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror", delay: i * 0.1 }}
                            className="bg-slate-700/50 rounded-sm"
                          />
                        ))}
                      </div>
                   </div>

                   <div className="pt-4 border-t border-slate-800/50">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-slate-800/50">
                        <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center border border-green-500/20">
                          <CheckCircle2 size={16} className="text-green-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-200 font-bold uppercase tracking-widest">Agent Nexus Health</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-tighter">All evaluators synchronized</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
