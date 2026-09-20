# AI-Based Satellite Flood Detection System | North East India

A tactical geospatial intelligence and disaster response platform engineered to monitor, analyze, and visualize flood inundation across North East India (Assam, Meghalaya, Arunachal Pradesh) using Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) imagery, Google Earth Engine (GEE), and deep learning (ResUNet) segmentation.

---

## 1. System Architecture Overview

```
                        ┌───────────────────────────────────────────────┐
                        │   Copernicus Sentinel-1 SAR C-Band IW GRD     │
                        │   (10m resolution, VV + VH Polarizations)     │
                        └───────────────────────┬───────────────────────┘
                                                │
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │        Geospatial Preprocessing Engine        │
                        │  - Radiometric Calibration (DN -> σ⁰ dB)     │
                        │  - Refined Lee Speckle Filter (5x5 kernel)    │
                        │  - SRTM 30m DEM Terrain & Slope Masking       │
                        └───────────────────────┬───────────────────────┘
                                                │
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │    Bitemporal Change Detection & ResUNet     │
                        │  - Input Tensor: [VV_pre, VH_pre, VV_post,    │
                        │                   VH_post, DEM_norm]          │
                        │  - Physics Threshold: Δσ⁰_VV < -3.0 dB        │
                        │  - JRC Permanent Water Body Subtraction       │
                        └───────────────────────┬───────────────────────┘
                                                │
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │     GeoJSON Vectorization & Douglas-Peucker   │
                        │  - Cluster extraction to smooth polygons      │
                        │  - Damage metrics: Area km², Severity, Depth  │
                        └───────────────────────┬───────────────────────┘
                                                │
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │          FastAPI Backend Microservices        │
                        │  - GET /api/v1/flood-map                      │
                        │  - GET /api/v1/analytics                      │
                        │  - GET /api/v1/advisories                     │
                        │  - POST /api/v1/export-report                 │
                        └───────────────────────┬───────────────────────┘
                                                │
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │        Next.js Tactical GIS Web Dashboard     │
                        │  - MapLibre / Leaflet + Deck.gl Engine        │
                        │  - Split-Screen Swipe Comparison Slider       │
                        │  - Recharts Dynamic Impact Analytics          │
                        │  - Automated SITREP Dossier Generator         │
                        └───────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
padho/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── flood_map.py       # Flood polygons & SAR tiles
│   │   │       │   ├── analytics.py       # Damage stats & time series
│   │   │       │   ├── export_report.py   # SITREP export engine
│   │   │       │   └── advisories.py      # NESAC & CWC alert feeds
│   │   │       └── router.py              # Consolidated v1 API router
│   │   ├── core/
│   │   │   └── config.py                  # Bounding boxes, radar thresholds
│   │   ├── data/
│   │   │   └── sample_regions.py          # NE India rivers, roads, settlements
│   │   ├── services/
│   │   │   ├── sar_preprocessor.py        # Lee speckle filter & dB calibration
│   │   │   ├── ai_segmentation.py         # ResUNet 5-channel inference
│   │   │   ├── vectorizer.py              # Raster-to-GeoJSON polygonizer
│   │   │   └── gee_pipeline.py            # GEE Sentinel-1 query pipeline
│   │   └── main.py                        # FastAPI entrypoint with CORS
│   ├── requirements.txt
│   └── test_backend.py                    # Automated test suite
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css                # Tactical GIS dark theme styling
│   │   │   ├── layout.tsx                 # Root HTML layout
│   │   │   └── page.tsx                   # Main command center dashboard
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx             # Tactical status bar & toggles
│   │   │   │   └── ControlBar.tsx         # State/District & Date pickers
│   │   │   ├── map/
│   │   │   │   ├── MapViewer.tsx          # Geospatial WebGL dual-map viewer
│   │   │   │   ├── SwipeSlider.tsx        # Draggable split comparison slider
│   │   │   │   ├── LayerControl.tsx       # Layer toggles & opacity sliders
│   │   │   │   └── MapLegend.tsx          # Tactical classification legend
│   │   │   ├── dashboard/
│   │   │   │   ├── MetricCards.tsx        # Area km², population, roads
│   │   │   │   ├── ImpactCharts.tsx       # Recharts land cover & district bars
│   │   │   │   ├── TimeSeriesTrend.tsx    # Hydrograph & SAR backscatter trend
│   │   │   │   ├── EarlyWarningDrawer.tsx # NESAC / CWC live alerts
│   │   │   │   └── ExportReportModal.tsx  # SITREP download modal
│   │   │   └── ui/
│   │   │       └── TacticalCard.tsx       # HUD card with cybernetic borders
│   │   ├── services/
│   │   │   └── api.ts                     # API client with embedded fallback
│   │   ├── store/
│   │   │   └── useFloodStore.ts           # Zustand global state store
│   │   └── types/
│   │       └── index.ts                   # TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
└── README.md
```

---

## 3. Quick Start & Execution

### Running the FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
- Test Suite: `python test_backend.py`

### Running the Next.js Tactical Frontend
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## 4. Key Geospatial & AI Algorithms

1. **Refined Lee Speckle Filtering**:
   $$\hat{y} = \bar{x} + W \cdot (x - \bar{x})$$
   where $W = \max\left(0, \frac{\mathrm{Var}(x) - \sigma_{\text{noise}}^2}{\mathrm{Var}(x)}\right)$ and $\sigma_{\text{noise}}^2 = \frac{\bar{x}^2}{N_{\text{looks}}}$.
   Smooths radar grain noise across uniform water while preserving sharp embankments and river levees.

2. **Specular Water Backscatter Drop ($\Delta \sigma^0$)**:
   $$\Delta \sigma_{VV}^0 = \sigma_{\text{post}, VV}^0 - \sigma_{\text{pre}, VV}^0 < -3.0\text{ dB}$$
   Open surface water creates a specular reflection that bounces radar energy away from the satellite, producing a stark drop in backscatter.

3. **5-Channel ResUNet Neural Ingestion**:
   Tensors of shape $(H, W, 5)$ incorporating $[VV_{\text{pre}}, VH_{\text{pre}}, VV_{\text{post}}, VH_{\text{post}}, \text{DEM}_{\text{norm}}]$ passed to a residual U-Net architecture to distinguish permanent water from floodwaters and eliminate mountain radar shadows.
