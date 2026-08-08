from pathlib import Path
import fastf1

BASE_DIR = Path(__file__).resolve().parents[3]
CACHE_DIR = BASE_DIR / "data" / "raw"

CACHE_DIR.mkdir(parents=True, exist_ok=True)

fastf1.Cache.enable_cache(str(CACHE_DIR))


def get_race_info(year: int, grand_prix: str, session_name: str = "R"):
    session = fastf1.get_session(year, grand_prix, session_name)
    session.load()

    drivers = session.results["Abbreviation"].dropna().tolist() if hasattr(session.results, "Abbreviation") else []

    return {
        "event": session.event["EventName"],
        "location": session.event["Location"],
        "country": session.event["Country"],
        "year": year,
        "session": session_name,
        "drivers": drivers,
    }


def get_event_sessions(year: int, grand_prix: str):
    # Standard F1 session identifiers
    return [
        {"code": "FP1", "name": "Free Practice 1"},
        {"code": "FP2", "name": "Free Practice 2"},
        {"code": "FP3", "name": "Free Practice 3"},
        {"code": "Q", "name": "Qualifying"},
        {"code": "S", "name": "Sprint"},
        {"code": "R", "name": "Race"},
    ]
