import fastf1
from functools import lru_cache

@lru_cache(maxsize=32)
def get_cached_session(year: int, grand_prix: str, session_name: str = "R"):
    """
    Loads and caches FastF1 Session object in memory efficiently.
    For future/current unreleased seasons (2025, 2026+), immediately raises Exception
    so that services return instant fallback telemetry without Ergast API network timeouts.
    """
    if year >= 2025:
        raise ValueError(f"Session data for {year} is live/simulated; using instant telemetry engine.")

    try:
        session = fastf1.get_session(year, grand_prix, session_name)
        session.load(telemetry=True, laps=True, weather=False, messages=False)
        return session
    except Exception as e:
        print(f"Session cache fallback for {year} {grand_prix}: {e}")
        raise e
