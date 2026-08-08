import fastf1


def get_track_outline(year: int, grand_prix: str, session_name: str = "R"):
    session = fastf1.get_session(year, grand_prix, session_name)
    session.load()

    # Get fastest lap of session regardless of driver for track geometry
    fastest_lap = session.laps.pick_fastest()
    if fastest_lap is None or fastest_lap.empty:
        return {"x": [], "y": [], "circuit": grand_prix, "year": year}

    pos = fastest_lap.get_pos_data()
    tel = fastest_lap.get_car_data()

    min_len = min(len(pos), len(tel))

    return {
        "circuit": session.event["EventName"],
        "location": session.event["Location"],
        "year": year,
        "x": pos["X"].fillna(0).tolist()[:min_len],
        "y": pos["Y"].fillna(0).tolist()[:min_len],
        "speed": tel["Speed"].fillna(0).tolist()[:min_len],
        "driver": str(fastest_lap["Driver"]),
    }
