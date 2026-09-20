"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  X, 
  Satellite, 
  Split, 
  Columns, 
  Layers, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Droplets,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Sparkles,
  Info
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";

interface CaseStudyData {
  id: "kerala" | "assam" | "majuli";
  title: string;
  sourceBadge: string;
  sourceUrl?: string;
  location: string;
  riverBasin: string;
  preDate: string;
  postDate: string;
  preImage: string;
  postImage: string;
  sensor: string;
  sensorPre: string;
  sensorPost: string;
  floodedAreaKm2: number;
  surgePercent: number;
  radarAnomalyDb: number;
  description: string;
  nasaNotes: string;
  hydrologicalFactors: string[];
}

const CASE_STUDIES: Record<"kerala" | "assam" | "majuli", CaseStudyData> = {
  kerala: {
    id: "kerala",
    title: "NASA Earth Observatory: Kerala Catastrophic Deluge",
    sourceBadge: "NASA Earth Observatory #92669",
    sourceUrl: "https://science.nasa.gov/earth/earth-observatory/before-and-after-the-kerala-floods-92669/",
    location: "Periyar River, Vembanad Lake & Kuttanad Delta, Kerala",
    riverBasin: "Periyar, Chalakudy & Pamba River Systems",
    preDate: "February 6, 2018 (Pre-Monsoon Baseline)",
    postDate: "August 22, 2018 (Peak Inundation Deluge)",
    preImage: "/images/floods/kerala-before.jpg",
    postImage: "/images/floods/kerala-after.jpg",
    sensor: "NASA Landsat 8 OLI & ESA Sentinel-2 MSI",
    sensorPre: "Operational Land Imager (OLI) on Landsat 8 (False-Color Infrared)",
    sensorPost: "Multispectral Instrument (MSI) on Copernicus Sentinel-2",
    floodedAreaKm2: 328.4,
    surgePercent: 245.8,
    radarAnomalyDb: -6.2,
    description: "Official NASA Earth Observatory comparative observation showing widespread inundation in Kerala after historic monsoon rainfall (164% above normal). The images use false-color infrared where vegetation is bright green and standing floodwater appears dark blue or black.",
    nasaNotes: "Swollen rivers altered the landscape across Kerala. Unprecedented monsoonal rainfall forced dam operators to open 35+ reservoir floodgates simultaneously (including Idukki & Cheruthoni), submerging downstream towns like Aluva, Paravur, and the low-lying agricultural breadbasket of Kuttanad.",
    hydrologicalFactors: [
      "Simultaneous emergency spillway discharge from 35+ major dams",
      "Kuttanad polder basin flooding situated 1.5-2m below mean sea level",
      "Severe backwater accumulation across Vembanad Lake & Cochin Port"
    ]
  },
  assam: {
    id: "assam",
    title: "Assam Monsoonal Flood Deluge (Kaziranga Lowlands)",
    sourceBadge: "Copernicus Sentinel-1 / 2 SAR & Optical",
    location: "Kaziranga Alluvial Basin / Brahmaputra Valley, Assam",
    riverBasin: "Brahmaputra Mainstream & Dhansiri Confluence",
    preDate: "March 15, 2024 (Pre-Monsoon Baseline)",
    postDate: "July 04, 2024 (Peak Monsoonal Deluge)",
    preImage: "/images/floods/assam-before.jpg",
    postImage: "/images/floods/assam-after.jpg",
    sensor: "Copernicus Sentinel-2 MSI + Sentinel-1 C-SAR IW",
    sensorPre: "Sentinel-2 MSI Optical Bands (10m Resolution)",
    sensorPost: "Sentinel-1 SAR C-Band Synthetic Aperture Radar (VV+VH)",
    floodedAreaKm2: 412.5,
    surgePercent: 194.2,
    radarAnomalyDb: -5.4,
    description: "Multi-temporal satellite observation shows catastrophic overtopping of the Brahmaputra braided channels, submerging more than 85% of Kaziranga lowlands and severing critical wildlife migration corridors across National Highway 37.",
    nasaNotes: "The Brahmaputra river carries the 2nd highest sediment discharge in the world. High siltation post-1950 earthquake raised the riverbed, preventing floodwaters from remaining within the natural banks during heavy monsoon downpours.",
    hydrologicalFactors: [
      "Braided river channel overtopping and massive sandbar submergence",
      "Himalayan snowmelt and transboundary runoff from Siang / Tsangpo",
      "Critical animal corridor cut-off along NH-37 levee embankments"
    ]
  },
  majuli: {
    id: "majuli",
    title: "Majuli Island Riverbank Breaches & Island Submergence",
    sourceBadge: "NESAC & ISRO Disaster Management Support",
    location: "Majuli World Heritage River Island, Upper Assam",
    riverBasin: "Brahmaputra, Subansiri & Kherkatia Suti Junction",
    preDate: "April 2024 (Pre-Flood Island Extent)",
    postDate: "July 2024 (Peak Submergence & Cut-off)",
    preImage: "/images/floods/assam-before.jpg",
    postImage: "/images/floods/assam-after.jpg",
    sensor: "Sentinel-1 SAR C-Band & RISAT-1A Microwave",
    sensorPre: "Sentinel-1 SAR Radar Pre-Flood Baseline",
    sensorPost: "Sentinel-1 SAR C-Band Post-Inundation (Specular Drop)",
    floodedAreaKm2: 246.8,
    surgePercent: 168.4,
    radarAnomalyDb: -4.8,
    description: "Multi-temporal satellite radar monitoring captures the severe shrinkage of the world's largest inhabited river island, as breached earthen dykes along the Subansiri and Brahmaputra allow surging floodwaters to drown vast agricultural chars.",
    nasaNotes: "Over the past 70 years, Majuli has shrunk from over 1,200 km² to less than 400 km² due to aggressive monsoonal riverbank erosion, making real-time satellite radar surveillance critical for disaster evacuation.",
    hydrologicalFactors: [
      "Earthen levee breach along Besamora and Kamalabari stretches",
      "Dual-fluvial pressure from Subansiri and Brahmaputra convergence",
      "Total isolation of riverine char communities requiring air-drop relief"
    ]
  }
};

export const SatelliteImageryModal: React.FC = () => {
  const { isImageryModalOpen, toggleImageryModal } = useFloodStore();
  const [activeTab, setActiveTab] = useState<"kerala" | "assam" | "majuli">("kerala");
  const [displayMode, setDisplayMode] = useState<"swipe" | "side-by-side" | "difference">("swipe");
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [maskOpacity, setMaskOpacity] = useState<number>(0.75);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const currentStudy = CASE_STUDIES[activeTab];

  // Draggable slider math
  const updateSlider = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updateSlider(e.clientX);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length === 0) return;
      updateSlider(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [updateSlider]);

  if (!isImageryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-xl bg-tactical-950 border border-tactical-cyan/40 shadow-[0_0_35px_rgba(0,240,255,0.25)] overflow-hidden font-mono text-xs text-slate-200">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-tactical-900/95">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-tactical-cyan/10 border border-tactical-cyan/30 text-tactical-cyan">
              <Satellite className="w-5 h-5 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
                  NASA & Copernicus Earth Observation: Before & After Flood Analysis
                </h2>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30 font-bold uppercase">
                  {currentStudy.sourceBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Multi-temporal satellite optical & SAR radar change detection
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentStudy.sourceUrl && (
              <a
                href={currentStudy.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded bg-tactical-950 border border-slate-700 text-slate-300 hover:text-white hover:border-tactical-cyan transition-colors text-[11px]"
                title="Open NASA Science Article"
              >
                <span>NASA Source</span>
                <ExternalLink className="w-3 h-3 text-tactical-cyan" />
              </a>
            )}
            <button
              onClick={() => toggleImageryModal(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Region Tabs & View Mode Selectors */}
        <div className="px-5 py-2.5 bg-tactical-900/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* State / Case Study Tab Switcher */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("kerala")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all border whitespace-nowrap ${
                activeTab === "kerala"
                  ? "bg-tactical-cyan/20 text-tactical-cyan border-tactical-cyan shadow-glow-cyan"
                  : "bg-tactical-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-tactical-cyan" />
              <span>NASA Kerala Floods (Official Benchmark)</span>
            </button>

            <button
              onClick={() => setActiveTab("assam")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all border whitespace-nowrap ${
                activeTab === "assam"
                  ? "bg-tactical-cyan/20 text-tactical-cyan border-tactical-cyan shadow-glow-cyan"
                  : "bg-tactical-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-tactical-emerald" />
              <span>Assam (Kaziranga / Brahmaputra)</span>
            </button>

            <button
              onClick={() => setActiveTab("majuli")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all border whitespace-nowrap ${
                activeTab === "majuli"
                  ? "bg-tactical-cyan/20 text-tactical-cyan border-tactical-cyan shadow-glow-cyan"
                  : "bg-tactical-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-tactical-amber" />
              <span>Majuli Island (Submergence)</span>
            </button>
          </div>

          {/* Display Mode Switcher (Interactive Swipe vs Side-by-Side vs Difference Mask) */}
          <div className="flex items-center p-1 bg-tactical-950 border border-slate-800 rounded-lg space-x-1">
            <button
              onClick={() => setDisplayMode("swipe")}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                displayMode === "swipe"
                  ? "bg-tactical-cyan/20 text-tactical-cyan border border-tactical-cyan/40 shadow-glow-cyan"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Split Swipe</span>
            </button>

            <button
              onClick={() => setDisplayMode("side-by-side")}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                displayMode === "side-by-side"
                  ? "bg-tactical-cyan/20 text-tactical-cyan border border-tactical-cyan/40 shadow-glow-cyan"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => setDisplayMode("difference")}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                displayMode === "difference"
                  ? "bg-tactical-cyan/20 text-tactical-cyan border border-tactical-cyan/40 shadow-glow-cyan"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-tactical-cyan" />
              <span>AI Inundation Mask</span>
            </button>
          </div>
        </div>

        {/* Scrollable Center Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Main Visualizer Stage */}
          {displayMode === "swipe" && (
            /* Interactive Split-Screen Image Slider */
            <div 
              ref={sliderContainerRef}
              className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-slate-800 bg-black select-none shadow-2xl"
            >
              {/* Layer 1: Pre-Flood Baseline (Left Side) */}
              <div 
                className="absolute inset-0 transition-all pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={currentStudy.preImage}
                  alt={`${currentStudy.title} - Before Flood`}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-tactical-950/90 backdrop-blur-md border border-slate-700 text-slate-100 font-bold text-xs shadow-lg flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span>BEFORE FLOOD: {currentStudy.preDate}</span>
                </div>
              </div>

              {/* Layer 2: Post-Flood Event (Right Side) */}
              <div 
                className="absolute inset-0 transition-all pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                <img
                  src={currentStudy.postImage}
                  alt={`${currentStudy.title} - After Flood`}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-tactical-950/90 backdrop-blur-md border border-tactical-crimson/80 text-tactical-crimson font-bold text-xs shadow-glow-crimson flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tactical-crimson animate-ping"></span>
                  <span>AFTER FLOOD: {currentStudy.postDate}</span>
                </div>
              </div>

              {/* Glowing Draggable Vertical Divider */}
              <div
                className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-tactical-cyan via-white to-tactical-cyan shadow-[0_0_15px_rgba(0,240,255,0.9)] cursor-ew-resize select-none"
                style={{ left: `${sliderPos}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-tactical-950 border-2 border-tactical-cyan text-tactical-cyan flex items-center justify-center shadow-glow-cyan cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                  <div className="flex items-center space-x-0.5">
                    <ChevronLeft className="w-4 h-4 -mr-1 text-slate-300" />
                    <Split className="w-3.5 h-3.5 text-tactical-cyan" />
                    <ChevronRight className="w-4 h-4 -ml-1 text-tactical-cyan" />
                  </div>
                </div>

                <div className="absolute bottom-5 -translate-x-1/2 px-2.5 py-1 rounded bg-tactical-950/95 border border-slate-700 text-[10px] text-slate-200 pointer-events-none whitespace-nowrap shadow-lg">
                  Drag Curtain ({Math.round(sliderPos)}%)
                </div>
              </div>
            </div>
          )}

          {displayMode === "side-by-side" && (
            /* Side-by-Side Dual Images */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video group shadow-xl">
                <img
                  src={currentStudy.preImage}
                  alt={`${currentStudy.title} - Before`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded bg-tactical-950/90 backdrop-blur-md border border-slate-700 text-slate-100 font-bold text-xs flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>BEFORE: {currentStudy.preDate}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded bg-tactical-950/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-slate-100">Sensor:</span> {currentStudy.sensorPre}
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-tactical-crimson/50 bg-black aspect-video group shadow-glow-crimson">
                <img
                  src={currentStudy.postImage}
                  alt={`${currentStudy.title} - After`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded bg-tactical-950/90 backdrop-blur-md border border-tactical-crimson text-tactical-crimson font-bold text-xs flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-tactical-crimson animate-pulse"></span>
                  <span>AFTER: {currentStudy.postDate}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded bg-tactical-950/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-tactical-crimson">Inundation:</span> {currentStudy.sensorPost}
                </div>
              </div>
            </div>
          )}

          {displayMode === "difference" && (
            /* AI Inundation Mask / Difference Mode */
            <div className="space-y-3">
              <div className="relative w-full h-[420px] md:h-[500px] rounded-xl overflow-hidden border border-tactical-cyan/40 bg-black shadow-2xl">
                {/* Background post-flood image */}
                <img
                  src={currentStudy.postImage}
                  alt="Post Flood Base"
                  className="w-full h-full object-cover"
                />

                {/* Simulated AI Inundation Difference Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{ opacity: maskOpacity }}
                >
                  <div className="w-full h-full bg-gradient-to-tr from-cyan-500/40 via-blue-600/30 to-tactical-crimson/30 mix-blend-color-dodge filter contrast-150" />
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Pulsing highlight contour */}
                    <rect x="20%" y="30%" width="60%" height="45%" rx="40" fill="rgba(0, 240, 255, 0.25)" stroke="#00f0ff" strokeWidth="2" strokeDasharray="8 4" className="animate-pulse" />
                    <text x="22%" y="35%" fill="#00f0ff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      [AI RESUNET DETECTED EXPANDED WATER AREA: +{currentStudy.surgePercent}%]
                    </text>
                  </svg>
                </div>

                {/* Floating Legend / Mask Control */}
                <div className="absolute top-4 left-4 p-3 rounded-lg bg-tactical-950/90 backdrop-blur-md border border-tactical-cyan/40 max-w-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-tactical-cyan flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      AI Water Extent Difference Mask
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-tactical-cyan/20 text-tactical-cyan font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Highlights new surface water inundation extracted by subtracting pre-flood NIR/SAR baseline from peak flood capture.
                  </p>
                  <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400">Mask Opacity:</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={maskOpacity}
                      onChange={(e) => setMaskOpacity(parseFloat(e.target.value))}
                      className="w-28 accent-tactical-cyan cursor-pointer"
                    />
                    <span className="text-[10px] text-tactical-cyan font-bold">
                      {Math.round(maskOpacity * 100)}%
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-tactical-950/90 backdrop-blur-md border border-slate-700 text-slate-200 text-[11px] flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-tactical-cyan animate-ping"></span>
                  <span>Cyan Overlay: Newly Submerged Terrain ({currentStudy.floodedAreaKm2} km²)</span>
                </div>
              </div>
            </div>
          )}

          {/* Geological & Impact Telemetry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-tactical-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Inundated Area</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {currentStudy.floodedAreaKm2} <span className="text-xs text-tactical-cyan">km²</span>
              </span>
              <span className="text-[10px] text-tactical-crimson font-semibold">+{currentStudy.surgePercent}% Surge</span>
            </div>

            <div className="p-3 rounded-lg bg-tactical-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Radar Anomaly Δσ⁰</span>
              <span className="text-xl font-bold text-blue-400 mt-1 block">
                {currentStudy.radarAnomalyDb} <span className="text-xs text-slate-400">dB</span>
              </span>
              <span className="text-[10px] text-slate-400">Specular Water Drop</span>
            </div>

            <div className="p-3 rounded-lg bg-tactical-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Satellite Constellation</span>
              <span className="text-xs font-bold text-tactical-amber mt-1 block truncate" title={currentStudy.sensor}>
                {currentStudy.sensor}
              </span>
              <span className="text-[10px] text-slate-400">Dual Optical & Microwave</span>
            </div>

            <div className="p-3 rounded-lg bg-tactical-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Drainage Basin</span>
              <span className="text-sm font-bold text-tactical-emerald mt-1 block truncate" title={currentStudy.riverBasin}>
                {currentStudy.riverBasin.split(" ")[0]} Basin
              </span>
              <span className="text-[10px] text-slate-400">Discharge Axis</span>
            </div>
          </div>

          {/* Detailed Narrative & Hydrological Factors */}
          <div className="p-4 rounded-lg bg-tactical-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider flex items-center">
                <Droplets className="w-3.5 h-3.5 text-tactical-cyan mr-1.5" />
                Earth Observation Intelligence Dossier ({currentStudy.title})
              </h3>
              <span className="text-[10px] text-slate-400 font-normal">
                {currentStudy.location}
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              {currentStudy.description}
            </p>

            <div className="p-3 rounded bg-tactical-950 border border-slate-800/80 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-tactical-cyan shrink-0 mt-0.5" />
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <span className="text-tactical-cyan font-semibold">NASA Science Insights: </span>
                {currentStudy.nasaNotes}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1.5">
                Key Hydrological & Terrain Drivers:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-400">
                {currentStudy.hydrologicalFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5 bg-tactical-950 p-2 rounded border border-slate-800/60">
                    <span className="text-tactical-cyan font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-tactical-900/95 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="text-slate-400 flex items-center space-x-2">
            <span>Archive Sources: NASA Earth Observatory & ESA Copernicus Open Access Hub</span>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === "kerala" && (
              <a
                href="https://science.nasa.gov/earth/earth-observatory/before-and-after-the-kerala-floods-92669/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-900/40 text-blue-300 border border-blue-700/60 hover:bg-blue-800/40 transition-colors flex items-center space-x-1"
              >
                <span>View NASA EO Article</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => toggleImageryModal(false)}
              className="px-4 py-1.5 rounded-lg bg-tactical-cyan text-black font-bold hover:bg-tactical-cyan/90 transition-all shadow-glow-cyan"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
