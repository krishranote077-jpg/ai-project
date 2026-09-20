"""
Geospatial reference datasets for North East India:
- River alignments & Permanent Water (Brahmaputra, Barak, Subansiri)
- Critical Transportation Infrastructure (NH-37, NH-27, NH-15, Border Roads)
- Vulnerable Settlements & Evacuation Centers
- CWC (Central Water Commission) River Gauge Monitoring Telemetry
"""
from typing import Dict, Any, List

INFRASTRUCTURE_ROADS_GEOJSON: Dict[str, Any] = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "id": "ROAD-NH-37",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [92.5, 26.3], [92.8, 26.4], [93.1, 26.55], [93.4, 26.6], [93.8, 26.7], [94.2, 26.9]
                ]
            },
            "properties": {
                "name": "NH-37 (Asian Highway 1 - Kaziranga Wildlife Corridor)",
                "type": "National Highway",
                "status": "Partially Inundated - Traffic Restricted",
                "vulnerability": "CRITICAL",
                "submerged_km": 14.8
            }
        },
        {
            "type": "Feature",
            "id": "ROAD-NH-15",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [92.0, 26.4], [92.7, 26.7], [93.5, 26.85], [94.3, 27.2], [94.8, 27.5]
                ]
            },
            "properties": {
                "name": "NH-15 (North Bank Highway - Dhemaji / Lakhimpur)",
                "type": "National Highway",
                "status": "Overtopped at 3 locations",
                "vulnerability": "HIGH",
                "submerged_km": 21.4
            }
        },
        {
            "type": "Feature",
            "id": "ROAD-MAJULI-LINK",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [94.0, 26.9], [94.15, 26.95], [94.25, 27.0]
                ]
            },
            "properties": {
                "name": "Majuli Island Arterial Embankment Road",
                "type": "State Road & Flood Embankment",
                "status": "Embankment Breach Threat - Evacuation Priority",
                "vulnerability": "CRITICAL",
                "submerged_km": 9.2
            }
        },
        {
            "type": "Feature",
            "id": "ROAD-DHUBRI-BORDER",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [89.8, 26.0], [90.0, 26.02], [90.2, 26.1]
                ]
            },
            "properties": {
                "name": "NH-127B / Dhubri - Phulbari Transit Corridor",
                "type": "Interstate Corridor (Assam - Meghalaya)",
                "status": "Submerged Culvert - Heavy Vehicles Halted",
                "vulnerability": "HIGH",
                "submerged_km": 8.5
            }
        }
    ]
}

PERMANENT_WATER_BODIES_GEOJSON: Dict[str, Any] = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "id": "WATER-BRAHMAPUTRA-MAIN",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [89.8, 26.0], [90.5, 26.1], [91.5, 26.18], [92.8, 26.55],
                    [93.8, 26.75], [94.5, 27.15], [95.2, 27.7],
                    [95.25, 27.75], [94.45, 27.22], [93.75, 26.82],
                    [92.75, 26.62], [91.45, 26.24], [90.45, 26.15],
                    [89.75, 26.05], [89.8, 26.0]
                ]]
            },
            "properties": {
                "name": "Brahmaputra River Permanent Channel (JRC Surface Water)",
                "type": "Braided River Channel",
                "discharge_cumecs": 48500,
                "surface_occurrence": "98-100%"
            }
        },
        {
            "type": "Feature",
            "id": "WATER-DEEPOR-BEEL",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [91.64, 26.11], [91.68, 26.13], [91.70, 26.10], [91.66, 26.08], [91.64, 26.11]
                ]]
            },
            "properties": {
                "name": "Deepor Beel Ramsar Wetland Sanctuary",
                "type": "Permanent Freshwater Lake",
                "surface_occurrence": "100%"
            }
        }
    ]
}

CRITICAL_SETTLEMENTS: List[Dict[str, Any]] = [
    {"name": "Kaziranga Kohora Sector", "lat": 26.585, "lon": 93.355, "pop": 42000, "status": "Red Alert", "evac_camp": "Kohora Model School"},
    {"name": "Majuli Kamalabari", "lat": 26.938, "lon": 94.162, "pop": 85000, "status": "Emergency Evacuation", "evac_camp": "Majuli College Relief Center"},
    {"name": "Dhubri Boro Bazar", "lat": 26.022, "lon": 89.980, "pop": 120000, "status": "Waterlogged 1.2m", "evac_camp": "Govt High School Dhubri"},
    {"name": "Morigaon Lahorighat", "lat": 26.350, "lon": 92.420, "pop": 68000, "status": "Severe Bank Erosion", "evac_camp": "Lahorighat Relief Shelter"},
    {"name": "Dhemaji Jonai", "lat": 27.780, "lon": 95.150, "pop": 54000, "status": "Flash Flood Inundation", "evac_camp": "Jonai Higher Secondary School"}
]

CWC_GAUGE_STATIONS: List[Dict[str, Any]] = [
    {
        "station_id": "CWC-001",
        "station_name": "Nimati Ghat (Jorhat / Majuli)",
        "river": "Brahmaputra",
        "district": "Majuli",
        "current_level_m": 86.42,
        "danger_level_m": 85.04,
        "highest_flood_level_m": 87.37,
        "trend": "RISING",
        "status": "CRITICAL"
    },
    {
        "station_id": "CWC-002",
        "station_name": "Dhubri Port",
        "river": "Brahmaputra",
        "district": "Dhubri",
        "current_level_m": 30.15,
        "danger_level_m": 28.62,
        "highest_flood_level_m": 30.36,
        "trend": "RISING",
        "status": "CRITICAL"
    },
    {
        "station_id": "CWC-003",
        "station_name": "DC Court Guwahati",
        "river": "Brahmaputra",
        "district": "Kamrup (Guwahati)",
        "current_level_m": 49.88,
        "danger_level_m": 49.68,
        "highest_flood_level_m": 51.46,
        "trend": "STEADY",
        "status": "WARNING"
    },
    {
        "station_id": "CWC-004",
        "station_name": "Numaligarh (Dhansiri)",
        "river": "Dhansiri South",
        "district": "Golaghat / Kaziranga",
        "current_level_m": 78.90,
        "danger_level_m": 77.42,
        "highest_flood_level_m": 79.84,
        "trend": "FALLING",
        "status": "WARNING"
    },
    {
        "station_id": "CWC-005",
        "station_name": "Kampur (Kopili)",
        "river": "Kopili",
        "district": "Morigaon",
        "current_level_m": 61.20,
        "danger_level_m": 60.50,
        "highest_flood_level_m": 62.15,
        "trend": "RISING",
        "status": "CRITICAL"
    }
]
