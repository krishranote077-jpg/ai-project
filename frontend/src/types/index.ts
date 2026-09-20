export type FloodSeverity = "CRITICAL" | "HIGH" | "MODERATE" | "LOW";

export interface GeoJSONGeometry {
  type: string;
  coordinates: any;
}

export interface FloodFeatureProperties {
  feature_id: string;
  area_sqkm: number;
  mean_confidence: number;
  severity: FloodSeverity;
  estimated_depth: string;
  dominant_landcover: string;
  radar_backscatter_anomaly_db: number;
  satellite_sensor: string;
  polarization: string;
}

export interface GeoJSONFeature<P = any> {
  type: "Feature";
  id?: string;
  geometry: GeoJSONGeometry;
  properties: P;
}

export interface GeoJSONFeatureCollection<P = any> {
  type: "FeatureCollection";
  metadata?: Record<string, any>;
  features: GeoJSONFeature<P>[];
}

export interface RoadFeatureProperties {
  name: string;
  type: string;
  status: string;
  vulnerability: FloodSeverity;
  submerged_km: number;
}

export interface WaterFeatureProperties {
  name: string;
  type: string;
  discharge_cumecs?: number;
  surface_occurrence?: string;
}

export interface CriticalSettlement {
  name: string;
  lat: number;
  lon: number;
  pop: number;
  status: string;
  evac_camp: string;
}

export interface CWCGaugeStation {
  station_id: string;
  station_name: string;
  river: string;
  district: string;
  current_level_m: number;
  danger_level_m: number;
  highest_flood_level_m: number;
  trend: "RISING" | "FALLING" | "STEADY";
  status: FloodSeverity;
}

export interface AdvisoryBulletin {
  id: string;
  source: string;
  title: string;
  timestamp: string;
  severity: FloodSeverity;
  badge_color: string;
  affected_districts: string[];
  summary: string;
  recommended_action: string;
}

export interface LandCoverBreakdown {
  name: string;
  hectares: number;
  color: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  sar_backscatter_db: number;
  water_extent_km2: number;
  cwc_stage_m: number;
  danger_level_m: number;
}

export interface DistrictComparisonData {
  district: string;
  flooded_km2: number;
  population_impacted: number;
  risk: FloodSeverity;
}

export interface AnalyticsSummary {
  total_flooded_sqkm: number;
  baseline_water_sqkm: number;
  percent_surge: number;
  impacted_population: number;
  cropland_affected_hectares: number;
  flooded_road_km: number;
  critical_hazard_level: FloodSeverity;
}

export interface FloodMapResponse {
  status: string;
  region: {
    state: string;
    district: string;
    center: [number, number];
    bbox: [number, number, number, number];
    zoom: number;
    river_basin?: string;
  };
  temporal: {
    pre_flood_date: string;
    post_flood_date: string;
    revisit_interval_days: number;
  };
  layers: {
    inundation_mask: GeoJSONFeatureCollection<FloodFeatureProperties>;
    permanent_water: GeoJSONFeatureCollection<WaterFeatureProperties>;
    infrastructure_roads: GeoJSONFeatureCollection<RoadFeatureProperties>;
    settlements_at_risk: CriticalSettlement[];
  };
  tiles: {
    pre_flood_tile_url: string;
    pre_flood_label: string;
    post_flood_sar_tile_url: string;
    post_flood_label: string;
    dem_srtm_source: string;
  };
  statistics: {
    total_flooded_area_sqkm: number;
    polygons_detected: number;
    critical_risk_zones: number;
    high_risk_zones: number;
  };
}

export interface AnalyticsResponse {
  status: string;
  state: string;
  district: string;
  summary: AnalyticsSummary;
  land_cover_breakdown: LandCoverBreakdown[];
  time_series_trend: TimeSeriesDataPoint[];
  district_comparison: DistrictComparisonData[];
  cwc_gauge_summary: CWCGaugeStation[];
}

export interface AdvisoriesResponse {
  status: string;
  state: string;
  active_advisories_count: number;
  critical_count: number;
  bulletins: AdvisoryBulletin[];
  river_gauges: CWCGaugeStation[];
}

export interface LayerVisibilityState {
  inundationMask: boolean;
  sarBackscatter: boolean;
  permanentWater: boolean;
  infrastructureRoads: boolean;
  settlementsAtRisk: boolean;
  cwcGauges: boolean;
}

export interface LayerOpacityState {
  inundationMask: number;
  sarBackscatter: number;
  permanentWater: number;
}
