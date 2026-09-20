"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Satellite,
  ExternalLink,
  Droplets,
  AlertTriangle,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Compass,
  CheckCircle2,
  Globe2,
  ZoomIn
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";

export interface IndiaFloodLocation {
  id: string;
  name: string;
  state: string;
  region: "Northeast" | "Northern" | "Eastern" | "Southern" | "Western";
  floodedAreaKm2: number;
  coordinates: [number, number]; // [xPct, yPct] relative to India SVG bounding box
  geoCoords: [number, number]; // [lat, lon]
  riverBasin: string;
  sensor: string;
  observationDate: string;
  severity: "CRITICAL" | "SEVERE" | "MODERATE";
  radarAnomalyDb: number;
  populationImpacted: string;
  externalLink: {
    label: string;
    url: string;
    agency: string;
  };
  details: string;
}

export const INDIA_FLOOD_LOCATIONS: IndiaFloodLocation[] = [
  {
    id: "assam-kaziranga",
    name: "Kaziranga & Brahmaputra Valley",
    state: "Assam",
    region: "Northeast",
    floodedAreaKm2: 412.5,
    coordinates: [79.5, 34.5],
    geoCoords: [26.5775, 93.1711],
    riverBasin: "Brahmaputra Mainstem & Dhansiri",
    sensor: "Copernicus Sentinel-1 C-SAR IW + Sentinel-2 MSI",
    observationDate: "July 2024 (Peak Monsoon)",
    severity: "CRITICAL",
    radarAnomalyDb: -5.4,
    populationImpacted: "1,240,000 across 18 districts",
    externalLink: {
      label: "ISRO Bhuvan Disaster Services",
      url: "https://bhuvan-app1.nrsc.gov.in/disaster/disaster.php?id=flood",
      agency: "ISRO / NESAC"
    },
    details: "Over 85% of Kaziranga National Park inundated by braided channel overtopping, with high siltation choking natural drainage corridors."
  },
  {
    id: "kerala-periyar",
    name: "Periyar River & Kuttanad Basin",
    state: "Kerala",
    region: "Southern",
    floodedAreaKm2: 328.4,
    coordinates: [37.2, 83.5],
    geoCoords: [10.1076, 76.3516],
    riverBasin: "Periyar, Chalakudy & Pamba Basins",
    sensor: "NASA Landsat 8 OLI & Copernicus Sentinel-2",
    observationDate: "August 2018 (Great Kerala Deluge)",
    severity: "CRITICAL",
    radarAnomalyDb: -6.2,
    populationImpacted: "5,400,000 across 14 districts",
    externalLink: {
      label: "NASA Earth Observatory Article #92669",
      url: "https://science.nasa.gov/earth/earth-observatory/before-and-after-the-kerala-floods-92669/",
      agency: "NASA Science"
    },
    details: "Historic deluge caused by 164% above-normal monsoon rainfall and emergency shutter openings of 35+ major dams across Western Ghats."
  },
  {
    id: "bihar-kosi",
    name: "Kosi & Bagmati Floodplains",
    state: "Bihar",
    region: "Northern",
    floodedAreaKm2: 586.2,
    coordinates: [63.5, 37.8],
    geoCoords: [25.5941, 86.8524],
    riverBasin: "Kosi ('Sorrow of Bihar') & Middle Ganga",
    sensor: "Sentinel-1 SAR C-Band + RISAT-1A Microwave",
    observationDate: "August 2024",
    severity: "CRITICAL",
    radarAnomalyDb: -5.8,
    populationImpacted: "2,150,000 in Supaul, Saharsa, Khagaria",
    externalLink: {
      label: "CWC Flood Forecast & Satellite Telemetry",
      url: "https://ffs.india-water.gov.in/",
      agency: "Central Water Commission"
    },
    details: "Massive Himalayan runoff through Nepal barrages discharging over 450,000 cusecs, overtopping embankment bunds across northern alluvial plains."
  },
  {
    id: "arunachal-siang",
    name: "Siang Gorge & Pasighat Basin",
    state: "Arunachal Pradesh",
    region: "Northeast",
    floodedAreaKm2: 168.0,
    coordinates: [83.8, 27.2],
    geoCoords: [28.0668, 95.3267],
    riverBasin: "Upper Siang (Yarlung Tsangpo Confluence)",
    sensor: "Copernicus Sentinel-1 SAR IW (VV/VH)",
    observationDate: "June 2024",
    severity: "SEVERE",
    radarAnomalyDb: -4.9,
    populationImpacted: "185,000 along foothills",
    externalLink: {
      label: "NESAC North East Space Applications Centre",
      url: "https://nesac.gov.in/",
      agency: "DOS / ISRO"
    },
    details: "Torrential glacial melt and Namcha Barwa mountain canyon surges funneled down steep 2,850m gradient into Pasighat alluvial fans."
  },
  {
    id: "west-bengal-teesta",
    name: "Teesta & Jalpaiguri Floodplain",
    state: "West Bengal",
    region: "Eastern",
    floodedAreaKm2: 294.7,
    coordinates: [70.5, 35.8],
    geoCoords: [26.5414, 88.7199],
    riverBasin: "Teesta & Jaldhaka River Basins",
    sensor: "Sentinel-1 C-SAR & Sentinel-2 Optical",
    observationDate: "July 2024",
    severity: "SEVERE",
    radarAnomalyDb: -4.5,
    populationImpacted: "620,000 in Jalpaiguri & Cooch Behar",
    externalLink: {
      label: "Copernicus Browser Data Space",
      url: "https://browser.dataspace.copernicus.eu/",
      agency: "ESA Copernicus"
    },
    details: "Sikkim glacial lake outburst flood (GLOF) residue coupled with sub-Himalayan cloudbursts inundating downstream tea gardens and settlements."
  },
  {
    id: "odisha-mahanadi",
    name: "Mahanadi Delta & Puri Lowlands",
    state: "Odisha",
    region: "Eastern",
    floodedAreaKm2: 215.3,
    coordinates: [61.2, 53.4],
    geoCoords: [20.2961, 85.8245],
    riverBasin: "Mahanadi & Baitarani Deltas",
    sensor: "Sentinel-1 SAR C-Band Specular Reflection",
    observationDate: "September 2024",
    severity: "MODERATE",
    radarAnomalyDb: -3.8,
    populationImpacted: "480,000 in Kendrapara & Jagatsinghpur",
    externalLink: {
      label: "NASA Worldview Satellite Earth Data",
      url: "https://worldview.earthdata.nasa.gov/",
      agency: "NASA EOSDIS"
    },
    details: "Hirakud dam spillway releases meeting high astronomical tides at Bay of Bengal, creating slow-draining coastal backwater inundation."
  },
  {
    id: "gujarat-narmada",
    name: "Lower Narmada & Bharuch Estuary",
    state: "Gujarat",
    region: "Western",
    floodedAreaKm2: 182.9,
    coordinates: [31.5, 50.8],
    geoCoords: [21.7051, 72.9959],
    riverBasin: "Narmada River & Gulf of Khambhat",
    sensor: "Sentinel-2 MSI Optical & Landsat 9",
    observationDate: "September 2023",
    severity: "MODERATE",
    radarAnomalyDb: -3.5,
    populationImpacted: "320,000 in Bharuch & Ankleshwar",
    externalLink: {
      label: "Copernicus Emergency Management Service",
      url: "https://emergency.copernicus.eu/",
      agency: "EMS / EU"
    },
    details: "Sardar Sarovar dam floodgate discharge exceeding 1.8 million cusecs submerging industrial belts and agricultural orchards."
  }
];

export const IndiaFloodMapModal: React.FC = () => {
  const {
    isIndiaMapOpen,
    toggleIndiaMap,
    setSelectedState,
    setSelectedDistrict
  } = useFloodStore();

  const [selectedHotspot, setSelectedHotspot] = useState<IndiaFloodLocation>(
    INDIA_FLOOD_LOCATIONS[0]
  );
  const [filterRegion, setFilterRegion] = useState<string>("ALL");

  if (!isIndiaMapOpen) return null;

  const filteredLocations =
    filterRegion === "ALL"
      ? INDIA_FLOOD_LOCATIONS
      : INDIA_FLOOD_LOCATIONS.filter((l) => l.region === filterRegion);

  const totalFloodedAreaKm2 = INDIA_FLOOD_LOCATIONS.reduce(
    (acc, curr) => acc + curr.floodedAreaKm2,
    0
  );

  const handleInspectLocation = (loc: IndiaFloodLocation) => {
    setSelectedState(loc.state);
    if (loc.state === "Assam") {
      setSelectedDistrict("Kaziranga / Golaghat");
    } else if (loc.state === "Kerala") {
      setSelectedDistrict("Ernakulam / Aluva (Periyar)");
    }
    toggleIndiaMap(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-xl bg-tactical-950 border border-tactical-cyan/40 shadow-[0_0_40px_rgba(0,240,255,0.3)] overflow-hidden font-mono text-xs text-slate-200">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-tactical-900/95">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-tactical-cyan/15 border border-tactical-cyan/40 text-tactical-cyan shadow-glow-cyan">
              <Globe2 className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
                  All-India Satellite Flood Extent & Location Map
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-tactical-cyan/20 text-tactical-cyan font-bold border border-tactical-cyan/40">
                  NATIONAL SATELLITE SURVEILLANCE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Satellite radar & optical surveillance showing active flooded area coordinates across India
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleIndiaMap(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* National Stats & Regional Filter Toolbar */}
        <div className="px-5 py-2.5 bg-tactical-900/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Total Detected Flooded Area:</span>
              <span className="font-bold text-tactical-cyan text-sm">
                {totalFloodedAreaKm2.toFixed(1)} km²
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Monitored Hotspots:</span>
              <span className="font-bold text-white">
                {INDIA_FLOOD_LOCATIONS.length} Major Basins
              </span>
            </div>
          </div>

          {/* Regional Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "Northeast", "Northern", "Eastern", "Southern", "Western"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRegion(r)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                  filterRegion === r
                    ? "bg-tactical-cyan/20 text-tactical-cyan border-tactical-cyan shadow-glow-cyan"
                    : "bg-tactical-950 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {r === "ALL" ? "All India" : r}
              </button>
            ))}
          </div>
        </div>

        {/* Main Body: Grid with Map on Left, Detailed Telemetry on Right */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left: Interactive India SVG Vector Map (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="relative flex-1 min-h-[420px] max-h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-[#060a12] shadow-2xl flex items-center justify-center p-4">
              
              {/* Tactical Radar Grid Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                  <pattern id="india-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f0ff" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#india-grid)" />
              </svg>

              {/* High-Fidelity SVG Outline of India */}
              <svg
                viewBox="0 0 500 550"
                className="w-full h-full max-w-[460px] max-h-[500px] drop-shadow-[0_0_25px_rgba(0,240,255,0.15)]"
              >
                <defs>
                  <radialGradient id="land-grad" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#0f1f38" />
                    <stop offset="100%" stopColor="#08101e" />
                  </radialGradient>
                  <filter id="glow-marker" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* India Map Outline Polygon Path */}
                <path
                  d="
                    M 180 40
                    L 210 25 L 235 38 L 245 65 L 230 85 L 240 110
                    L 280 135 L 320 145 L 375 140 L 400 130
                    L 435 135 L 450 160 L 430 180 L 405 185
                    L 395 210 L 370 215 L 350 190 L 325 195
                    L 315 220 L 330 240 L 345 280 L 315 300
                    L 290 350 L 255 420 L 225 480 L 205 520
                    L 190 480 L 175 420 L 160 360 L 140 310
                    L 115 270 L 125 240 L 95 235 L 80 260
                    L 65 240 L 90 200 L 120 185 L 140 140
                    L 165 95 Z
                  "
                  fill="url(#land-grad)"
                  stroke="#00f0ff"
                  strokeWidth="1.8"
                  strokeOpacity="0.6"
                  strokeDasharray="4 1"
                />

                {/* Major River Flow Paths (Brahmaputra, Ganga, Periyar, Narmada, Mahanadi) */}
                {/* Brahmaputra River Vector */}
                <path
                  d="M 440 145 C 410 155, 375 155, 345 190"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  className="animate-pulse"
                />
                {/* Ganga River Vector */}
                <path
                  d="M 230 110 C 270 140, 310 170, 335 225"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeOpacity="0.7"
                />
                {/* Narmada River Vector */}
                <path
                  d="M 250 250 C 200 255, 160 260, 125 265"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeOpacity="0.7"
                />
                {/* Mahanadi River Vector */}
                <path
                  d="M 275 280 C 300 290, 320 295, 335 305"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeOpacity="0.7"
                />
                {/* Periyar River Vector (Kerala) */}
                <path
                  d="M 205 460 C 195 475, 195 490, 190 500"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />

                {/* Hotspot Markers */}
                {filteredLocations.map((loc) => {
                  const [px, py] = [
                    (loc.coordinates[0] / 100) * 500,
                    (loc.coordinates[1] / 100) * 550
                  ];
                  const isSelected = selectedHotspot.id === loc.id;
                  const isCritical = loc.severity === "CRITICAL";

                  return (
                    <g
                      key={loc.id}
                      onClick={() => setSelectedHotspot(loc)}
                      className="cursor-pointer group"
                    >
                      {/* Pulsing Outer Radar Circle */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isSelected ? 18 : 12}
                        fill={isCritical ? "rgba(255, 0, 60, 0.25)" : "rgba(0, 240, 255, 0.2)"}
                        stroke={isCritical ? "#ff003c" : "#00f0ff"}
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                        className="animate-ping"
                      />

                      {/* Main Node Circle */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isSelected ? 8 : 6}
                        fill={isCritical ? "#ff003c" : "#00f0ff"}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        filter="url(#glow-marker)"
                      />

                      {/* Flooded Area Badge on Map */}
                      <rect
                        x={px + 10}
                        y={py - 12}
                        width={loc.name.length * 6 + 45}
                        height="18"
                        rx="4"
                        fill="rgba(3, 7, 18, 0.85)"
                        stroke={isSelected ? "#00f0ff" : "#334155"}
                        strokeWidth="1"
                      />
                      <text
                        x={px + 14}
                        y={py}
                        fill={isSelected ? "#00f0ff" : "#ffffff"}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {loc.name.split(" ")[0]} ({loc.floodedAreaKm2}km²)
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Map View Indicator */}
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-tactical-950/90 backdrop-blur-md border border-slate-800 text-[10px] text-slate-400">
                <span>Click any pulsing hotspot to inspect satellite flooded area</span>
              </div>
            </div>

            {/* Quick Hotspot Select Row */}
            <div className="flex items-center space-x-2 overflow-x-auto p-2 bg-tactical-900/60 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">
                Hotspots:
              </span>
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedHotspot(loc)}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-all whitespace-nowrap ${
                    selectedHotspot.id === loc.id
                      ? "bg-tactical-cyan/20 text-tactical-cyan border-tactical-cyan"
                      : "bg-tactical-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  {loc.name.split(" ")[0]} ({loc.state})
                </button>
              ))}
            </div>
          </div>

          {/* Right: Satellite Analysis, Inundated Area Metrics & Direct External Link (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Selected Location Card */}
            <div className="p-4 rounded-lg bg-tactical-900 border border-tactical-cyan/40 space-y-3 shadow-glow-cyan">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-tactical-cyan/20 text-tactical-cyan font-bold border border-tactical-cyan/30">
                  {selectedHotspot.state.toUpperCase()} • {selectedHotspot.region.toUpperCase()}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    selectedHotspot.severity === "CRITICAL"
                      ? "bg-tactical-crimson/20 text-tactical-crimson border border-tactical-crimson/40 animate-pulse"
                      : "bg-tactical-amber/20 text-tactical-amber border border-tactical-amber/40"
                  }`}
                >
                  {selectedHotspot.severity} FLOOD
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedHotspot.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  River Basin: <span className="text-tactical-cyan">{selectedHotspot.riverBasin}</span>
                </p>
              </div>

              {/* Area & Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div className="p-2.5 rounded bg-tactical-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">
                    Detected Flooded Area
                  </span>
                  <span className="text-xl font-bold text-tactical-cyan">
                    {selectedHotspot.floodedAreaKm2} <span className="text-xs">km²</span>
                  </span>
                </div>

                <div className="p-2.5 rounded bg-tactical-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">
                    Radar Anomaly Δσ⁰
                  </span>
                  <span className="text-xl font-bold text-blue-400">
                    {selectedHotspot.radarAnomalyDb} <span className="text-xs">dB</span>
                  </span>
                </div>
              </div>

              {/* Satellite Sensor & Date */}
              <div className="space-y-1 text-[11px] bg-tactical-950 p-3 rounded border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Satellite Sensor:</span>
                  <span className="font-bold text-tactical-amber truncate max-w-[200px]" title={selectedHotspot.sensor}>
                    {selectedHotspot.sensor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Observation Date:</span>
                  <span className="text-slate-200">{selectedHotspot.observationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Affected Population:</span>
                  <span className="text-tactical-crimson font-bold">{selectedHotspot.populationImpacted}</span>
                </div>
              </div>

              {/* Scientific Synopsis */}
              <p className="text-[11px] text-slate-300 leading-relaxed bg-tactical-950/60 p-2.5 rounded border border-slate-800/50">
                {selectedHotspot.details}
              </p>
            </div>

            {/* Direct External Satellite Data Links */}
            <div className="p-4 rounded-lg bg-tactical-900 border border-slate-800 space-y-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block flex items-center">
                <Satellite className="w-3.5 h-3.5 text-tactical-cyan mr-1.5" />
                Official Satellite Data Source & Portal Link
              </span>

              {/* Primary Direct Link Button */}
              <a
                href={selectedHotspot.externalLink.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-tactical-cyan/20 to-blue-600/20 border border-tactical-cyan text-tactical-cyan hover:bg-tactical-cyan/30 transition-all font-bold text-xs flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.25)] group"
              >
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-tactical-cyan group-hover:translate-x-0.5 transition-transform" />
                  <span>Open {selectedHotspot.externalLink.label}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-tactical-cyan/30 text-white font-mono">
                  {selectedHotspot.externalLink.agency}
                </span>
              </a>

              {/* Additional National Satellite Portals */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
                <a
                  href="https://science.nasa.gov/earth/earth-observatory/before-and-after-the-kerala-floods-92669/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-tactical-950 border border-slate-800 hover:border-tactical-cyan text-slate-300 flex items-center justify-between"
                >
                  <span>NASA EO Kerala Floods</span>
                  <ArrowUpRight className="w-3 h-3 text-tactical-cyan" />
                </a>

                <a
                  href="https://bhuvan-app1.nrsc.gov.in/disaster/disaster.php?id=flood"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-tactical-950 border border-slate-800 hover:border-tactical-cyan text-slate-300 flex items-center justify-between"
                >
                  <span>ISRO Bhuvan Disaster</span>
                  <ArrowUpRight className="w-3 h-3 text-tactical-cyan" />
                </a>
              </div>
            </div>

            {/* Quick Action: Load into High-Res Regional GIS View */}
            <button
              onClick={() => handleInspectLocation(selectedHotspot)}
              className="w-full py-2.5 rounded-lg bg-tactical-cyan text-black font-bold text-xs hover:bg-tactical-cyan/90 transition-all shadow-glow-cyan flex items-center justify-center space-x-2"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Inspect {selectedHotspot.name.split(" ")[0]} in High-Res GIS View</span>
            </button>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 border-t border-slate-800 bg-tactical-900/95 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            Source Data: Copernicus Open Access Hub, NASA Earth Observatory, and ISRO National Remote Sensing Centre
          </span>
          <button
            onClick={() => toggleIndiaMap(false)}
            className="px-4 py-1.5 rounded-lg bg-tactical-cyan text-black font-bold hover:bg-tactical-cyan/90 transition-all shadow-glow-cyan"
          >
            Close India Map
          </button>
        </div>

      </div>
    </div>
  );
};
