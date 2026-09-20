import React from "react";
import { 
  Waves, 
  TrendingUp, 
  Users, 
  Wheat, 
  Route, 
  AlertCircle 
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";

export const MetricCards: React.FC = () => {
  const { analyticsData, selectedDistrict } = useFloodStore();

  const summary = analyticsData?.summary || {
    total_flooded_sqkm: 412.5,
    baseline_water_sqkm: 142.0,
    percent_surge: 190.5,
    impacted_population: 186400,
    cropland_affected_hectares: 25575,
    flooded_road_km: 24.8,
    critical_hazard_level: "CRITICAL"
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Flooded Area */}
      <div className="relative rounded-lg bg-tactical-900/90 border border-slate-800 p-3 shadow-tactical-card overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-tactical-cyan/5 rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Total Inundated Area
          </span>
          <Waves className="w-4 h-4 text-tactical-cyan" />
        </div>
        <div className="mt-1.5 flex items-baseline space-x-2">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {summary.total_flooded_sqkm.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-tactical-cyan font-semibold">km²</span>
        </div>
        <div className="mt-1 flex items-center space-x-1 text-[11px] font-mono text-tactical-crimson">
          <TrendingUp className="w-3 h-3" />
          <span>+{summary.percent_surge}% above baseline</span>
        </div>
      </div>

      {/* 2. Exposed Population */}
      <div className="relative rounded-lg bg-tactical-900/90 border border-slate-800 p-3 shadow-tactical-card overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-tactical-crimson/5 rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Exposed Population
          </span>
          <Users className="w-4 h-4 text-tactical-crimson" />
        </div>
        <div className="mt-1.5 flex items-baseline space-x-2">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {summary.impacted_population.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-slate-400">citizens</span>
        </div>
        <div className="mt-1 flex items-center space-x-1 text-[11px] font-mono text-tactical-amber">
          <AlertCircle className="w-3 h-3" />
          <span>High evacuation urgency</span>
        </div>
      </div>

      {/* 3. Agriculture Land Affected */}
      <div className="relative rounded-lg bg-tactical-900/90 border border-slate-800 p-3 shadow-tactical-card overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-tactical-amber/5 rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Agricultural Cropland
          </span>
          <Wheat className="w-4 h-4 text-tactical-amber" />
        </div>
        <div className="mt-1.5 flex items-baseline space-x-2">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {summary.cropland_affected_hectares.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-tactical-amber font-semibold">Hectares</span>
        </div>
        <div className="mt-1 flex items-center space-x-1 text-[11px] font-mono text-slate-400">
          <span>Kharif Paddy crop submerged</span>
        </div>
      </div>

      {/* 4. Submerged Road Length */}
      <div className="relative rounded-lg bg-tactical-900/90 border border-slate-800 p-3 shadow-tactical-card overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Highway Disruption
          </span>
          <Route className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-1.5 flex items-baseline space-x-2">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {summary.flooded_road_km}
          </span>
          <span className="text-xs font-mono text-blue-400 font-semibold">km</span>
        </div>
        <div className="mt-1 flex items-center space-x-1 text-[11px] font-mono text-tactical-crimson">
          <span>NH-37 / State Arterials</span>
        </div>
      </div>
    </div>
  );
};
