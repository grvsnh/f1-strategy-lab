import math
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def generate_fallback_track(driver: str):
    """Instant track coordinates generator."""
    x, y, speed = [], [], []
    for i in range(350):
        angle = (i / 350.0) * 2 * math.pi
        r = 5000 + 1500 * math.sin(3 * angle) + 800 * math.cos(5 * angle)
        x.append(r * math.cos(angle))
        y.append(r * math.sin(angle))
        speed.append(200 + 70 * math.sin(4 * angle))

    return {
        "driver": driver,
        "x": [round(v, 1) for v in x],
        "y": [round(v, 1) for v in y],
        "speed": [round(v, 1) for v in speed],
    }


def get_track_map(year: int, grand_prix: str, driver: str, session_name: str = "R"):
    try:
        session = get_cached_session(year, grand_prix, session_name)
        laps = session.laps.pick_drivers(driver)

        if not laps.empty:
            fastest_lap = laps.pick_fastest()
            position = fastest_lap.get_pos_data()
            telemetry = fastest_lap.get_car_data()

            min_len = min(len(position), len(telemetry))
            x = position["X"].fillna(0).tolist()[:min_len]
            y = position["Y"].fillna(0).tolist()[:min_len]
            speed = telemetry["Speed"].fillna(0).tolist()[:min_len]

            return {
                "driver": driver,
                "x": downsample_list(x),
                "y": downsample_list(y),
                "speed": downsample_list(speed),
            }
    except Exception as e:
        print(f"FastF1 track fallback for {driver}: {e}")

    return generate_fallback_track(driver)
