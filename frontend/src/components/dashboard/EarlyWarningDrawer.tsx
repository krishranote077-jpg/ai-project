"use client";

import React from "react";
import { 
  X, 
  AlertTriangle, 
  BellRing, 
  Activity, 
  ShieldAlert, 
  Radio, 
  TrendingUp, 
  Navigation,
  ExternalLink 
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";

export const EarlyWarningDrawer: React.FC = () => {
  const { 
    isAdvisoriesOpen, 
    toggleAdvisoriesDrawer, 
    advisoriesData 
  } = useFloodStore();

  if (!isAdvisoriesOpen) return null;

  const bulletins = advisoriesData?.bulletins || [];
  const gauges = advisoriesData?.river_gauges || [];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-tactical-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col font-mono text-xs animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-tactical-900/60">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded bg-tactical-crimson/10 border border-tactical-crimson/30 text-tactical-crimson">
            <BellRing className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Disaster Early Warning Center
            </h2>
            <p className="text-[10px] text-slate-400">
              NESAC Satellite Feeds & CWC Telemetry
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleAdvisoriesDrawer(false)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* River Gauge Stage Highlights */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-300 uppercase flex items-center">
              <Activity className="w-3.5 h-3.5 text-tactical-emerald mr-1.5" />
              CWC River Gauge Telemetry
            </span>
            <span className="text-[10px] text-slate-500">Live Stage</span>
          </div>

          <div className="space-y-2">
            {gauges.map((g) => {
              const isBreached = g.current_level_m > g.danger_level_m;
              const delta = (g.current_level_m - g.danger_level_m).toFixed(2);

              return (
                <div 
                  key={g.station_id}
                  className={`p-2.5 rounded-lg border bg-tactical-900/80 ${
                    isBreached ? "border-tactical-crimson/50" : "border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{g.station_name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isBreached 
                        ? "bg-tactical-crimson/20 text-tactical-crimson border border-tactical-crimson/40" 
                        : "bg-tactical-emerald/20 text-tactical-emerald border border-tactical-emerald/40"
                    }`}>
                      {isBreached ? `+${delta}m DANGER` : "NORMAL"}
                    </span>
                  </div>

                  <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
                    <span>River: {g.river}</span>
                    <span className="text-white font-bold">{g.current_level_m}m</span>
                    <span className="flex items-center text-tactical-amber">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      {g.trend}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NESAC Satellite Flood Advisories */}
        <div>
          <div className="flex items-center justify-between mb-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 uppercase flex items-center">
              <Radio className="w-3.5 h-3.5 text-tactical-cyan mr-1.5" />
              Automated Satellite Advisories
            </span>
            <span className="text-[10px] text-slate-500">NESAC / ISRO</span>
          </div>

          <div className="space-y-3">
            {bulletins.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-lg bg-tactical-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    b.severity === "CRITICAL"
                      ? "bg-tactical-crimson/20 text-tactical-crimson border border-tactical-crimson/40"
                      : "bg-tactical-amber/20 text-tactical-amber border border-tactical-amber/40"
                  }`}>
                    {b.severity} ALERT
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-100 text-xs leading-snug">
                  {b.title}
                </h3>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {b.summary}
                </p>

                <div className="p-2 rounded bg-tactical-950 border border-slate-800/80 text-[10px]">
                  <span className="text-tactical-amber font-semibold block mb-0.5">DIRECTIVE:</span>
                  <span className="text-slate-300">{b.recommended_action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-slate-800 bg-tactical-900/90 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Emergency Ops Hotline:</span>
        <span className="text-tactical-cyan font-bold">ASDMA 1070 / 1079</span>
      </div>
    </div>
  );
};
