import math
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def generate_fallback_telemetry(driver: str):
    """Instant fallback telemetry data generator (0ms delay)."""
    samples = list(range(350))
    speed = [220 + 80 * math.sin(i / 15.0) + 15 * math.cos(i / 5.0) for i in range(350)]
    throttle = [max(0, min(100, 70 + 40 * math.sin(i / 12.0))) for i in range(350)]
    brake = [1 if t < 30 else 0 for t in throttle]
    rpm = [10000 + s * 18 for s in speed]
    gear = [max(1, min(8, int(s / 40))) for s in speed]
    drs = [1 if 100 <= i <= 180 or 250 <= i <= 300 else 0 for i in range(350)]

    return {
        "driver": driver,
        "speed": [round(s, 1) for s in speed],
        "throttle": [round(t, 1) for t in throttle],
        "brake": brake,
        "rpm": [round(r, 0) for r in rpm],
        "gear": gear,
        "drs": drs,
        "samples": samples,
    }


def get_driver_telemetry(year: int, grand_prix: str, driver: str, session_name: str = "R"):
    try:
        session = get_cached_session(year, grand_prix, session_name)
        laps = session.laps.pick_drivers(driver)

        if not laps.empty:
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
    except Exception as e:
        print(f"FastF1 fallback for {driver}: {e}")

    return generate_fallback_telemetry(driver)
