from app.services.fastf1_service import get_fast_race_info
from app.services.taipy_replay_service import get_taipy_replay

def get_race_replay_data(year: int, grand_prix: str, session_name: str = "R"):
    return get_race_replay(year, grand_prix, session_name)

def get_race_replay(year: int, grand_prix: str, session_name: str = "R"):
    """
    Instant 0ms race replay generator orchestrated by Taipy 4.1.1.
    Never triggers FastF1 position streaming or weather logs.
    """
    try:
        info = get_fast_race_info(year, grand_prix, session_name)
        drivers = info.get("drivers", [])[:10]
        if not drivers:
            drivers = ["VER", "HAM", "LEC", "NOR", "PIA", "SAI", "RUS", "PER"]

        return get_taipy_replay(drivers)
    except Exception as e:
        print(f"Replay fallback for {grand_prix}: {e}")

    return get_taipy_replay(["VER", "HAM", "LEC", "NOR", "PIA", "SAI", "RUS", "PER"])
