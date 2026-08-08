import math
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def generate_fallback_outline(grand_prix: str, year: int):
    x, y, speed = [], [], []
    for i in range(350):
        angle = (i / 350.0) * 2 * math.pi
        r = 5000 + 1500 * math.sin(3 * angle) + 800 * math.cos(5 * angle)
        x.append(r * math.cos(angle))
        y.append(r * math.sin(angle))
        speed.append(210 + 65 * math.sin(4 * angle))

    return {
        "circuit": grand_prix,
        "location": grand_prix,
        "year": year,
        "x": [round(v, 1) for v in x],
        "y": [round(v, 1) for v in y],
        "speed": [round(v, 1) for v in speed],
        "driver": "REF",
    }


def get_track_outline(year: int, grand_prix: str, session_name: str = "R"):
    try:
        session = get_cached_session(year, grand_prix, session_name)
        fastest_lap = session.laps.pick_fastest()

        if fastest_lap is not None and not fastest_lap.empty:
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
    except Exception as e:
        print(f"FastF1 track outline fallback: {e}")

    return generate_fallback_outline(grand_prix, year)
