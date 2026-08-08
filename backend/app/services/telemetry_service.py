from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def get_driver_telemetry(year: int, grand_prix: str, driver: str, session_name: str = "R"):
    session = get_cached_session(year, grand_prix, session_name)

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

    speed = telemetry["Speed"].fillna(0).tolist()
    throttle = telemetry["Throttle"].fillna(0).tolist()
    brake = telemetry["Brake"].fillna(0).astype(int).tolist()
    rpm = telemetry["RPM"].fillna(0).tolist()
    gear = telemetry["nGear"].fillna(0).tolist()
    drs = telemetry["DRS"].fillna(0).tolist()

    samples = list(range(len(speed)))

    return {
        "driver": driver,
        "speed": downsample_list(speed),
        "throttle": downsample_list(throttle),
        "brake": downsample_list(brake),
        "rpm": downsample_list(rpm),
        "gear": downsample_list(gear),
        "drs": downsample_list(drs),
        "samples": downsample_list(samples),
    }
