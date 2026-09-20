import React from "react";
import { 
  MapPin, 
  Calendar, 
  Sparkles, 
  Sliders, 
  ChevronDown, 
  Radio, 
  Compass 
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";

const STATE_DISTRICT_MAP: Record<string, string[]> = {
  Assam: [
    "Kaziranga / Golaghat",
    "Majuli",
    "Dhubri",
    "Kamrup (Guwahati)",
    "Morigaon",
    "Dhemaji",
    "Barpeta"
  ],
  Meghalaya: [
    "West Garo Hills",
    "South Garo Hills",
    "East Khasi Hills"
  ],
  "Arunachal Pradesh": [
    "East Siang (Pasighat)",
    "Lohit"
  ],
  Kerala: [
    "Ernakulam / Aluva (Periyar)",
    "Kuttanad (Alappuzha)",
    "Idukki Lowlands",
    "Thrissur / Chalakudy"
  ]
};

const EVENT_PRESETS = [
  {
    name: "July 2024 Monsoonal Surge",
    state: "Assam",
    district: "Kaziranga / Golaghat",
    pre: "2024-06-12",
    post: "2024-07-04",
    desc: "Brahmaputra overtopping Kaziranga Kohora corridor"
  },
  {
    name: "Kerala 2018 Great Deluge",
    state: "Kerala",
    district: "Ernakulam / Aluva (Periyar)",
    pre: "2018-05-20",
    post: "2018-08-16",
    desc: "Periyar river overflow & Kuttanad delta submergence"
  },
  {
    name: "Majuli Island Breach Event",
    state: "Assam",
    district: "Majuli",
    pre: "2024-06-10",
    post: "2024-07-06",
    desc: "Subansiri-Brahmaputra confluence submerging river chars"
  },
  {
    name: "Dhubri Border Inundation",
    state: "Assam",
    district: "Dhubri",
    pre: "2024-06-15",
    post: "2024-07-08",
    desc: "Severe transboundary backwater inundation"
  },
  {
    name: "Garo Hills Flash Inundation",
    state: "Meghalaya",
    district: "West Garo Hills",
    pre: "2024-05-28",
    post: "2024-06-18",
    desc: "Jinjiram river flash flooding Tikrikilla plains"
  }
];

export const ControlBar: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    preFloodDate,
    setPreFloodDate,
    postFloodDate,
    setPostFloodDate,
    deltaThresholdDb,
    setDeltaThresholdDb,
    confidenceThreshold,
    setConfidenceThreshold
  } = useFloodStore();

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const districts = STATE_DISTRICT_MAP[state] || [];
    if (districts.length > 0) {
      setSelectedDistrict(districts[0]);
    }
  };

  const handlePresetSelect = (preset: typeof EVENT_PRESETS[0]) => {
    setSelectedState(preset.state);
    setSelectedDistrict(preset.district);
    setPreFloodDate(preset.pre);
    setPostFloodDate(preset.post);
  };

  return (
    <div className="bg-tactical-900/95 border-b border-slate-800/80 px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      {/* Region Selectors */}
      <div className="flex items-center flex-wrap gap-2">
        {/* State Dropdown */}
        <div className="flex items-center space-x-1.5 bg-tactical-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-300">
          <Compass className="w-3.5 h-3.5 text-tactical-cyan" />
          <span className="text-[10px] text-slate-500 uppercase">State:</span>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
          >
            {Object.keys(STATE_DISTRICT_MAP).map((s) => (
              <option key={s} value={s} className="bg-tactical-900 text-white">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div className="flex items-center space-x-1.5 bg-tactical-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-tactical-amber" />
          <span className="text-[10px] text-slate-500 uppercase">District / AOI:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
          >
            {(STATE_DISTRICT_MAP[selectedState] || []).map((d) => (
              <option key={d} value={d} className="bg-tactical-900 text-white">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Pre-Flood Baseline Date */}
        <div className="flex items-center space-x-1.5 bg-tactical-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] text-slate-500 uppercase">Baseline:</span>
          <input
            type="date"
            value={preFloodDate}
            onChange={(e) => setPreFloodDate(e.target.value)}
            className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer text-xs"
          />
        </div>

        {/* Post-Flood Observation Date */}
        <div className="flex items-center space-x-1.5 bg-tactical-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-300">
          <Radio className="w-3.5 h-3.5 text-tactical-crimson animate-pulse" />
          <span className="text-[10px] text-slate-500 uppercase">Event SAR:</span>
          <input
            type="date"
            value={postFloodDate}
            onChange={(e) => setPostFloodDate(e.target.value)}
            className="bg-transparent text-slate-200 font-mono focus:outline-none cursor-pointer text-xs"
          />
        </div>
      </div>

      {/* Flood Event Quick Presets */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
        <span className="text-[10px] uppercase text-slate-500 flex items-center">
          <Sparkles className="w-3 h-3 text-tactical-cyan mr-1" />
          Presets:
        </span>
        {EVENT_PRESETS.map((p) => {
          const isActive = selectedDistrict === p.district;
          return (
            <button
              key={p.name}
              onClick={() => handlePresetSelect(p)}
              className={`px-2 py-1 rounded text-[11px] whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-tactical-cyan/15 text-tactical-cyan border-tactical-cyan/50"
                  : "bg-tactical-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {p.district.split(" ")[0]} ({p.name.split(" ")[0]})
            </button>
          );
        })}
      </div>

      {/* Physics Threshold Fine-tuning */}
      <div className="hidden xl:flex items-center space-x-3 bg-tactical-950/80 px-3 py-1 rounded border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1">
          <span>Δσ⁰ Threshold:</span>
          <span className="text-tactical-cyan font-bold">{deltaThresholdDb} dB</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1">
          <span>ResUNet Conf:</span>
          <span className="text-tactical-amber font-bold">{Math.round(confidenceThreshold * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
