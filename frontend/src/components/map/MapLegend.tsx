import React from "react";

export const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 z-20 rounded-lg bg-tactical-950/90 backdrop-blur-md border border-slate-800 p-3 text-xs font-mono shadow-tactical-card max-w-xs">
      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
        GIS Tactical Classification
      </h4>

      <div className="space-y-1.5 text-[11px]">
        {/* Critical Inundation */}
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 rounded border border-tactical-cyan bg-tactical-cyan/40 shadow-glow-cyan"></span>
          <span className="text-slate-200">AI Flood Inundation Extent (ResUNet)</span>
        </div>

        {/* Permanent Water */}
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 rounded border border-blue-600 bg-blue-800/60"></span>
          <span className="text-slate-400">Permanent Water (JRC 95% Occur.)</span>
        </div>

        {/* Submerged Road */}
        <div className="flex items-center space-x-2">
          <span className="w-4 h-1 rounded bg-tactical-amber inline-block"></span>
          <span className="text-slate-300">NH-37 / Critical Embankment Road</span>
        </div>

        {/* Settlement Alert */}
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-tactical-crimson animate-pulse inline-block"></span>
          <span className="text-slate-300">Vulnerable Settlement / Relief Shelter</span>
        </div>

        {/* CWC Gauge */}
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rotate-45 border border-tactical-emerald bg-tactical-emerald/50 inline-block"></span>
          <span className="text-slate-300">CWC Telemetry Gauge (River Stage)</span>
        </div>
      </div>
    </div>
  );
};
