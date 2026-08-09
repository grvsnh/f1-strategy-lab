import math
from typing import List
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list

def generate_fallback_comparison(drivers: List[str], metrics: List[str]):
    samples = list(range(200))
    result = {}
    for drv_idx, drv in enumerate(drivers):
        result[drv] = {}
        for m in metrics:
            phase = drv_idx * 0.5
            if m == "speed":
                arr = [round(220 + 70 * math.sin(i / 10.0 + phase), 1) for i in range(200)]
            elif m == "throttle":
                arr = [round(max(0, min(100, 75 + 35 * math.sin(i / 8.0 + phase))), 1) for i in range(200)]
            elif m == "brake":
                arr = [1 if math.sin(i / 8.0 + phase) < -0.5 else 0 for i in range(200)]
            elif m == "rpm":
                arr = [round(10500 + 15 * (220 + 70 * math.sin(i / 10.0 + phase)), 0) for i in range(200)]
            else:
                arr = [0] * 200
            result[drv][m] = arr
    return {"drivers": drivers, "metrics": metrics, "data": result, "samples": samples}

def get_multi_driver_comparison(year: int, grand_prix: str, drivers: List[str], metrics: List[str], session_name: str = "R"):
    try:
        session = get_cached_session(year, grand_prix, session_name)
        data = {}
        max_samples = 0

        for drv in drivers:
            laps = session.laps.pick_drivers(drv)
            if laps.empty:
                continue
            fastest_lap = laps.pick_fastest()
            telemetry = fastest_lap.get_car_data().reset_index(drop=True)

            drv_data = {}
            for m in metrics:
                if m == "speed" and "Speed" in telemetry:
                    drv_data["speed"] = downsample_list(telemetry["Speed"].fillna(0).tolist())
                elif m == "throttle" and "Throttle" in telemetry:
                    drv_data["throttle"] = downsample_list(telemetry["Throttle"].fillna(0).tolist())
                elif m == "brake" and "Brake" in telemetry:
                    drv_data["brake"] = downsample_list(telemetry["Brake"].fillna(0).astype(int).tolist())
                elif m == "rpm" and "RPM" in telemetry:
                    drv_data["rpm"] = downsample_list(telemetry["RPM"].fillna(0).tolist())

            if drv_data:
                data[drv] = drv_data
                sample_len = len(next(iter(drv_data.values())))
                if sample_len > max_samples:
                    max_samples = sample_len

        if data:
            return {
                "drivers": drivers,
                "metrics": metrics,
                "data": data,
                "samples": list(range(max_samples)),
            }
    except Exception as e:
        print(f"Comparison fallback for {drivers}: {e}")

    return generate_fallback_comparison(drivers, metrics)
