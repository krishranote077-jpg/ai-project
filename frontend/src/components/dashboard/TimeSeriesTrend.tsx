"use client";

import React from "react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  Legend 
} from "recharts";
import { useFloodStore } from "@/store/useFloodStore";
import { TacticalCard } from "@/components/ui/TacticalCard";

export const TimeSeriesTrend: React.FC = () => {
  const { analyticsData } = useFloodStore();

  const trendData = analyticsData?.time_series_trend || [
    { date: "May 15", sar_backscatter_db: -10.8, water_extent_km2: 42.0, cwc_stage_m: 81.2, danger_level_m: 85.0 },
    { date: "May 27", sar_backscatter_db: -11.2, water_extent_km2: 48.5, cwc_stage_m: 82.4, danger_level_m: 85.0 },
    { date: "Jun 08", sar_backscatter_db: -12.5, water_extent_km2: 85.0, cwc_stage_m: 84.1, danger_level_m: 85.0 },
    { date: "Jun 20", sar_backscatter_db: -15.8, water_extent_km2: 194.0, cwc_stage_m: 85.8, danger_level_m: 85.0 },
    { date: "Jul 02", sar_backscatter_db: -19.4, water_extent_km2: 412.5, cwc_stage_m: 86.9, danger_level_m: 85.0 },
    { date: "Jul 14", sar_backscatter_db: -18.2, water_extent_km2: 362.0, cwc_stage_m: 86.1, danger_level_m: 85.0 },
    { date: "Jul 26", sar_backscatter_db: -14.9, water_extent_km2: 240.0, cwc_stage_m: 84.6, danger_level_m: 85.0 }
  ];

  return (
    <TacticalCard 
      title="Temporal Water Stage & Radar Backscatter Dynamics" 
      badge="Sentinel-1 SAR + CWC Hydrology" 
      badgeColor="cyan"
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trendData} margin={{ top: 10, right: 25, left: -5, bottom: 5 }}>
            <defs>
              <linearGradient id="waterExtentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} fontStyle="monospace" />
            
            {/* Left Y Axis: Flooded Area km2 */}
            <YAxis 
              yAxisId="left" 
              stroke="#00f0ff" 
              fontSize={10} 
              fontStyle="monospace" 
              label={{ value: 'Extent (km²)', angle: -90, position: 'insideLeft', fill: '#00f0ff', fontSize: 10 }}
            />

            {/* Right Y Axis: River Stage (m) */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#ff3366" 
              fontSize={10} 
              domain={[79, 89]} 
              fontStyle="monospace" 
              label={{ value: 'CWC River Stage (m)', angle: 90, position: 'insideRight', fill: '#ff3366', fontSize: 10 }}
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#070a13", 
                borderColor: "#1e293b", 
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "monospace"
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "8px" }} />

            {/* Danger Mark Threshold Reference Line */}
            <ReferenceLine 
              y={85.0} 
              yAxisId="right" 
              stroke="#ff3366" 
              strokeDasharray="4 4" 
              label={{ value: "DANGER MARK (85.04m)", fill: "#ff3366", fontSize: 10, position: "top" }} 
            />

            {/* Inundated Area Surface Extent */}
            <Area 
              type="monotone" 
              dataKey="water_extent_km2" 
              name="Inundated Area (km²)" 
              stroke="#00f0ff" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#waterExtentGrad)" 
              yAxisId="left" 
            />

            {/* CWC Gauge Water Level Stage */}
            <Line 
              type="monotone" 
              dataKey="cwc_stage_m" 
              name="CWC River Gauge (m)" 
              stroke="#ff3366" 
              strokeWidth={2.5} 
              dot={{ r: 4, fill: "#ff3366" }} 
              yAxisId="right" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </TacticalCard>
  );
};
