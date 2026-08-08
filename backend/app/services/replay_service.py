from typing import Dict, Any, List
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def get_race_replay(year: int, grand_prix: str, session_name: str = "R") -> Dict[str, Any]:
    session = get_cached_session(year, grand_prix, session_name)

    drivers = session.results["Abbreviation"].dropna().tolist() if hasattr(session.results, "Abbreviation") else []
    
    driver_replays = {}
    max_laps = int(session.laps["LapNumber"].max()) if not session.laps.empty else 50

    for drv in drivers:
        laps = session.laps.pick_drivers(drv)
        if laps.empty:
            continue

        try:
            pos_data = laps.get_pos_data()
            if pos_data.empty:
                continue

            x = pos_data["X"].fillna(0).tolist()
            y = pos_data["Y"].fillna(0).tolist()
            
            # Downsample to 200 frame points for high-performance 60fps canvas animation
            x_ds = downsample_list(x, max_points=200)
            y_ds = downsample_list(y, max_points=200)

            driver_replays[drv] = {
                "driver": drv,
                "x": x_ds,
                "y": y_ds,
                "total_points": len(x_ds),
            }
        except Exception:
            continue

    # Get track reference outline for replay canvas background
    fastest_lap = session.laps.pick_fastest()
    track_outline = {"x": [], "y": []}
    if fastest_lap is not None and not fastest_lap.empty:
        pos = fastest_lap.get_pos_data()
        if not pos.empty:
            track_outline["x"] = downsample_list(pos["X"].fillna(0).tolist(), max_points=350)
            track_outline["y"] = downsample_list(pos["Y"].fillna(0).tolist(), max_points=350)

    return {
        "year": year,
        "grand_prix": grand_prix,
        "session": session_name,
        "total_laps": max_laps,
        "track_outline": track_outline,
        "drivers": list(driver_replays.keys()),
        "replays": driver_replays,
    }
