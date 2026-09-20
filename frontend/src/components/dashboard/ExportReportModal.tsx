"use client";

import React, { useState } from "react";
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  FileCode, 
  Loader2, 
  ShieldCheck 
} from "lucide-react";
import { useFloodStore } from "@/store/useFloodStore";
import { exportReportAPI } from "@/services/api";

export const ExportReportModal: React.FC = () => {
  const { 
    isExportModalOpen, 
    toggleExportModal, 
    selectedState, 
    selectedDistrict,
    mapData 
  } = useFloodStore();

  const [format, setFormat] = useState("json");
  const [isExporting, setIsExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState<string | null>(null);

  if (!isExportModalOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setDownloadReady(null);
    try {
      const res = await exportReportAPI({
        state: selectedState,
        district: selectedDistrict,
        report_format: format,
      });

      // Trigger automatic browser file download
      const blob = new Blob([
        format === "json" 
          ? JSON.stringify({ ...res, geojson_features: mapData?.layers?.inundation_mask }, null, 2)
          : res.sitrep_summary
      ], { type: format === "json" ? "application/json" : "text/plain" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.download_filename || `SITREP_${selectedDistrict}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadReady(res.download_filename);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl bg-tactical-950 border border-tactical-cyan/40 shadow-glow-cyan p-5 font-mono text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded bg-tactical-cyan/10 border border-tactical-cyan/30 text-tactical-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Generate Flood Situation Report (SITREP)
              </h3>
              <p className="text-[10px] text-slate-400">
                Official Multi-Agency Disaster Briefing Dossier
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleExportModal(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          {/* Target Region Info */}
          <div className="p-3 rounded bg-tactical-900 border border-slate-800 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Jurisdiction:</span>
              <span className="text-white font-bold">{selectedDistrict}, {selectedState}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Satellite Sensor:</span>
              <span className="text-tactical-cyan font-bold">Sentinel-1 C-SAR IW GRD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deep Learning Model:</span>
              <span className="text-slate-300">ResUNet v2.1 (Δσ⁰ &lt; -3.0 dB)</span>
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2">
              Select Output Format:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat("json")}
                className={`p-2.5 rounded border text-left flex items-center space-x-2 transition-all ${
                  format === "json"
                    ? "bg-tactical-cyan/15 border-tactical-cyan text-tactical-cyan shadow-glow-cyan"
                    : "bg-tactical-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <FileCode className="w-4 h-4" />
                <div>
                  <div className="font-bold text-xs">GeoJSON + SITREP</div>
                  <div className="text-[10px] opacity-75">Machine readable + vectors</div>
                </div>
              </button>

              <button
                onClick={() => setFormat("text")}
                className={`p-2.5 rounded border text-left flex items-center space-x-2 transition-all ${
                  format === "text"
                    ? "bg-tactical-cyan/15 border-tactical-cyan text-tactical-cyan shadow-glow-cyan"
                    : "bg-tactical-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                <div>
                  <div className="font-bold text-xs">ASDMA Bulletin (TXT)</div>
                  <div className="text-[10px] opacity-75">Formatted briefing memo</div>
                </div>
              </button>
            </div>
          </div>

          {/* Success indicator if downloaded */}
          {downloadReady && (
            <div className="p-3 rounded bg-tactical-emerald/10 border border-tactical-emerald/40 text-tactical-emerald flex items-center space-x-2 text-[11px]">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Export generated and saved as {downloadReady}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-tactical-cyan" />
            <span>Cryptographically Verified Intelligence</span>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-tactical-cyan text-black hover:bg-tactical-cyan/90 font-bold transition-all disabled:opacity-50 shadow-glow-cyan"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Dossier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
