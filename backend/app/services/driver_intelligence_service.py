from app.services.session_cache import get_cached_session


def get_driver_intelligence(year: int, grand_prix: str, driver: str, session_name: str = "R"):
    session = get_cached_session(year, grand_prix, session_name)

    laps = session.laps.pick_drivers(driver)
    if laps.empty:
        return {
            "driver": driver,
            "fastest_lap": None,
            "top_speed": 0,
            "total_laps": 0,
            "stint_compounds": [],
            "pit_stops": 0,
            "sector_1": None,
            "sector_2": None,
            "sector_3": None,
        }

    fastest_lap = laps.pick_fastest()
    telemetry = fastest_lap.get_car_data() if fastest_lap is not None else None
    top_speed = float(telemetry["Speed"].max()) if telemetry is not None and not telemetry.empty else 0.0

    compounds = laps["Compound"].dropna().unique().tolist() if "Compound" in laps.columns else []
    pit_stops = len(laps[laps["PitOutTime"].notnull()]) if "PitOutTime" in laps.columns else 0

    def format_td(td):
        if td is None or str(td) == "NaT":
            return None
        return round(td.total_seconds(), 3)

    return {
        "driver": driver,
        "fastest_lap_time": format_td(fastest_lap["LapTime"]) if fastest_lap is not None else None,
        "lap_number": int(fastest_lap["LapNumber"]) if fastest_lap is not None else None,
        "top_speed": round(top_speed, 1),
        "total_laps": len(laps),
        "stint_compounds": [str(c) for c in compounds],
        "pit_stops": pit_stops,
        "sector_1": format_td(fastest_lap["Sector1Time"]) if fastest_lap is not None else None,
        "sector_2": format_td(fastest_lap["Sector2Time"]) if fastest_lap is not None else None,
        "sector_3": format_td(fastest_lap["Sector3Time"]) if fastest_lap is not None else None,
    }
