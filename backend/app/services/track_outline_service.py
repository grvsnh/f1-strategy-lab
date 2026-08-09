import json
import math
from pathlib import Path
from app.utils.downsample import downsample_list

GEOJSON_PATH = Path(__file__).resolve().parents[2] / "f1-circuits.geojson"

CIRCUITS_CACHE = {}

def load_circuits():
    if CIRCUITS_CACHE:
        return CIRCUITS_CACHE
    if not GEOJSON_PATH.exists():
        return CIRCUITS_CACHE

    try:
        with open(GEOJSON_PATH, "r") as f:
            data = json.load(f)
        for feat in data.get("features", []):
            props = feat.get("properties", {})
            loc = props.get("Location", "")
            coords = feat.get("geometry", {}).get("coordinates", [])
            if loc and coords:
                CIRCUITS_CACHE[loc.lower()] = {
                    "circuit": props.get("Name", loc),
                    "location": loc,
                    "coords": coords,
                }
    except Exception as e:
        print(f"Error loading f1-circuits.geojson: {e}")
    return CIRCUITS_CACHE


def get_track_outline(year: int, grand_prix: str, session_name: str = "R"):
    """
    Instant 0ms track outline generator using offline bacinger/f1-circuits GeoJSON dataset.
    Never triggers FastF1 network downloads or position logs.
    """
    circuits = load_circuits()
    gp_lower = grand_prix.lower()

    matched = None
    for loc_key, c_data in circuits.items():
        if loc_key in gp_lower or gp_lower in loc_key or c_data["circuit"].lower() in gp_lower:
            matched = c_data
            break

    if matched and matched["coords"]:
        coords = matched["coords"]
        x = [c[0] for c in coords]
        y = [c[1] for c in coords]
        # Generate simulated speed vector for color grading
        speed = [180 + 80 * math.sin(i / 10.0) for i in range(len(x))]
        return {
            "circuit": matched["circuit"],
            "location": matched["location"],
            "year": year,
            "x": downsample_list(x),
            "y": downsample_list(y),
            "speed": [round(s, 1) for s in downsample_list(speed)],
            "driver": "REF",
        }

    # Fallback parametric circuit curve
    x, y, speed = [], [], []
    for i in range(250):
        angle = (i / 250.0) * 2 * math.pi
        r = 5000 + 1500 * math.sin(3 * angle) + 800 * math.cos(5 * angle)
        x.append(r * math.cos(angle))
        y.append(r * math.sin(angle))
        speed.append(210 + 65 * math.sin(4 * angle))

    return {
        "circuit": grand_prix,
        "location": grand_prix,
        "year": year,
        "x": [round(v, 1) for v in x],
        "y": [round(v, 1) for v in y],
        "speed": [round(v, 1) for v in speed],
        "driver": "REF",
    }
