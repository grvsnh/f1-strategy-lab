from pathlib import Path
import fastf1
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parents[3]
CACHE_DIR = BASE_DIR / "data" / "raw"

CACHE_DIR.mkdir(parents=True, exist_ok=True)
fastf1.Cache.enable_cache(str(CACHE_DIR))

DEFAULT_DRIVERS = ["VER", "HAM", "LEC", "NOR", "PIA", "SAI", "RUS", "PER", "ALO", "TSU", "GAS", "OCO", "HUL", "ALB"]

@lru_cache(maxsize=32)
def get_fast_race_info(year: int, grand_prix: str, session_name: str = "R"):
    """
    Super fast driver list & session info loader (< 0.1s).
    Only loads driver_info and session_info without heavy telemetry or weather data.
    """
    if year >= 2025:
        return {
            "event": grand_prix,
            "location": grand_prix,
            "country": "F1 Circuit",
            "year": year,
            "session": session_name,
            "drivers": DEFAULT_DRIVERS,
        }

    try:
        session = fastf1.get_session(year, grand_prix, session_name)
        session.load(laps=False, telemetry=False, weather=False, messages=False)
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
        print(f"Fast driver info fallback for {grand_prix}: {e}")

    return {
        "event": grand_prix,
        "location": grand_prix,
        "country": "F1 Circuit",
        "year": year,
        "session": session_name,
        "drivers": DEFAULT_DRIVERS,
    }


def get_race_info(year: int, grand_prix: str, session_name: str = "R"):
    return get_fast_race_info(year, grand_prix, session_name)


def get_event_sessions(year: int, grand_prix: str):
    return [
        {"code": "FP1", "name": "Free Practice 1"},
        {"code": "FP2", "name": "Free Practice 2"},
        {"code": "FP3", "name": "Free Practice 3"},
        {"code": "Q", "name": "Qualifying"},
        {"code": "S", "name": "Sprint"},
        {"code": "R", "name": "Race"},
    ]
