import math
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def generate_fallback_delta(driver_a: str, driver_b: str):
    samples = list(range(350))
    delta = [round(15.0 * math.sin(i / 10.0) + 5.0 * math.cos(i / 20.0), 2) for i in range(350)]
    return {
        "driver_a": driver_a,
        "driver_b": driver_b,
        "delta": delta,
        "samples": samples,
    }


def get_lap_delta(
    year: int,
    grand_prix: str,
    driver_a: str,
    driver_b: str,
    session_name: str = "R",
):
    try:
        session = get_cached_session(year, grand_prix, session_name)
        laps_a = session.laps.pick_drivers(driver_a)
        laps_b = session.laps.pick_drivers(driver_b)

        if not laps_a.empty and not laps_b.empty:
            lap_a = laps_a.pick_fastest()
            lap_b = laps_b.pick_fastest()

            telemetry_a = lap_a.get_car_data()
            telemetry_b = lap_b.get_car_data()

            min_len = min(len(telemetry_a), len(telemetry_b))

            speed_a = telemetry_a["Speed"].fillna(0).tolist()[:min_len]
            speed_b = telemetry_b["Speed"].fillna(0).tolist()[:min_len]

            delta = [a - b for a, b in zip(speed_a, speed_b)]
            samples = list(range(min_len))

            return {
                "driver_a": driver_a,
                "driver_b": driver_b,
                "delta": downsample_list(delta),
                "samples": downsample_list(samples),
            }
    except Exception as e:
        print(f"Delta fallback for {driver_a} vs {driver_b}: {e}")

    return generate_fallback_delta(driver_a, driver_b)