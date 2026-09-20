"""
Core configuration settings for North East India Satellite Flood Intelligence Backend.
"""
from typing import Dict, List, Any
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "North East India AI Satellite Flood Intelligence System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Regional Bounds & Centers (North East India: Assam, Meghalaya, Arunachal Pradesh)
    REGIONAL_COORDINATES: Dict[str, Dict[str, Any]] = {
        "Assam": {
            "center": [26.2006, 92.9376],
            "zoom": 8,
            "districts": {
                "Kaziranga / Golaghat": {
                    "center": [26.5775, 93.1711],
                    "bbox": [92.8, 26.4, 93.6, 26.8],
                    "river": "Brahmaputra Basin",
                    "cwc_station": "Numaligarh / Dhansiri"
                },
                "Majuli": {
                    "center": [26.9535, 94.2037],
                    "bbox": [93.9, 26.8, 27.2, 94.4],
                    "river": "Subansiri & Brahmaputra Confluence",
                    "cwc_station": "Nimati Ghat"
                },
                "Dhubri": {
                    "center": [26.0207, 89.9754],
                    "bbox": [89.7, 25.8, 90.3, 26.3],
                    "river": "Lower Brahmaputra / Indo-Bangladesh Border",
                    "cwc_station": "Dhubri Port"
                },
                "Kamrup (Guwahati)": {
                    "center": [26.1445, 91.7362],
                    "bbox": [91.4, 25.9, 92.0, 26.4],
                    "river": "Brahmaputra Mainstream",
                    "cwc_station": "DC Court Guwahati"
                },
                "Morigaon": {
                    "center": [26.2500, 92.3400],
                    "bbox": [92.1, 26.0, 92.6, 26.5],
                    "river": "Kopili & Brahmaputra",
                    "cwc_station": "Kopili / Kampur"
                },
                "Dhemaji": {
                    "center": [27.4800, 94.5800],
                    "bbox": [94.2, 27.2, 95.0, 27.8],
                    "river": "Jiadhal & Brahmaputra",
                    "cwc_station": "Pasighat Downstream"
                },
                "Barpeta": {
                    "center": [26.3200, 91.0000],
                    "bbox": [90.7, 26.1, 91.3, 26.6],
                    "river": "Beki & Manas",
                    "cwc_station": "Beki Bridge"
                }
            }
        },
        "Meghalaya": {
            "center": [25.4670, 91.3662],
            "zoom": 8,
            "districts": {
                "West Garo Hills": {
                    "center": [25.5144, 90.2032],
                    "bbox": [89.8, 25.2, 90.5, 25.9],
                    "river": "Jinjiram & Brahmaputra Tributaries",
                    "cwc_station": "Tikrikilla"
                },
                "South Garo Hills": {
                    "center": [25.3200, 90.6300],
                    "bbox": [90.3, 25.1, 90.9, 25.6],
                    "river": "Simsang River",
                    "cwc_station": "Baghmara"
                }
            }
        },
        "Arunachal Pradesh": {
            "center": [28.2180, 94.7278],
            "zoom": 7,
            "districts": {
                "East Siang (Pasighat)": {
                    "center": [28.0667, 95.3333],
                    "bbox": [95.0, 27.8, 95.7, 28.4],
                    "river": "Siang / Tsangpo Gorge",
                    "cwc_station": "Pasighat Hydrology"
                },
                "Lohit": {
                    "center": [27.9200, 96.1700],
                    "bbox": [95.8, 27.6, 96.6, 28.2],
                    "river": "Lohit River",
                    "cwc_station": "Tezu Downstream"
                }
            }
        },
        "Kerala": {
            "center": [10.1632, 76.6413],
            "zoom": 8,
            "districts": {
                "Ernakulam / Aluva (Periyar)": {
                    "center": [10.1076, 76.3516],
                    "bbox": [76.1, 9.9, 76.6, 10.3],
                    "river": "Periyar River Basin",
                    "cwc_station": "Aluva Manappuram"
                },
                "Kuttanad (Alappuzha)": {
                    "center": [9.4981, 76.3388],
                    "bbox": [76.2, 9.3, 76.6, 9.7],
                    "river": "Pamba & Meenachil Rivers",
                    "cwc_station": "Champakulam"
                },
                "Idukki Lowlands": {
                    "center": [9.8497, 76.9806],
                    "bbox": [76.7, 9.6, 77.2, 10.1],
                    "river": "Periyar Reservoir System",
                    "cwc_station": "Cheruthoni Spillway"
                }
            }
        }
    }

    # SAR Sentinel-1 Processing Constants
    SAR_SENSOR: str = "COPERNICUS/S1_GRD"
    SAR_INSTRUMENT_MODE: str = "IW"  # Interferometric Wide Swath
    SAR_POLARIZATIONS: List[str] = ["VV", "VH"]
    BACKSCATTER_DIFF_THRESHOLD_DB: float = -3.0  # Decibel reduction threshold indicating specular water reflection
    PERMANENT_WATER_THRESHOLD_PERCENT: float = 80.0  # JRC Occurrence threshold
    SPECKLE_FILTER_KERNEL_SIZE: int = 5

settings = Settings()
