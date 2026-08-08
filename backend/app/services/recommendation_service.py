from app.services.session_cache import get_cached_session

SOFT_MAX = 18
MEDIUM_MAX = 25
HARD_MAX = 32


def get_strategy_recommendation(
    year: int,
    grand_prix: str,
    driver: str,
    session_name: str = "R",
):
    session = get_cached_session(year, grand_prix, session_name)

    laps = session.laps.pick_drivers(driver)
    if laps.empty:
        return {
            "driver": driver,
            "current_compound": "UNKNOWN",
            "current_tyre_life": 0,
            "recommended_pit_lap": 0,
            "remaining_laps": 0,
            "message": "NO LAP DATA",
        }

    latest_lap = laps.iloc[-1]
    compound = str(latest_lap.get("Compound", "MEDIUM"))
    tyre_life = int(latest_lap.get("TyreLife", 1))

    max_life = {
        "SOFT": SOFT_MAX,
        "MEDIUM": MEDIUM_MAX,
        "HARD": HARD_MAX,
    }.get(compound, 20)

    remaining_laps = max_life - tyre_life

    if remaining_laps <= 0:
        message = "BOX THIS LAP"
    elif remaining_laps <= 3:
        message = "PIT WINDOW OPEN"
    else:
        message = "STAY OUT"

    lap_num = int(latest_lap.get("LapNumber", 1))

    return {
        "driver": driver,
        "current_compound": compound,
        "current_tyre_life": tyre_life,
        "recommended_pit_lap": lap_num + max(remaining_laps, 0),
        "remaining_laps": remaining_laps,
        "message": message,
    }
