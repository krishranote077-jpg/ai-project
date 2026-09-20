"use client";

import React, { useState } from "react";
import {
  Waves,
  Navigation,
  Compass,
  MapPin,
  AlertTriangle,
  ArrowDownRight,
  Droplets,
  Activity,
  Mountain,
  CloudRain,
  ShieldAlert,
  ChevronRight,
  Info,
  CheckCircle2,
  X
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";

export interface OriginNode {
  id: string;
  name: string;
  category: "HIMALAYAN_GLACIAL" | "OROGRAPHIC_CLOUDBURST" | "RIVERBED_SILTATION" | "EMBANKMENT_BREACH" | "DAM_RELEASE";
  upstreamSource: string;
  riverSystem: string;
  inflowVolumeCumecs: number;
  cwcStation: string;
  dangerMarkMeters: number;
  currentLevelMeters: number;
  status: "CRITICAL_OVERFLOW" | "HIGH_WARNING" | "MODERATE_INUNDATION";
  primaryPathways: string[];
  affectedDistricts: string[];
  scientificMechanism: string;
  elevationDropMeters: number;
}

export const ORIGIN_NODES: OriginNode[] = [
  {
    id: "tsangpo-siang",
    name: "Yarlung Tsangpo / Siang Himalayan Gorge",
    category: "HIMALAYAN_GLACIAL",
    upstreamSource: "Tibetan Plateau Snowmelt & Namcha Barwa Canyon",
    riverSystem: "Upper Brahmaputra (Siang River)",
    inflowVolumeCumecs: 38400,
    cwcStation: "Pasighat Gauge Station (Arunachal/Assam Border)",
    dangerMarkMeters: 153.96,
    currentLevelMeters: 155.42,
    status: "CRITICAL_OVERFLOW",
    primaryPathways: [
      "Tsangpo Gorge (Tibet, 3,200m elev)",
      "Siang Canyon (Arunachal Pradesh)",
      "Pasighat Alluvial Fan Confluence",
      "Upper Assam Floodplains (Dhemaji & Dibrugarh)"
    ],
    affectedDistricts: ["Dhemaji", "Dibrugarh", "Majuli", "Lakhimpur"],
    scientificMechanism: "Violent descent from the Tibetan plateau (over 2,500m elevation drop) funnels massive volumes of glacial melt and heavy monsoon runoff into the flat Brahmaputra valley, where gradient plummets from 1:200 to 1:10,000, causing immediate hydraulic ponding and lateral overtopping.",
    elevationDropMeters: 2850
  },
  {
    id: "meghalaya-cloudburst",
    name: "Meghalaya Southern Escarpment (Cherrapunji)",
    category: "OROGRAPHIC_CLOUDBURST",
    upstreamSource: "Southern Meghalaya Plateau (Mawsynram / Sohra)",
    riverSystem: "Barak Basin & Kopili River",
    inflowVolumeCumecs: 21600,
    cwcStation: "Annapurna Ghat (Silchar, Cachar)",
    dangerMarkMeters: 19.83,
    currentLevelMeters: 21.28,
    status: "CRITICAL_OVERFLOW",
    primaryPathways: [
      "Cherrapunji Escarpment (1,300m elevation)",
      "Shella & Jaintia Steep Gorges",
      "Kopili & Barak Valley Alluvial Flat",
      "Silchar City & Southern Assam Lowlands"
    ],
    affectedDistricts: ["Cachar (Silchar)", "Karimganj", "Hailakandi", "Morigaon"],
    scientificMechanism: "The funnel-shaped topography of the Meghalaya plateau traps southwest monsoon winds, generating the world's most intense orographic precipitation (often >500mm in 24 hours). The runoff plunges down sheer limestone cliffs into the narrow, low-gradient Barak basin, triggering sudden catastrophic flash floods in Silchar.",
    elevationDropMeters: 1250
  },
  {
    id: "brahmaputra-siltation",
    name: "Brahmaputra Aggraded Silt Bed (Kaziranga)",
    category: "RIVERBED_SILTATION",
    upstreamSource: "Seismic Soil Liquefaction & Alluvial Sediments",
    riverSystem: "Central Brahmaputra Mainstem & Dhansiri Confluence",
    inflowVolumeCumecs: 46200,
    cwcStation: "Tezpur Hydrological Station",
    dangerMarkMeters: 65.23,
    currentLevelMeters: 66.45,
    status: "CRITICAL_OVERFLOW",
    primaryPathways: [
      "Braided Channel Network across Golaghat",
      "Dhansiri Confluence Bottleneck",
      "Kaziranga Lowland Floodplain Inundation",
      "NH-37 Highway Animal Corridor Submergence"
    ],
    affectedDistricts: ["Kaziranga / Golaghat", "Nagaon", "Sonitpur", "Biswanath"],
    scientificMechanism: "Following the historic 1950 Great Assam Earthquake (M8.6), massive landslides dumped over 45 billion m³ of sediment into the river. This raised the Brahmaputra riverbed by 2 to 3 meters. Consequently, the river's cross-sectional carrying capacity is lower than the surrounding valley floor, forcing peak monsoon discharge to submerge Kaziranga.",
    elevationDropMeters: 45
  },
  {
    id: "majuli-levee-breach",
    name: "Majuli Subansiri Embankment Failure",
    category: "EMBANKMENT_BREACH",
    upstreamSource: "Subansiri High-Discharge Mountain Runoff",
    riverSystem: "Subansiri & Kherkatia Suti Confluence",
    inflowVolumeCumecs: 18500,
    cwcStation: "Badatighat Gauging Station",
    dangerMarkMeters: 82.53,
    currentLevelMeters: 83.35,
    status: "CRITICAL_OVERFLOW",
    primaryPathways: [
      "Subansiri Himalayan Gorge",
      "Besamora Earthen Levee Breach",
      "Kamalabari Central Island Submergence",
      "Internal Chars & Wetland Retention Zones"
    ],
    affectedDistricts: ["Majuli", "Jorhat", "Lakhimpur"],
    scientificMechanism: "Aging earthen embankments constructed in the 1960s with local alluvial silt experience intense hydraulic scouring and saturation piping. When hydrostatic head exceeds levee integrity, sudden breaches up to 200 meters wide unleash high-velocity flood waves into inhabited rural chars.",
    elevationDropMeters: 120
  },
  {
    id: "bhutan-kurichhu",
    name: "Kurichhu Dam & Bhutan Foothills Discharge",
    category: "DAM_RELEASE",
    upstreamSource: "Royal Government of Bhutan Foothills Catchment",
    riverSystem: "Manas, Beki & Aie River System (Lower Assam)",
    inflowVolumeCumecs: 24800,
    cwcStation: "NH-Crossing Road Gauge, Barpeta",
    dangerMarkMeters: 45.10,
    currentLevelMeters: 45.85,
    status: "HIGH_WARNING",
    primaryPathways: [
      "Kurichhu Dam Reservoir Spillway (Bhutan)",
      "Manas National Park Transboundary Corridor",
      "Beki River Delta Splitting",
      "Barpeta & Baksa Lowland Paddy Inundation"
    ],
    affectedDistricts: ["Barpeta", "Baksa", "Chirang", "Dhubri"],
    scientificMechanism: "During periods of continuous heavy downpours in the Bhutanese Himalayas, hydropower reservoirs reach Full Reservoir Level (FRL) and must open emergency gates. The sudden discharge floods the downstream Beki and Manas rivers, overwhelming Lower Assam's low-capacity drainage channels.",
    elevationDropMeters: 980
  }
];

export const FloodOriginTracker: React.FC = () => {
  const {
    activeMapMode,
    setActiveMapMode,
    selectedOriginNode,
    setSelectedOriginNode,
    setSelectedDistrict
  } = useFloodStore();

  const [activeNodeId, setActiveNodeId] = useState<string>(
    selectedOriginNode || "tsangpo-siang"
  );

  const selectedNode =
    ORIGIN_NODES.find((n) => n.id === activeNodeId) || ORIGIN_NODES[0];

  const handleSelectNode = (node: OriginNode) => {
    setActiveNodeId(node.id);
    setSelectedOriginNode(node.id);
    // Optionally focus on first affected district
    if (node.affectedDistricts.length > 0) {
      setSelectedDistrict(node.affectedDistricts[0]);
    }
  };

  if (activeMapMode !== "origin-tracker") {
    return (
      <button
        onClick={() => setActiveMapMode("origin-tracker")}
        className="absolute top-4 left-4 z-20 px-3.5 py-2 rounded-lg bg-tactical-950/90 backdrop-blur-md border border-tactical-cyan/40 hover:border-tactical-cyan text-tactical-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center space-x-2 text-xs font-mono font-bold transition-all group"
      >
        <Waves className="w-4 h-4 animate-bounce text-tactical-cyan" />
        <span>Where Do Floods Come From? (Origin Tracker)</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-20 w-full max-w-md max-h-[88vh] flex flex-col rounded-xl bg-tactical-950/95 backdrop-blur-xl border border-tactical-cyan/50 shadow-[0_0_30px_rgba(0,240,255,0.25)] overflow-hidden font-mono text-xs text-slate-200 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-tactical-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Waves className="w-4 h-4 text-tactical-cyan animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Flood Inflow & Catchment Origins
            </h3>
            <p className="text-[10px] text-slate-400">
              Tracing North East India hydrological pathways
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveMapMode("surveillance")}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Return to Satellite Surveillance"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Origin Nodes Selector Pills */}
      <div className="p-3 bg-tactical-900/60 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto">
        {ORIGIN_NODES.map((node) => (
          <button
            key={node.id}
            onClick={() => handleSelectNode(node)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap flex items-center space-x-1 ${
              node.id === activeNodeId
                ? "bg-tactical-cyan/20 text-tactical-cyan border-tactical-cyan shadow-glow-cyan"
                : "bg-tactical-950 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            {node.category === "HIMALAYAN_GLACIAL" && <Mountain className="w-3 h-3 text-cyan-400" />}
            {node.category === "OROGRAPHIC_CLOUDBURST" && <CloudRain className="w-3 h-3 text-blue-400" />}
            {node.category === "RIVERBED_SILTATION" && <Droplets className="w-3 h-3 text-amber-400" />}
            {node.category === "EMBANKMENT_BREACH" && <ShieldAlert className="w-3 h-3 text-crimson-400 text-tactical-crimson" />}
            {node.category === "DAM_RELEASE" && <Activity className="w-3 h-3 text-emerald-400" />}
            <span>{node.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Scrollable Details Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Node Overview Card */}
        <div className="p-3.5 rounded-lg bg-tactical-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2 py-0.5 rounded bg-tactical-cyan/15 text-tactical-cyan font-bold border border-tactical-cyan/30">
              {selectedNode.category.replace(/_/g, " ")}
            </span>
            <span className="text-[10px] text-tactical-crimson font-bold flex items-center">
              <span className="w-2 h-2 rounded-full bg-tactical-crimson animate-ping mr-1.5" />
              {selectedNode.status.replace(/_/g, " ")}
            </span>
          </div>

          <h4 className="text-sm font-bold text-white">
            {selectedNode.name}
          </h4>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Source Origin</span>
              <span className="text-slate-300 font-semibold">{selectedNode.upstreamSource}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Primary Axis</span>
              <span className="text-tactical-cyan font-semibold">{selectedNode.riverSystem}</span>
            </div>
          </div>
        </div>

        {/* CWC Gauge Telemetry */}
        <div className="p-3.5 rounded-lg bg-tactical-900/90 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block flex items-center">
            <Activity className="w-3.5 h-3.5 text-tactical-cyan mr-1.5" />
            Central Water Commission (CWC) Monitoring Telemetry
          </span>

          <div className="p-2.5 rounded bg-tactical-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block">Gauge Location</span>
              <span className="text-xs font-bold text-white">{selectedNode.cwcStation}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Peak Discharge</span>
              <span className="text-xs font-bold text-tactical-cyan">
                {selectedNode.inflowVolumeCumecs.toLocaleString()} cumecs
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-tactical-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Danger Mark</span>
              <span className="text-xs font-bold text-slate-300">
                {selectedNode.dangerMarkMeters.toFixed(2)} m
              </span>
            </div>
            <div className="p-2 rounded bg-tactical-950 border border-tactical-crimson/50 shadow-glow-crimson">
              <span className="text-[10px] text-tactical-crimson block font-bold">Present Level</span>
              <span className="text-xs font-bold text-tactical-crimson">
                {selectedNode.currentLevelMeters.toFixed(2)} m (+{(selectedNode.currentLevelMeters - selectedNode.dangerMarkMeters).toFixed(2)}m Above Danger)
              </span>
            </div>
          </div>
        </div>

        {/* Downstream Pathway Vector Trace */}
        <div className="p-3.5 rounded-lg bg-tactical-900 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block flex items-center">
            <Navigation className="w-3.5 h-3.5 text-tactical-emerald mr-1.5" />
            Hydrological Flow Pathway (Upstream to Plains)
          </span>

          <div className="space-y-1.5 pl-2 border-l-2 border-tactical-cyan/40">
            {selectedNode.primaryPathways.map((path, idx) => (
              <div key={idx} className="relative flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-tactical-cyan -ml-[13px] border border-tactical-950" />
                <span className="text-[11px] text-slate-300">{path}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Total Elevation Drop:</span>
            <span className="font-bold text-tactical-amber">
              {selectedNode.elevationDropMeters} meters
            </span>
          </div>
        </div>

        {/* Scientific Inundation Mechanism */}
        <div className="p-3.5 rounded-lg bg-tactical-900/80 border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block flex items-center">
            <Info className="w-3.5 h-3.5 text-tactical-cyan mr-1.5" />
            Why This Flood Originates & Inundates
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {selectedNode.scientificMechanism}
          </p>
        </div>

        {/* Affected Districts */}
        <div className="p-3 rounded-lg bg-tactical-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">
            Primary Inundated Districts in Line of Flow:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedNode.affectedDistricts.map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className="px-2 py-1 rounded bg-tactical-950 border border-slate-700 hover:border-tactical-cyan text-slate-200 text-[10px] flex items-center space-x-1"
                title={`Inspect ${dist} in GIS viewer`}
              >
                <MapPin className="w-2.5 h-2.5 text-tactical-cyan" />
                <span>{dist}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-tactical-900/90 flex items-center justify-between text-[11px]">
        <button
          onClick={() => setActiveMapMode("surveillance")}
          className="w-full py-1.5 rounded-lg bg-tactical-cyan/20 border border-tactical-cyan/50 text-tactical-cyan font-bold hover:bg-tactical-cyan/30 transition-all text-center"
        >
          Return to Satellite Surveillance Mode
        </button>
      </div>
    </div>
  );
};
