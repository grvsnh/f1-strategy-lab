import fastf1


def get_driver_telemetry(year: int, grand_prix: str, driver: str, session_name: str = "R"):
    session = fastf1.get_session(year, grand_prix, session_name)
    session.load()

    laps = session.laps.pick_drivers(driver)
    if laps.empty:
        return {
            "driver": driver,
            "speed": [],
            "throttle": [],
            "brake": [],
            "rpm": [],
            "gear": [],
            "drs": [],
            "samples": [],
        }

    fastest_lap = laps.pick_fastest()
    telemetry = fastest_lap.get_car_data().reset_index(drop=True)

    return {
        "driver": driver,
        "speed": telemetry["Speed"].fillna(0).tolist(),
        "throttle": telemetry["Throttle"].fillna(0).tolist(),
        "brake": telemetry["Brake"].fillna(0).astype(int).tolist(),
        "rpm": telemetry["RPM"].fillna(0).tolist(),
        "gear": telemetry["nGear"].fillna(0).tolist(),
        "drs": telemetry["DRS"].fillna(0).tolist(),
        "samples": list(range(len(telemetry))),
    }
