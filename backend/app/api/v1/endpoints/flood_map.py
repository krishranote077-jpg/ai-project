"""
Flood Map API Endpoint: /api/v1/flood-map
Provides interactive geospatial GeoJSON layers, AI inundation polygons,
permanent water masks, and Sentinel-1 SAR comparison tile endpoints.
"""
from typing import Optional, Dict, Any
from fastapi import APIRouter, Query, HTTPException

from app.core.config import settings
from app.services.sar_preprocessor import SARPreprocessor
from app.services.ai_segmentation import ResUNetInferenceService
from app.services.vectorizer import GeoJSONVectorizer
from app.services.gee_pipeline import GEESentinel1Pipeline
from app.data.sample_regions import (
    INFRASTRUCTURE_ROADS_GEOJSON,
    PERMANENT_WATER_BODIES_GEOJSON,
    CRITICAL_SETTLEMENTS
)

router = APIRouter()

# Initialize services
sar_preprocessor = SARPreprocessor(kernel_size=settings.SPECKLE_FILTER_KERNEL_SIZE)
ai_segmentation = ResUNetInferenceService()
vectorizer = GeoJSONVectorizer()
gee_pipeline = GEESentinel1Pipeline()

@router.get("/flood-map")
async def get_flood_map(
    state: str = Query("Assam", description="North East state name (Assam, Meghalaya, Arunachal Pradesh)"),
    district: str = Query("Kaziranga / Golaghat", description="Target district for flood extent analysis"),
    pre_date: str = Query("2024-06-12", description="Pre-flood baseline date (YYYY-MM-DD)"),
    post_date: str = Query("2024-07-04", description="Post-flood observation date (YYYY-MM-DD)"),
    threshold_db: float = Query(-3.0, description="Radar backscatter difference threshold in dB"),
    confidence: float = Query(0.65, description="Deep learning probability threshold [0.0 - 1.0]")
) -> Dict[str, Any]:
    """
    Returns complete geospatial datasets for the requested region and date:
    - AI-predicted Inundation Polygon GeoJSON
    - Permanent River Channels & Wetlands GeoJSON
    - Road Infrastructure Network & Submergence Status GeoJSON
    - Sentinel-1 SAR Dual-Temporal Tile endpoints for swipe comparison
    """
    state_data = settings.REGIONAL_COORDINATES.get(state)
    if not state_data:
        raise HTTPException(status_code=404, detail=f"State '{state}' is not indexed in North East database.")

    districts = state_data.get("districts", {})
    district_info = districts.get(district)
    if not district_info:
        # Fallback to first district in the state
        district = list(districts.keys())[0]
        district_info = districts[district]

    bbox = district_info["bbox"]
    center = district_info["center"]

    # 1. Fetch or generate SAR arrays for this specific district
    sar_data = gee_pipeline.generate_synthetic_sar_arrays(district_name=district, shape=(72, 72))

    # 2. Apply Lee Speckle Filtering to raw SAR backscatter (VV and VH channels)
    filtered_pre_vv = sar_preprocessor.apply_lee_filter(sar_data["pre_vv"])
    filtered_post_vv = sar_preprocessor.apply_lee_filter(sar_data["post_vv"])

    # 3. ResUNet Ingestion Tensor Preparation (5-channel: pre_vv, pre_vh, post_vv, post_vh, dem)
    tensor_5ch = ai_segmentation.prepare_input_tensor(
        pre_vv=filtered_pre_vv,
        pre_vh=sar_data["pre_vh"],
        post_vv=filtered_post_vv,
        post_vh=sar_data["post_vh"],
        dem=sar_data["dem"]
    )

    # 4. Neural Network Inference + Radar Delta-Sigma-0 Physics Check
    prob_map, ai_binary_mask = ai_segmentation.predict_flood_probability(
        tensor_5ch=tensor_5ch,
        pre_vv_raw_db=filtered_pre_vv,
        post_vv_raw_db=filtered_post_vv,
        dem_raw=sar_data["dem"]
    )

    # Mask permanent river channel from flood inundation
    ai_binary_mask[sar_data["permanent_water"] == 1] = 0

    # 5. GeoJSON Vectorization with Douglas-Peucker Smoothing
    flood_features = vectorizer.extract_clusters_to_polygons(
        mask=ai_binary_mask,
        prob_map=prob_map,
        bbox=bbox,
        min_pixels=3
    )

    total_flooded_km2 = round(sum(f["properties"]["area_sqkm"] for f in flood_features), 2)

    inundation_geojson = vectorizer.create_feature_collection(
        features=flood_features,
        metadata={
            "layer_name": "AI_ResUNet_Flood_Inundation_Extent",
            "state": state,
            "district": district,
            "river_basin": district_info.get("river", "Brahmaputra"),
            "total_flooded_sqkm": total_flooded_km2,
            "sar_sensor": settings.SAR_SENSOR,
            "polarization": "VV/VH",
            "delta_sigma_0_threshold_db": threshold_db,
            "model_version": ai_segmentation.model_version
        }
    )

    # 6. Fetch satellite tile references for split swipe comparison
    gee_info = gee_pipeline.fetch_sentinel1_pair(bbox=bbox, pre_date=pre_date, post_date=post_date)

    return {
        "status": "success",
        "region": {
            "state": state,
            "district": district,
            "center": center,
            "bbox": bbox,
            "zoom": 10,
            "river_basin": district_info.get("river")
        },
        "temporal": {
            "pre_flood_date": pre_date,
            "post_flood_date": post_date,
            "revisit_interval_days": 12
        },
        "layers": {
            "inundation_mask": inundation_geojson,
            "permanent_water": PERMANENT_WATER_BODIES_GEOJSON,
            "infrastructure_roads": INFRASTRUCTURE_ROADS_GEOJSON,
            "settlements_at_risk": [
                s for s in CRITICAL_SETTLEMENTS 
                if bbox[0] - 0.2 <= s["lon"] <= bbox[2] + 0.2 and bbox[1] - 0.2 <= s["lat"] <= bbox[3] + 0.2
            ] or CRITICAL_SETTLEMENTS[:2]
        },
        "tiles": gee_info["tiles"],
        "statistics": {
            "total_flooded_area_sqkm": total_flooded_km2,
            "polygons_detected": len(flood_features),
            "critical_risk_zones": sum(1 for f in flood_features if f["properties"]["severity"] == "CRITICAL"),
            "high_risk_zones": sum(1 for f in flood_features if f["properties"]["severity"] == "HIGH")
        }
    }
