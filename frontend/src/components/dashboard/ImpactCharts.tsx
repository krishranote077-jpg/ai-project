"use client";

import React from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from "recharts";
import { useFloodStore } from "@/store/useFloodStore";
import { TacticalCard } from "@/components/ui/TacticalCard";

export const ImpactCharts: React.FC = () => {
  const { analyticsData } = useFloodStore();

  const landCover = analyticsData?.land_cover_breakdown || [
    { name: "Paddy / Cropland", hectares: 25575, color: "#ffb700" },
    { name: "Wetlands & Swamps", hectares: 8900, color: "#00f0ff" },
    { name: "Rural Settlements", hectares: 4150, color: "#ff2a5f" },
    { name: "Grassland / Sanctuary", hectares: 2600, color: "#00ff88" }
  ];

  const districtData = analyticsData?.district_comparison || [
    { district: "Majuli", flooded_km2: 412.5, population_impacted: 142000, risk: "CRITICAL" },
    { district: "Kaziranga", flooded_km2: 385.0, population_impacted: 186400, risk: "CRITICAL" },
    { district: "Dhubri", flooded_km2: 378.2, population_impacted: 210000, risk: "CRITICAL" },
    { district: "Morigaon", flooded_km2: 265.8, population_impacted: 98000, risk: "HIGH" },
    { district: "Dhemaji", flooded_km2: 310.4, population_impacted: 115000, risk: "HIGH" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Land Cover Inundation Breakdown */}
      <TacticalCard title="Land Cover Impact Distribution" badge="Hectares" badgeColor="amber">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={landCover} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <XAxis type="number" stroke="#64748b" fontSize={10} fontStyle="monospace" />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#94a3b8" 
                fontSize={10} 
                fontStyle="monospace" 
                width={100} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#070a13", 
                  borderColor: "#1e293b", 
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontFamily: "monospace"
                }}
                formatter={(val: any) => [`${Number(val).toLocaleString()} Ha`, "Submerged"]}
              />
              <Bar dataKey="hectares" radius={[0, 4, 4, 0]}>
                {landCover.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TacticalCard>

      {/* 2. District Flood Extent Comparison */}
      <TacticalCard title="Regional Flood Severity Matrix" badge="NE India" badgeColor="cyan">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <XAxis dataKey="district" stroke="#64748b" fontSize={10} fontStyle="monospace" />
              <YAxis stroke="#64748b" fontSize={10} fontStyle="monospace" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#070a13", 
                  borderColor: "#1e293b", 
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontFamily: "monospace"
                }}
                formatter={(val: any) => [`${val} km²`, "Flooded Extent"]}
              />
              <Bar dataKey="flooded_km2" fill="#00f0ff" radius={[4, 4, 0, 0]}>
                {districtData.map((entry, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill={entry.risk === "CRITICAL" ? "#ff2a5f" : entry.risk === "HIGH" ? "#ffb700" : "#00f0ff"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TacticalCard>
    </div>
  );
};
