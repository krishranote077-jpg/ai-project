"""
Early Warning & Advisories API Endpoint: /api/v1/advisories
Aggregates NESAC satellite flood warning bulletins, CWC river stage alerts,
and evacuation priority orders for disaster response units (NDRF/SDRF).
"""
from typing import Dict, Any, List
from fastapi import APIRouter, Query

from app.data.sample_regions import CWC_GAUGE_STATIONS

router = APIRouter()

@router.get("/advisories")
async def get_advisories(
    state: str = Query("Assam", description="State filter")
) -> Dict[str, Any]:
    """
    Returns automated early warning bulletins, CWC danger level breach notifications,
    and NESAC radar-observed flood alerts.
    """
    bulletins = [
        {
            "id": "NESAC-FL-2024-089",
            "source": "North Eastern Space Applications Centre (NESAC / ISRO)",
            "title": "Severe Inundation Wave - Brahmaputra & Subansiri Basins",
            "timestamp": "2024-07-04T08:30:00Z",
            "severity": "CRITICAL",
            "badge_color": "#ff3366",
            "affected_districts": ["Majuli", "Dhubri", "Golaghat (Kaziranga)", "Dhemaji"],
            "summary": "Sentinel-1 SAR observation indicates severe overtopping of riverbanks. More than 420 sq km of new inundation detected in Majuli and lower Brahmaputra. Floodwaters entering Kaziranga southern animal corridors across NH-37.",
            "recommended_action": "Execute Section 144 vehicle speed curbs on NH-37. Mobilize SDRF boats to Kamalabari and Boro Bazar shelters."
        },
        {
            "id": "CWC-WARN-041",
            "source": "Central Water Commission (CWC) Hydrological Forecasting",
            "title": "River Brahmaputra Exceeds Danger Level at Nimati Ghat & Dhubri",
            "timestamp": "2024-07-04T06:00:00Z",
            "severity": "CRITICAL",
            "badge_color": "#ff3366",
            "affected_districts": ["Majuli", "Dhubri"],
            "summary": "Nimati Ghat gauge is flowing at 86.42m (1.38m above Danger Mark of 85.04m) with RISING trend. In Dhubri, water level is 30.15m (1.53m above Danger Mark).",
            "recommended_action": "Alert district magistrates for emergency evacuation of riverside char dwellers."
        },
        {
            "id": "ASDMA-ADV-112",
            "source": "Assam State Disaster Management Authority (ASDMA)",
            "title": "National Highway 37 Inundation Watch - Bokakhat to Kohora",
            "timestamp": "2024-07-03T19:15:00Z",
            "severity": "ELEVATED",
            "badge_color": "#ffb700",
            "affected_districts": ["Golaghat", "Nagaon"],
            "summary": "Diffloo river backflow causing sheet flooding across 14.8 km stretch of NH-37. Pilot convoy transit mandated.",
            "recommended_action": "Maintain round-the-clock patrol on animal corridors; keep medical rescue squads on standby."
        },
        {
            "id": "NESAC-ML-019",
            "source": "NESAC / Meghalaya State Disaster Management",
            "title": "Flash Flood Advisory - West Garo Hills (Jinjiram Basin)",
            "timestamp": "2024-07-03T14:00:00Z",
            "severity": "MODERATE",
            "badge_color": "#00f0ff",
            "affected_districts": ["West Garo Hills"],
            "summary": "Intense orographic precipitation in Garo Hills causing flash runoff in Tikrikilla and Phulbari plains.",
            "recommended_action": "Monitor low-lying causeways and reinforce temporary culvert protections."
        }
    ]

    return {
        "status": "success",
        "state": state,
        "active_advisories_count": len(bulletins),
        "critical_count": sum(1 for b in bulletins if b["severity"] == "CRITICAL"),
        "bulletins": bulletins,
        "river_gauges": CWC_GAUGE_STATIONS
    }
