"use client";

import React, { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ControlBar } from "@/components/layout/ControlBar";
import { MapViewer } from "@/components/map/MapViewer";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { ImpactCharts } from "@/components/dashboard/ImpactCharts";
import { TimeSeriesTrend } from "@/components/dashboard/TimeSeriesTrend";
import { EarlyWarningDrawer } from "@/components/dashboard/EarlyWarningDrawer";
import { ExportReportModal } from "@/components/dashboard/ExportReportModal";
import { SatelliteImageryModal } from "@/components/dashboard/SatelliteImageryModal";
import { AiFloodExplainerModal } from "@/components/dashboard/AiFloodExplainerModal";
import { IndiaFloodMapModal } from "@/components/dashboard/IndiaFloodMapModal";
import { useFloodStore } from "@/store/useFloodStore";
import { fetchFloodMapData, fetchAnalyticsData, fetchAdvisoriesData } from "@/services/api";
import { ChevronDown, ChevronUp, BarChart2, ShieldAlert } from "lucide-react";

export default function FloodIntelligenceDashboard() {
  const {
    selectedState,
    selectedDistrict,
    preFloodDate,
    postFloodDate,
    deltaThresholdDb,
    confidenceThreshold,
    isAnalyticsOpen,
    toggleAnalyticsDrawer,
    setMapData,
    setAnalyticsData,
    setAdvisoriesData,
    setLoadingData
  } = useFloodStore();

  // Load geospatial and analytics data on parameter updates
  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      setLoadingData(true);
      try {
        const [mapRes, analyticsRes, advisoriesRes] = await Promise.all([
          fetchFloodMapData(selectedState, selectedDistrict, preFloodDate, postFloodDate, deltaThresholdDb, confidenceThreshold),
          fetchAnalyticsData(selectedState, selectedDistrict),
          fetchAdvisoriesData(selectedState)
        ]);

        if (isMounted) {
          setMapData(mapRes);
          setAnalyticsData(analyticsRes);
          setAdvisoriesData(advisoriesRes);
        }
      } catch (err) {
        console.error("Error loading flood intelligence telemetry:", err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }

    loadAllData();

    return () => {
      isMounted = false;
    };
  }, [selectedState, selectedDistrict, preFloodDate, postFloodDate, deltaThresholdDb, confidenceThreshold]);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-tactical-950">
      {/* 1. Tactical Command Header */}
      <Header />

      {/* 2. Tactical Regional & Temporal Control Bar */}
      <ControlBar />

      {/* 3. Main Geospatial Workspace Container */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Interactive Map Viewer */}
        <MapViewer />

        {/* 4. Tactical Analytics Sidebar / Drawer */}
        <aside
          className={`absolute top-0 bottom-0 right-0 z-20 w-full md:w-[520px] bg-tactical-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ${
            isAnalyticsOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Analytics Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-tactical-900/80">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-tactical-cyan" />
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Geospatial Damage Intelligence & Analytics
              </h2>
            </div>
            <button
              onClick={() => toggleAnalyticsDrawer(false)}
              className="text-slate-400 hover:text-white p-1 rounded"
              title="Collapse Analytics Drawer"
            >
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </button>
          </div>

          {/* Analytics Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Dynamic Metric Cards */}
            <MetricCards />

            {/* Historical SAR Backscatter & CWC River Stage Hydrograph */}
            <TimeSeriesTrend />

            {/* Land Cover Breakdown & Inter-District Vulnerability */}
            <ImpactCharts />
          </div>
        </aside>
      </div>

      {/* 5. Alerts & Early Warning Drawer */}
      <EarlyWarningDrawer />

      {/* 6. SITREP Export Modal */}
      <ExportReportModal />

      {/* 7. Before & After Satellite Imagery Case Studies Modal */}
      <SatelliteImageryModal />

      {/* 8. AI Flood Diagnostic & Scientific Explanation Studio Modal */}
      <AiFloodExplainerModal />

      {/* 9. All-India Satellite Flood Extent & Location Map Modal */}
      <IndiaFloodMapModal />
    </main>
  );
}
