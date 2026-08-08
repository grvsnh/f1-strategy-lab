import fastf1
from typing import List, Dict, Any


def get_multi_driver_comparison(
    year: int,
    grand_prix: str,
    drivers: List[str],
    metrics: List[str],
    session_name: str = "R",
) -> Dict[str, Any]:
    session = fastf1.get_session(year, grand_prix, session_name)
    session.load()

    result = {
        "year": year,
        "grand_prix": grand_prix,
        "session": session_name,
        "metrics": metrics,
        "drivers_data": {},
    }

    for drv in drivers:
        laps = session.laps.pick_drivers(drv)
        if laps.empty:
            continue

        fastest_lap = laps.pick_fastest()
        car_data = fastest_lap.get_car_data().reset_index(drop=True)

        driver_metric_data = {"lap_time": float(fastest_lap["LapTime"].total_seconds()) if fastest_lap["LapTime"] is not None and str(fastest_lap["LapTime"]) != "NaT" else None}

        if "speed" in metrics:
            driver_metric_data["speed"] = car_data["Speed"].fillna(0).tolist()
        if "throttle" in metrics:
            driver_metric_data["throttle"] = car_data["Throttle"].fillna(0).tolist()
        if "brake" in metrics:
            driver_metric_data["brake"] = car_data["Brake"].fillna(0).astype(int).tolist()
        if "rpm" in metrics:
            driver_metric_data["rpm"] = car_data["RPM"].fillna(0).tolist()

        driver_metric_data["samples"] = list(range(len(car_data)))
        result["drivers_data"][drv] = driver_metric_data

    return result
