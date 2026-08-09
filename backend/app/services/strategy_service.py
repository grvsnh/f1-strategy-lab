from app.services.session_cache import get_cached_session

def generate_fallback_strategy(driver: str):
    return {
        "driver": driver,
        "stints": [
            {"compound": "MEDIUM", "start_lap": 1, "end_lap": 22},
            {"compound": "HARD", "start_lap": 23, "end_lap": 57},
        ],
    }

def get_strategy(
    year: int,
    grand_prix: str,
    driver: str,
    session_name: str = "R",
):
    try:
        session = get_cached_session(year, grand_prix, session_name)
        laps = session.laps.pick_drivers(driver)

        if not laps.empty and "Compound" in laps.columns:
            compounds = laps["Compound"].fillna("MEDIUM").tolist()
            if compounds:
                stints = []
                start_lap = 1
                current_compound = compounds[0]

                for i in range(1, len(compounds)):
                    if compounds[i] != compounds[i - 1]:
                        stints.append(
                            {
                                "compound": current_compound,
                                "start_lap": start_lap,
                                "end_lap": i,
                            }
                        )
                        start_lap = i + 1
                        current_compound = compounds[i]

                stints.append(
                    {
                        "compound": current_compound,
                        "start_lap": start_lap,
                        "end_lap": len(compounds),
                    }
                )

                return {
                    "driver": driver,
                    "stints": stints,
                }
    except Exception as e:
        print(f"Strategy fallback for {driver}: {e}")

    return generate_fallback_strategy(driver)
