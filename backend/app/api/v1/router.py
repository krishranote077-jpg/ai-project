"""
API v1 Router: Consolidates geospatial, analytics, export, and advisory endpoints.
"""
from fastapi import APIRouter
from app.api.v1.endpoints import flood_map, analytics, export_report, advisories

api_router = APIRouter()

api_router.include_router(flood_map.router, tags=["Flood Mapping & SAR Geospatial Layers"])
api_router.include_router(analytics.router, tags=["Disaster Analytics & Impact Intelligence"])
api_router.include_router(export_report.router, tags=["SITREP & Geospatial Export"])
api_router.include_router(advisories.router, tags=["NESAC & CWC Early Warnings"])
