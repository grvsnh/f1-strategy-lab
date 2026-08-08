from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def get_track_outline(year: int, grand_prix: str, session_name: str = "R"):
    session = get_cached_session(year, grand_prix, session_name)

    fastest_lap = session.laps.pick_fastest()
    if fastest_lap is None or fastest_lap.empty:
        return {"x": [], "y": [], "circuit": grand_prix, "year": year}

    pos = fastest_lap.get_pos_data()
    tel = fastest_lap.get_car_data()

    min_len = min(len(pos), len(tel))

    x = pos["X"].fillna(0).tolist()[:min_len]
    y = pos["Y"].fillna(0).tolist()[:min_len]
    speed = tel["Speed"].fillna(0).tolist()[:min_len]

    return {
        "circuit": session.event["EventName"],
        "location": session.event["Location"],
        "year": year,
        "x": downsample_list(x),
        "y": downsample_list(y),
        "speed": downsample_list(speed),
        "driver": str(fastest_lap["Driver"]),
    }
