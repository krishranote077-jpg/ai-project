"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Crosshair, 
  X, 
  Droplets, 
  AlertTriangle, 
  ShieldAlert, 
  Waves,
  Navigation
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";
import { SwipeSlider } from "./SwipeSlider";
import { LayerControl } from "./LayerControl";
import { MapLegend } from "./MapLegend";
import { FloodOriginTracker, ORIGIN_NODES } from "./FloodOriginTracker";
import { FloodFeatureProperties, CriticalSettlement, CWCGaugeStation } from "@/types";

export const MapViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(10);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const {
    viewMode,
    swipePosition,
    activeLayers,
    layerOpacity,
    selectedDistrict,
    selectedState,
    mapData,
    selectedFeature,
    setSelectedFeature,
    advisoriesData,
    activeMapMode,
    setActiveMapMode,
    selectedOriginNode
  } = useFloodStore();

  const center = mapData?.region?.center || [26.5775, 93.1711];
  const bbox = mapData?.region?.bbox || [92.8, 26.4, 93.6, 26.8];

  // Pan & Zoom controls
  const handleMouseDown = (e: React.MouseEvent) => {
    // Avoid initiating pan when clicking on controls or handles
    if ((e.target as HTMLElement).closest("button, input, select, .cursor-ew-resize, .pointer-events-auto")) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 15));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 7));
  const handleResetCenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(10);
  };

  // Convert geographic lon/lat to container viewport coordinate
  const projectCoord = (lon: number, lat: number, width: number, height: number) => {
    const [minLon, minLat, maxLon, maxLat] = bbox;
    const xPct = (lon - minLon) / (maxLon - minLon);
    const yPct = (maxLat - lat) / (maxLat - minLat);

    const scale = Math.pow(1.3, zoom - 10);
    const cx = width / 2;
    const cy = height / 2;

    const px = (xPct * width - cx) * scale + cx + pan.x;
    const py = (yPct * height - cy) * scale + cy + pan.y;
    return [px, py];
  };

  // Render polygon coordinate array into SVG path data
  const coordinatesToPath = (coords: number[][][], width: number, height: number) => {
    if (!coords || coords.length === 0) return "";
    return coords.map((ring) => {
      return ring.map((pt, i) => {
        const [px, py] = projectCoord(pt[0], pt[1], width, height);
        return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
      }).join(" ") + " Z";
    }).join(" ");
  };

  // Render line string coordinates
  const lineToPath = (coords: number[][], width: number, height: number) => {
    if (!coords || coords.length === 0) return "";
    return coords.map((pt, i) => {
      const [px, py] = projectCoord(pt[0], pt[1], width, height);
      return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
    }).join(" ");
  };

  const [dims, setDims] = useState({ width: 1200, height: 750 });
  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        setDims({
          width: containerRef.current.clientWidth || 1200,
          height: containerRef.current.clientHeight || 750
        });
      }
    };
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative flex-1 w-full h-[calc(100vh-8.5rem)] bg-[#070a13] overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      {/* Tactical Coordinate HUD Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-tactical-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center space-x-3 shadow-lg">
        <span className="text-tactical-cyan flex items-center">
          <Crosshair className="w-3 h-3 mr-1" />
          {center[0].toFixed(4)}°N, {center[1].toFixed(4)}°E
        </span>
        <span className="text-slate-700">|</span>
        <span>ZOOM: {zoom}x</span>
        <span className="text-slate-700">|</span>
        <span className="text-slate-300 uppercase">{selectedDistrict}</span>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-md bg-tactical-950/90 border border-slate-800 hover:border-tactical-cyan/60 text-slate-300 hover:text-tactical-cyan flex items-center justify-center transition-all shadow-md"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-md bg-tactical-950/90 border border-slate-800 hover:border-tactical-cyan/60 text-slate-300 hover:text-tactical-cyan flex items-center justify-center transition-all shadow-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCenter}
          className="w-8 h-8 rounded-md bg-tactical-950/90 border border-slate-800 hover:border-tactical-cyan/60 text-slate-300 hover:text-tactical-cyan flex items-center justify-center transition-all shadow-md"
          title="Reset AOI Center"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Control Panel */}
      <LayerControl />

      {/* Map Legend */}
      <MapLegend />

      {/* ========================================================================= */}
      {/* BASEMAP LAYER 1: PRE-FLOOD BASELINE (Left Side of Split)                  */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all"
        style={{
          clipPath: viewMode === "swipe" ? `inset(0 ${100 - swipePosition}% 0 0)` : undefined
        }}
      >
        {/* High-contrast satellite optical / dry baseline simulation */}
        <div 
          className="w-full h-full tactical-grid-bg relative opacity-90"
          style={{
            background: "radial-gradient(ellipse at center, #0f172a 0%, #060913 100%)",
            transform: `translate(${pan.x * 0.2}px, ${pan.y * 0.2}px)`
          }}
        >
          {/* Natural river bed baseline (dry season channel) */}
          <svg className="w-full h-full absolute inset-0">
            <defs>
              <pattern id="grid-pre" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pre)" />

            {/* Permanent Water Channel (Brahmaputra) */}
            {mapData?.layers?.permanent_water?.features?.map((f, i) => {
              const pathData = coordinatesToPath(f.geometry.coordinates, dims.width, dims.height);
              return (
                <path
                  key={`pre-perm-${i}`}
                  d={pathData}
                  fill="#1e3a8a"
                  fillOpacity="0.6"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Road network in dry baseline */}
            {mapData?.layers?.infrastructure_roads?.features?.map((f, i) => {
              const pathData = lineToPath(f.geometry.coordinates, dims.width, dims.height);
              return (
                <path
                  key={`pre-road-${i}`}
                  d={pathData}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BASEMAP LAYER 2: POST-FLOOD EVENT + AI RESUNET INUNDATION (Right Side)     */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all"
        style={{
          clipPath: viewMode === "swipe" ? `inset(0 0 0 ${swipePosition}%)` : undefined
        }}
      >
        {/* Dark radar backscatter baseline */}
        <div 
          className="w-full h-full relative"
          style={{
            background: "radial-gradient(ellipse at center, #0b1120 0%, #03060c 100%)",
            transform: `translate(${pan.x * 0.2}px, ${pan.y * 0.2}px)`
          }}
        >
          <svg className="w-full h-full absolute inset-0">
            <defs>
              <pattern id="grid-post" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="0.8" />
              </pattern>

              {/* Glowing radar flood filter */}
              <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-post)" />

            {/* 1. Permanent Water Bodies */}
            {activeLayers.permanentWater && mapData?.layers?.permanent_water?.features?.map((f, i) => {
              const pathData = coordinatesToPath(f.geometry.coordinates, dims.width, dims.height);
              return (
                <path
                  key={`post-perm-${i}`}
                  d={pathData}
                  fill="#1d4ed8"
                  fillOpacity={layerOpacity.permanentWater}
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              );
            })}

            {/* 2. AI ResUNet Flood Inundation Polygons */}
            {activeLayers.inundationMask && mapData?.layers?.inundation_mask?.features?.map((f, i) => {
              const pathData = coordinatesToPath(f.geometry.coordinates, dims.width, dims.height);
              const isSelected = selectedFeature?.feature_id === f.properties.feature_id;

              return (
                <g key={`inundation-${i}`} className="pointer-events-auto cursor-pointer">
                  <path
                    d={pathData}
                    fill="#00f0ff"
                    fillOpacity={layerOpacity.inundationMask * (isSelected ? 0.7 : 0.45)}
                    stroke="#00f0ff"
                    strokeWidth={isSelected ? "3" : "1.8"}
                    strokeDasharray={f.properties.severity === "CRITICAL" ? "none" : "6 3"}
                    filter="url(#cyan-glow)"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeature(f.properties);
                    }}
                    className="hover:fill-opacity-60 transition-all duration-150"
                  />
                </g>
              );
            })}

            {/* 3. Transportation Network Risk (National Highways / NH-37) */}
            {activeLayers.infrastructureRoads && mapData?.layers?.infrastructure_roads?.features?.map((f, i) => {
              const pathData = lineToPath(f.geometry.coordinates, dims.width, dims.height);
              const isSubmerged = f.properties.vulnerability === "CRITICAL";

              return (
                <g key={`road-${i}`}>
                  {/* Road Underlay glow */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isSubmerged ? "#ff2a5f" : "#ffb700"}
                    strokeWidth="4"
                    strokeOpacity="0.4"
                  />
                  {/* Road centerline */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isSubmerged ? "#ff2a5f" : "#ffb700"}
                    strokeWidth="2.2"
                    strokeDasharray={isSubmerged ? "8 4" : "none"}
                  />
                </g>
              );
            })}

            {/* 4. Vulnerable Settlements */}
            {activeLayers.settlementsAtRisk && mapData?.layers?.settlements_at_risk?.map((s, i) => {
              const [px, py] = projectCoord(s.lon, s.lat, dims.width, dims.height);
              return (
                <g key={`settlement-${i}`} className="pointer-events-auto cursor-pointer">
                  <circle
                    cx={px}
                    cy={py}
                    r="5"
                    fill="#ff2a5f"
                    className="animate-ping opacity-75 origin-center"
                  />
                  <circle
                    cx={px}
                    cy={py}
                    r="4"
                    fill="#ff2a5f"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                  <text
                    x={px + 8}
                    y={py + 3}
                    fill="#ffffff"
                    fontSize="10"
                    fontFamily="monospace"
                    className="pointer-events-none drop-shadow-md font-semibold"
                  >
                    {s.name}
                  </text>
                </g>
              );
            })}

            {/* 5. CWC River Gauge Stations */}
            {activeLayers.cwcGauges && advisoriesData?.river_gauges?.map((g, i) => {
              // Offset based on index
              const approxLon = center[1] + (i * 0.15 - 0.2);
              const approxLat = center[0] + (i * 0.08 - 0.1);
              const [px, py] = projectCoord(approxLon, approxLat, dims.width, dims.height);
              const isDanger = g.current_level_m > g.danger_level_m;

              return (
                <g key={`cwc-${i}`} className="pointer-events-auto cursor-pointer">
                  <polygon
                    points={`${px},${py - 6} ${px + 6},${py} ${px},${py + 6} ${px - 6},${py}`}
                    fill={isDanger ? "#ff2a5f" : "#00ff88"}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <text
                    x={px + 9}
                    y={py + 3}
                    fill={isDanger ? "#ff2a5f" : "#00ff88"}
                    fontSize="9"
                    fontFamily="monospace"
                    className="pointer-events-none drop-shadow font-bold"
                  >
                    {g.station_name.split(" ")[0]} ({g.current_level_m}m)
                  </text>
                </g>
              );
            })}

            {/* 6. FLOOD ORIGIN & INFLOW PATHWAYS (Active in Origin Tracker Mode) */}
            {activeMapMode === "origin-tracker" && (
              <g className="pointer-events-none">
                <defs>
                  <marker
                    id="flow-arrow"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f0ff" />
                  </marker>
                  <marker
                    id="flow-arrow-amber"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#ffb703" />
                  </marker>
                </defs>

                {/* Primary Inflow Vector 1: Upper Siang / Tsangpo */}
                <path
                  d={`M ${dims.width * 0.75} ${dims.height * 0.08} C ${dims.width * 0.65} ${dims.height * 0.25}, ${dims.width * 0.55} ${dims.height * 0.38}, ${dims.width * 0.45} ${dims.height * 0.48}`}
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  markerEnd="url(#flow-arrow)"
                  className="animate-pulse"
                />
                <circle cx={dims.width * 0.75} cy={dims.height * 0.08} r="6" fill="#00f0ff" />
                <text
                  x={dims.width * 0.75 + 10}
                  y={dims.height * 0.08 + 4}
                  fill="#00f0ff"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  [INFLOW] Tsangpo / Siang Glacial Surge
                </text>

                {/* Inflow Vector 2: Meghalaya / Southern Escarpment */}
                <path
                  d={`M ${dims.width * 0.2} ${dims.height * 0.88} C ${dims.width * 0.28} ${dims.height * 0.75}, ${dims.width * 0.38} ${dims.height * 0.62}, ${dims.width * 0.45} ${dims.height * 0.52}`}
                  fill="none"
                  stroke="#ffb703"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  markerEnd="url(#flow-arrow-amber)"
                  className="animate-pulse"
                />
                <circle cx={dims.width * 0.2} cy={dims.height * 0.88} r="6" fill="#ffb703" />
                <text
                  x={dims.width * 0.2 + 10}
                  y={dims.height * 0.88 + 4}
                  fill="#ffb703"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  [INFLOW] Cherrapunji / Barak Cloudburst
                </text>

                {/* Inflow Vector 3: Embankment Breach Point */}
                <circle cx={dims.width * 0.48} cy={dims.height * 0.5} r="16" fill="rgba(255, 0, 60, 0.25)" stroke="#ff003c" strokeWidth="2" className="animate-ping" />
                <text
                  x={dims.width * 0.48 + 20}
                  y={dims.height * 0.5 + 4}
                  fill="#ff003c"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  ⚠ CRITICAL DYKE BREACH ZONE
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Swipe Slider Controller */}
      {viewMode === "swipe" && <SwipeSlider containerRef={containerRef} />}

      {/* Flood Inflow & Origin Tracker Drawer */}
      <FloodOriginTracker />

      {/* ========================================================================= */}
      {/* FLOOD POLYGON INSPECTOR POPUP (ON-CLICK HUD)                              */}
      {/* ========================================================================= */}
      {selectedFeature && (
        <div className="absolute top-20 right-4 z-30 w-80 rounded-lg bg-tactical-950/95 backdrop-blur-md border border-tactical-cyan/60 p-4 shadow-glow-cyan text-xs font-mono animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-tactical-cyan" />
              <span className="font-bold text-slate-100">{selectedFeature.feature_id}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                selectedFeature.severity === "CRITICAL"
                  ? "bg-tactical-crimson/20 text-tactical-crimson border border-tactical-crimson/50"
                  : "bg-tactical-amber/20 text-tactical-amber border border-tactical-amber/50"
              }`}>
                {selectedFeature.severity}
              </span>
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-2.5 space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Flooded Extent:</span>
              <span className="font-bold text-tactical-cyan">{selectedFeature.area_sqkm} km²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Depth:</span>
              <span className="text-slate-200">{selectedFeature.estimated_depth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dominant Land Cover:</span>
              <span className="text-tactical-amber">{selectedFeature.dominant_landcover}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SAR Anomaly Δσ⁰:</span>
              <span className="text-blue-400 font-bold">{selectedFeature.radar_backscatter_anomaly_db} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ResUNet Confidence:</span>
              <span className="text-tactical-emerald font-bold">
                {Math.round(selectedFeature.mean_confidence * 100)}%
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Sensor: {selectedFeature.satellite_sensor}</span>
            <span>Pol: {selectedFeature.polarization}</span>
          </div>
        </div>
      )}
    </div>
  );
};
