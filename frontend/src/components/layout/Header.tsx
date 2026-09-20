import React from "react";
import { 
  Satellite, 
  Layers, 
  FileText, 
  BellRing, 
  BarChart3, 
  Activity, 
  SlidersHorizontal,
  RefreshCw,
  Image as ImageIcon,
  Brain,
  Sparkles,
  Waves,
  Globe2
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    isAnalyticsOpen,
    toggleAnalyticsDrawer,
    isAdvisoriesOpen,
    toggleAdvisoriesDrawer,
    toggleExportModal,
    toggleImageryModal,
    isAiExplainerOpen,
    toggleAiExplainer,
    toggleIndiaMap,
    activeMapMode,
    setActiveMapMode,
    isLoadingData,
    advisoriesData
  } = useFloodStore();

  const criticalCount = advisoriesData?.critical_count ?? 2;

  return (
    <header className="h-16 border-b border-slate-800/90 bg-tactical-950/95 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Satellite Telemetry Status */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-tactical-cyan/10 border border-tactical-cyan/30 text-tactical-cyan">
          <Satellite className="w-5 h-5 animate-pulse-slow" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tactical-cyan radar-blip" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm md:text-base font-bold tracking-wider font-mono text-white">
              FLOODED<span className="text-tactical-cyan"> AI</span>
            </h1>
            <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60 uppercase">
              Sentinel-1 C-SAR + ResUNet v2.1
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 flex items-center space-x-2">
            <span>Brahmaputra & Barak Basins</span>
            <span className="text-slate-600">•</span>
            <span className="text-tactical-emerald flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-tactical-emerald inline-block mr-1"></span>
              ORBIT #48192 ONLINE
            </span>
          </p>
        </div>
      </div>

      {/* Critical Advisory Banner Alert */}
      <div 
        onClick={() => toggleAdvisoriesDrawer(true)}
        className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-tactical-crimson/10 border border-tactical-crimson/40 text-tactical-crimson cursor-pointer hover:bg-tactical-crimson/20 transition-all"
      >
        <BellRing className="w-4 h-4 animate-bounce" />
        <span className="text-xs font-mono font-semibold">
          {criticalCount} CRITICAL FLASH FLOOD ALERTS ACTIVE (MAJULI / DHUBRI)
        </span>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-tactical-crimson text-black font-bold">
          NESAC
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2">
        {/* Swipe vs Single Mode Toggle */}
        <div className="flex items-center p-1 bg-tactical-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode("swipe")}
            className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
              viewMode === "swipe"
                ? "bg-tactical-cyan/20 text-tactical-cyan border border-tactical-cyan/50 shadow-glow-cyan"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="hidden sm:inline">Split Swipe</span>
            <span className="sm:hidden">Swipe</span>
          </button>
          <button
            onClick={() => setViewMode("single")}
            className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
              viewMode === "single"
                ? "bg-tactical-cyan/20 text-tactical-cyan border border-tactical-cyan/50 shadow-glow-cyan"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Overlay
          </button>
        </div>

        {/* Analytics Drawer Toggle */}
        <button
          onClick={() => toggleAnalyticsDrawer()}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            isAnalyticsOpen
              ? "bg-blue-600/20 text-blue-400 border-blue-500/50"
              : "bg-tactical-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
          title="Toggle Analytics Dashboard"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Analytics</span>
        </button>

        {/* Advisories Button */}
        <button
          onClick={() => toggleAdvisoriesDrawer()}
          className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            isAdvisoriesOpen
              ? "bg-tactical-crimson/20 text-tactical-crimson border-tactical-crimson/50"
              : "bg-tactical-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
          title="Regional Advisories & CWC Gauges"
        >
          <Activity className="w-4 h-4 text-tactical-crimson" />
          <span className="hidden sm:inline">Alerts</span>
          {criticalCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-tactical-crimson absolute -top-1 -right-1 animate-ping" />
          )}
        </button>

        {/* Flooded AI Diagnostic & Explainer (Upload ANY Image) */}
        <button
          onClick={() => toggleAiExplainer(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-tactical-cyan bg-gradient-to-r from-tactical-cyan/20 to-blue-600/20 text-tactical-cyan hover:bg-tactical-cyan/30 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.35)]"
          title="Flooded AI - Upload ANY flooded image for automated root-cause diagnosis"
        >
          <Brain className="w-4 h-4 animate-pulse text-tactical-cyan" />
          <span className="hidden md:inline">Flooded AI</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-tactical-cyan text-black font-extrabold animate-pulse">
            AI VISION
          </span>
        </button>

        {/* Where Floods Come From (Origin Tracker) */}
        <button
          onClick={() => setActiveMapMode(activeMapMode === "origin-tracker" ? "surveillance" : "origin-tracker")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
            activeMapMode === "origin-tracker"
              ? "bg-amber-500/20 text-tactical-amber border-tactical-amber shadow-glow-amber"
              : "bg-tactical-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
          title="Track Hydrological Inflow & Origins of Floods in North East India"
        >
          <Waves className="w-4 h-4 text-tactical-amber" />
          <span className="hidden lg:inline">Where Floods Come</span>
        </button>

        {/* Before & After Satellite Imagery Button */}
        <button
          onClick={() => toggleImageryModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-tactical-900 hover:border-tactical-cyan text-slate-200 hover:text-white text-xs font-mono font-semibold transition-all"
          title="NASA Earth Observatory & Copernicus Before & After Satellite Images"
        >
          <ImageIcon className="w-4 h-4 text-tactical-cyan" />
          <span className="hidden md:inline">NASA Before/After</span>
        </button>

        {/* India Flood Map Button */}
        <button
          onClick={() => toggleIndiaMap(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-tactical-cyan/40 bg-tactical-cyan/10 text-tactical-cyan hover:bg-tactical-cyan/25 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.25)]"
          title="Open All-India Satellite Flood Extent & Location Map"
        >
          <Globe2 className="w-4 h-4 text-tactical-cyan animate-pulse" />
          <span className="hidden sm:inline">India Flood Map</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-tactical-cyan text-black font-extrabold">
            AREA & LINKS
          </span>
        </button>

        {/* Export SITREP Button */}
        <button
          onClick={() => toggleExportModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-tactical-cyan text-black hover:bg-tactical-cyan/90 font-mono font-semibold text-xs transition-all shadow-glow-cyan"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">SITREP</span>
        </button>
      </div>
    </header>
  );
};
