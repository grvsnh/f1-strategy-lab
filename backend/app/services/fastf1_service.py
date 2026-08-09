from pathlib import Path
import fastf1
from app.services.session_cache import get_cached_session

BASE_DIR = Path(__file__).resolve().parents[3]
CACHE_DIR = BASE_DIR / "data" / "raw"

CACHE_DIR.mkdir(parents=True, exist_ok=True)
fastf1.Cache.enable_cache(str(CACHE_DIR))

DEFAULT_DRIVERS = ["VER", "HAM", "LEC", "NOR", "PIA", "SAI", "RUS", "PER", "ALO", "TSU", "GAS", "OCO", "HUL", "ALB"]

def get_race_info(year: int, grand_prix: str, session_name: str = "R"):
    try:
        session = get_cached_session(year, grand_prix, session_name)
        drivers = session.results["Abbreviation"].dropna().tolist() if hasattr(session.results, "Abbreviation") and not session.results.empty else DEFAULT_DRIVERS
        if not drivers:
            drivers = DEFAULT_DRIVERS
        return {
            "event": str(session.event.get("EventName", grand_prix)),
            "location": str(session.event.get("Location", grand_prix)),
            "country": str(session.event.get("Country", "Global")),
            "year": year,
            "session": session_name,
            "drivers": drivers,
        }
    except Exception as e:
        print(f"Fallback race info for {grand_prix}: {e}")

    return {
        "event": grand_prix,
        "location": grand_prix,
        "country": "F1 Circuit",
        "year": year,
        "session": session_name,
        "drivers": DEFAULT_DRIVERS,
    }


def get_event_sessions(year: int, grand_prix: str):
    return [
        {"code": "FP1", "name": "Free Practice 1"},
        {"code": "FP2", "name": "Free Practice 2"},
        {"code": "FP3", "name": "Free Practice 3"},
        {"code": "Q", "name": "Qualifying"},
        {"code": "S", "name": "Sprint"},
        {"code": "R", "name": "Race"},
    ]
