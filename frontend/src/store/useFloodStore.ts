import { create } from "zustand";
import { 
  FloodMapResponse, 
  AnalyticsResponse, 
  AdvisoriesResponse, 
  LayerVisibilityState, 
  LayerOpacityState,
  FloodFeatureProperties 
} from "@/types";

interface FloodState {
  // Region & Temporal selections
  selectedState: string;
  selectedDistrict: string;
  preFloodDate: string;
  postFloodDate: string;

  // View & Comparison controls
  viewMode: "swipe" | "single";
  swipePosition: number; // 0 to 100 percentage
  
  // Layer visibility & styling
  activeLayers: LayerVisibilityState;
  layerOpacity: LayerOpacityState;

  // AI model parameters
  deltaThresholdDb: number;
  confidenceThreshold: number;

  // Inspected Feature / Tooltip
  selectedFeature: FloodFeatureProperties | null;

  // UI Drawers & Modals
  isAnalyticsOpen: boolean;
  isAdvisoriesOpen: boolean;
  isExportModalOpen: boolean;
  isImageryModalOpen: boolean;
  isAiExplainerOpen: boolean;
  isIndiaMapOpen: boolean;
  activeMapMode: "surveillance" | "origin-tracker";
  selectedOriginNode: string | null;
  isLoadingData: boolean;

  // Loaded API Data
  mapData: FloodMapResponse | null;
  analyticsData: AnalyticsResponse | null;
  advisoriesData: AdvisoriesResponse | null;

  // Actions
  setSelectedState: (state: string) => void;
  setSelectedDistrict: (district: string) => void;
  setPreFloodDate: (date: string) => void;
  setPostFloodDate: (date: string) => void;
  setViewMode: (mode: "swipe" | "single") => void;
  setSwipePosition: (pos: number) => void;
  toggleLayer: (layerName: keyof LayerVisibilityState) => void;
  setLayerOpacity: (layerName: keyof LayerOpacityState, val: number) => void;
  setDeltaThresholdDb: (val: number) => void;
  setConfidenceThreshold: (val: number) => void;
  setSelectedFeature: (feature: FloodFeatureProperties | null) => void;
  toggleAnalyticsDrawer: (open?: boolean) => void;
  toggleAdvisoriesDrawer: (open?: boolean) => void;
  toggleExportModal: (open?: boolean) => void;
  toggleImageryModal: (open?: boolean) => void;
  toggleAiExplainer: (open?: boolean) => void;
  toggleIndiaMap: (open?: boolean) => void;
  setActiveMapMode: (mode: "surveillance" | "origin-tracker") => void;
  setSelectedOriginNode: (node: string | null) => void;
  setLoadingData: (loading: boolean) => void;
  setMapData: (data: FloodMapResponse) => void;
  setAnalyticsData: (data: AnalyticsResponse) => void;
  setAdvisoriesData: (data: AdvisoriesResponse) => void;
}

export const useFloodStore = create<FloodState>((set) => ({
  selectedState: "Assam",
  selectedDistrict: "Kaziranga / Golaghat",
  preFloodDate: "2024-06-12",
  postFloodDate: "2024-07-04",

  viewMode: "swipe",
  swipePosition: 50,

  activeLayers: {
    inundationMask: true,
    sarBackscatter: true,
    permanentWater: true,
    infrastructureRoads: true,
    settlementsAtRisk: true,
    cwcGauges: true,
  },

  layerOpacity: {
    inundationMask: 0.85,
    sarBackscatter: 0.85,
    permanentWater: 0.75,
  },

  deltaThresholdDb: -3.0,
  confidenceThreshold: 0.65,

  selectedFeature: null,

  isAnalyticsOpen: true,
  isAdvisoriesOpen: false,
  isExportModalOpen: false,
  isImageryModalOpen: false,
  isAiExplainerOpen: false,
  isIndiaMapOpen: false,
  activeMapMode: "surveillance",
  selectedOriginNode: null,
  isLoadingData: false,

  mapData: null,
  analyticsData: null,
  advisoriesData: null,

  setSelectedState: (state) => set({ selectedState: state }),
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  setPreFloodDate: (date) => set({ preFloodDate: date }),
  setPostFloodDate: (date) => set({ postFloodDate: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSwipePosition: (pos) => set({ swipePosition: Math.max(0, Math.min(100, pos)) }),
  
  toggleLayer: (layerName) => set((state) => ({
    activeLayers: {
      ...state.activeLayers,
      [layerName]: !state.activeLayers[layerName]
    }
  })),

  setLayerOpacity: (layerName, val) => set((state) => ({
    layerOpacity: {
      ...state.layerOpacity,
      [layerName]: Math.max(0, Math.min(1, val))
    }
  })),

  setDeltaThresholdDb: (val) => set({ deltaThresholdDb: val }),
  setConfidenceThreshold: (val) => set({ confidenceThreshold: val }),
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),

  toggleAnalyticsDrawer: (open) => set((state) => ({
    isAnalyticsOpen: open !== undefined ? open : !state.isAnalyticsOpen
  })),

  toggleAdvisoriesDrawer: (open) => set((state) => ({
    isAdvisoriesOpen: open !== undefined ? open : !state.isAdvisoriesOpen
  })),

  toggleExportModal: (open) => set((state) => ({
    isExportModalOpen: open !== undefined ? open : !state.isExportModalOpen
  })),

  toggleImageryModal: (open) => set((state) => ({
    isImageryModalOpen: open !== undefined ? open : !state.isImageryModalOpen
  })),

  toggleAiExplainer: (open) => set((state) => ({
    isAiExplainerOpen: open !== undefined ? open : !state.isAiExplainerOpen
  })),

  toggleIndiaMap: (open) => set((state) => ({
    isIndiaMapOpen: open !== undefined ? open : !state.isIndiaMapOpen
  })),

  setActiveMapMode: (mode) => set({ activeMapMode: mode }),
  setSelectedOriginNode: (node) => set({ selectedOriginNode: node }),

  setLoadingData: (loading) => set({ isLoadingData: loading }),
  setMapData: (data) => set({ mapData: data }),
  setAnalyticsData: (data) => set({ analyticsData: data }),
  setAdvisoriesData: (data) => set({ advisoriesData: data })
}));
