import fastf1


def get_track_map(year: int, grand_prix: str, driver: str, session_name: str = "R"):
    session = fastf1.get_session(year, grand_prix, session_name)
    session.load()

    laps = session.laps.pick_drivers(driver)
    if laps.empty:
        return {"driver": driver, "x": [], "y": [], "speed": []}

    fastest_lap = laps.pick_fastest()
    position = fastest_lap.get_pos_data()
    telemetry = fastest_lap.get_car_data()

    min_len = min(len(position), len(telemetry))

    return {
        "driver": driver,
        "x": position["X"].fillna(0).tolist()[:min_len],
        "y": position["Y"].fillna(0).tolist()[:min_len],
        "speed": telemetry["Speed"].fillna(0).tolist()[:min_len],
    }
