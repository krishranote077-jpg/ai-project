import React, { useState } from "react";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Droplets, 
  Radio, 
  Route, 
  Home, 
  Activity 
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";
import { LayerVisibilityState, LayerOpacityState } from "@/types";

export const LayerControl: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { 
    activeLayers, 
    toggleLayer, 
    layerOpacity, 
    setLayerOpacity 
  } = useFloodStore();

  const layerItems: {
    key: keyof LayerVisibilityState;
    label: string;
    icon: React.ReactNode;
    color: string;
    opacityKey?: keyof LayerOpacityState;
  }[] = [
    {
      key: "inundationMask",
      label: "AI Inundation Mask (ResUNet)",
      icon: <Droplets className="w-3.5 h-3.5 text-tactical-cyan" />,
      color: "#00f0ff",
      opacityKey: "inundationMask"
    },
    {
      key: "sarBackscatter",
      label: "Sentinel-1 SAR Amplitude (dB)",
      icon: <Radio className="w-3.5 h-3.5 text-slate-300" />,
      color: "#94a3b8",
      opacityKey: "sarBackscatter"
    },
    {
      key: "permanentWater",
      label: "Permanent Water (JRC Surface)",
      icon: <span className="w-3 h-3 rounded-full bg-blue-700 inline-block"></span>,
      color: "#1d4ed8",
      opacityKey: "permanentWater"
    },
    {
      key: "infrastructureRoads",
      label: "Critical Roads & Embankments (NH-37)",
      icon: <Route className="w-3.5 h-3.5 text-tactical-amber" />,
      color: "#ffb700"
    },
    {
      key: "settlementsAtRisk",
      label: "Vulnerable Villages / Relief Camps",
      icon: <Home className="w-3.5 h-3.5 text-tactical-crimson" />,
      color: "#ff2a5f"
    },
    {
      key: "cwcGauges",
      label: "CWC Telemetry Gauges (River Stage)",
      icon: <Activity className="w-3.5 h-3.5 text-tactical-emerald" />,
      color: "#00ff88"
    }
  ];

  return (
    <div className="absolute top-16 left-4 z-20 w-72 rounded-lg bg-tactical-950/90 backdrop-blur-md border border-slate-800 shadow-tactical-card overflow-hidden">
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-tactical-900/80 cursor-pointer border-b border-slate-800/80 text-xs font-mono select-none"
      >
        <div className="flex items-center space-x-2 text-slate-200">
          <Layers className="w-4 h-4 text-tactical-cyan" />
          <span className="font-semibold uppercase tracking-wider">Map Layers & Overlays</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Layer List */}
      {isOpen && (
        <div className="p-3 space-y-2.5 text-xs font-mono">
          {layerItems.map((item) => {
            const isVisible = activeLayers[item.key];
            return (
              <div key={item.key} className="space-y-1.5 pb-2 border-b border-slate-900 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className={isVisible ? "text-slate-200" : "text-slate-500 line-through"}>
                      {item.label}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleLayer(item.key)}
                    className={`p-1 rounded transition-colors ${
                      isVisible
                        ? "text-tactical-cyan hover:bg-tactical-cyan/10"
                        : "text-slate-600 hover:text-slate-400"
                    }`}
                    title={isVisible ? "Hide Layer" : "Show Layer"}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Opacity Slider for raster/mask layers */}
                {isVisible && item.opacityKey && (
                  <div className="flex items-center space-x-2 pl-5 pt-0.5">
                    <Sliders className="w-2.5 h-2.5 text-slate-500" />
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={layerOpacity[item.opacityKey]}
                      onChange={(e) => setLayerOpacity(item.opacityKey!, parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-tactical-cyan"
                    />
                    <span className="text-[10px] text-slate-500 w-8 text-right">
                      {Math.round(layerOpacity[item.opacityKey] * 100)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
