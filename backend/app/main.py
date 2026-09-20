"""
North East India AI Satellite Flood Intelligence Platform.
Production FastAPI Server Application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-resolution SAR satellite flood extent analysis, AI segmentation (ResUNet), and damage intelligence platform for North East India.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production: specify client origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "sar_sensor": settings.SAR_SENSOR,
        "supported_states": list(settings.REGIONAL_COORDINATES.keys()),
        "docs_url": "/docs",
        "api_v1_url": settings.API_V1_STR
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "sar_preprocessor": "online",
            "resunet_inference": "online",
            "geojson_vectorizer": "online",
            "gee_connector": "standby"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
