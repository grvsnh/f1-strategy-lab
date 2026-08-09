from app.services.session_cache import get_cached_session

def generate_fallback_recommendation(driver: str):
    return {
        "driver": driver,
        "current_compound": "MEDIUM",
        "current_tyre_life": 18,
        "recommended_pit_lap": 22,
        "remaining_laps": 39,
        "message": "PIT WINDOW OPEN IN 4 LAPS - SWITCH TO HARD",
    }

def get_strategy_recommendation(year: int, grand_prix: str, driver: str, session_name: str = "R"):
    return get_recommendation(year, grand_prix, driver, session_name)

def get_recommendation(
    year: int,
    grand_prix: str,
    driver: str,
    session_name: str = "R",
):
    try:
        session = get_cached_session(year, grand_prix, session_name)
        laps = session.laps.pick_drivers(driver)

        if not laps.empty and "Compound" in laps.columns:
            total_laps = len(laps)
            last_lap = laps.iloc[-1]
            current_compound = str(last_lap.get("Compound", "MEDIUM"))

            stints = laps["Stint"].tolist() if "Stint" in laps.columns else [1]
            current_stint_laps = stints.count(stints[-1]) if stints else 15

            return {
                "driver": driver,
                "current_compound": current_compound,
                "current_tyre_life": current_stint_laps,
                "recommended_pit_lap": min(total_laps, current_stint_laps + 5),
                "remaining_laps": max(0, 57 - total_laps),
                "message": f"MAINTAIN PACING - PIT WINDOW PREDICTED AT LAP {current_stint_laps + 5}",
            }
    except Exception as e:
        print(f"Recommendation fallback for {driver}: {e}")

    return generate_fallback_recommendation(driver)
