"""
Comprehensive test suite for North East India Satellite Flood Intelligence Platform.
Validates:
1. SAR Preprocessing (Lee filter, dB conversion, delta-sigma-0 physics checks).
2. AI Segmentation (ResUNet 5-channel ingestion, inference probability output).
3. GeoJSON Vectorization (Connected components, polygonization, Douglas-Peucker).
4. FastAPI Endpoints (/health, /api/v1/flood-map, /api/v1/analytics, /api/v1/advisories, /api/v1/export-report).
"""
import sys
import os
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

import numpy as np
from app.core.config import settings
from app.services.sar_preprocessor import SARPreprocessor
from app.services.ai_segmentation import ResUNetInferenceService
from app.services.vectorizer import GeoJSONVectorizer
from app.services.gee_pipeline import GEESentinel1Pipeline

def test_sar_preprocessor():
    print("Testing SAR Preprocessor & Lee Speckle Filter...")
    preprocessor = SARPreprocessor(kernel_size=5)
    
    # 1. Linear to dB conversion
    linear_arr = np.array([0.001, 0.01, 0.1, 1.0])
    db_arr = preprocessor.linear_to_db(linear_arr)
    assert np.isclose(db_arr[0], -30.0, atol=0.1)
    assert np.isclose(db_arr[-1], 0.0, atol=0.1)

    # 2. Refined Lee Filter
    test_img = np.random.normal(loc=-12.0, scale=3.0, size=(30, 30)).astype(np.float32)
    filtered = preprocessor.apply_lee_filter(test_img)
    assert filtered.shape == (30, 30)
    assert np.var(filtered) <= np.var(test_img)  # Speckle reduction verified
    print("[PASS] SAR Preprocessor tests passed.")

def test_ai_resunet_segmentation():
    print("Testing AI ResUNet Segmentation Engine...")
    service = ResUNetInferenceService()
    
    # Check model metadata
    meta = service.get_model_metadata()
    assert meta["architecture"].startswith("Residual U-Net")
    assert "metrics" in meta

    # 5-channel tensor creation
    shape = (32, 32)
    pre_vv = np.full(shape, -11.0, dtype=np.float32)
    pre_vh = np.full(shape, -18.0, dtype=np.float32)
    post_vv = np.full(shape, -19.5, dtype=np.float32)  # -8.5 dB drop (flooded)
    post_vh = np.full(shape, -26.0, dtype=np.float32)
    dem = np.full(shape, 55.0, dtype=np.float32)

    tensor = service.prepare_input_tensor(pre_vv, pre_vh, post_vv, post_vh, dem)
    assert tensor.shape == (32, 32, 5)

    prob_map, binary_mask = service.predict_flood_probability(tensor, pre_vv, post_vv, dem)
    assert prob_map.shape == (32, 32)
    assert binary_mask.shape == (32, 32)
    assert np.all(prob_map >= 0.0) and np.all(prob_map <= 1.0)
    assert np.all(binary_mask == 1)  # All flooded due to deep backscatter drop at low elevation
    print("[PASS] AI ResUNet Segmentation tests passed.")

def test_geojson_vectorizer():
    print("Testing GeoJSON Vectorizer...")
    vectorizer = GeoJSONVectorizer()
    mask = np.zeros((30, 30), dtype=np.uint8)
    mask[10:18, 10:18] = 1  # 8x8 flood cluster
    prob_map = np.full((30, 30), 0.92, dtype=np.float32)
    bbox = [92.8, 26.4, 93.6, 26.8]

    features = vectorizer.extract_clusters_to_polygons(mask, prob_map, bbox, min_pixels=4)
    assert len(features) >= 1
    assert features[0]["geometry"]["type"] == "Polygon"
    assert "area_sqkm" in features[0]["properties"]
    assert "severity" in features[0]["properties"]

    fc = vectorizer.create_feature_collection(features, {"test": True})
    assert fc["type"] == "FeatureCollection"
    print("[PASS] GeoJSON Vectorizer tests passed.")

def test_fastapi_endpoints():
    print("Testing FastAPI Endpoints with Async / Starlette TestClient...")
    from starlette.testclient import TestClient
    from app.main import app

    client = TestClient(app)

    # Root & Health
    r_root = client.get("/")
    assert r_root.status_code == 200
    assert r_root.json()["status"] == "OPERATIONAL"

    r_health = client.get("/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"

    # 1. /api/v1/flood-map
    r_map = client.get("/api/v1/flood-map?state=Assam&district=Kaziranga%20/%20Golaghat")
    assert r_map.status_code == 200
    data_map = r_map.json()
    assert data_map["status"] == "success"
    assert "inundation_mask" in data_map["layers"]
    assert "infrastructure_roads" in data_map["layers"]
    assert "tiles" in data_map
    assert data_map["statistics"]["total_flooded_area_sqkm"] > 0
    print("[PASS] Endpoint /api/v1/flood-map passed.")

    # 2. /api/v1/analytics
    r_analytics = client.get("/api/v1/analytics?state=Assam&district=Kaziranga%20/%20Golaghat")
    assert r_analytics.status_code == 200
    data_analytics = r_analytics.json()
    assert data_analytics["status"] == "success"
    assert "summary" in data_analytics
    assert "land_cover_breakdown" in data_analytics
    assert "time_series_trend" in data_analytics
    assert len(data_analytics["time_series_trend"]) > 0
    print("[PASS] Endpoint /api/v1/analytics passed.")

    # 3. /api/v1/advisories
    r_adv = client.get("/api/v1/advisories?state=Assam")
    assert r_adv.status_code == 200
    data_adv = r_adv.json()
    assert data_adv["status"] == "success"
    assert len(data_adv["bulletins"]) > 0
    assert len(data_adv["river_gauges"]) > 0
    print("[PASS] Endpoint /api/v1/advisories passed.")

    # 4. /api/v1/export-report
    r_exp = client.post("/api/v1/export-report", json={
        "state": "Assam",
        "district": "Majuli",
        "report_format": "json"
    })
    assert r_exp.status_code == 200
    data_exp = r_exp.json()
    assert data_exp["status"] == "success"
    assert "sitrep_summary" in data_exp
    print("[PASS] Endpoint /api/v1/export-report passed.")

if __name__ == "__main__":
    test_sar_preprocessor()
    test_ai_resunet_segmentation()
    test_geojson_vectorizer()
    test_fastapi_endpoints()
    print("\n==============================================")
    print("ALL BACKEND SYSTEM & GEOSPATIAL TESTS PASSED!")
    print("==============================================")
