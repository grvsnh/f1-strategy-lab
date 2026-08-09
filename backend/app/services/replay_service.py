import math
from app.services.fastf1_service import get_fast_race_info

def generate_fallback_replay(drivers=None):
    if not drivers:
        drivers = ["VER", "HAM", "LEC", "NOR", "PIA", "SAI", "RUS", "PER"]
    frames = []
    for f_idx in range(120):
        frame_drivers = {}
        for d_idx, drv in enumerate(drivers):
            angle = (f_idx * 3 + d_idx * 15) * (math.pi / 180.0)
            r = 4500 + 1200 * math.sin(3 * angle)
            x = r * math.cos(angle)
            y = r * math.sin(angle)
            speed = 220 + 60 * math.sin(4 * angle)
            frame_drivers[drv] = {
                "x": round(x, 1),
                "y": round(y, 1),
                "speed": round(speed, 1),
                "position": d_idx + 1,
            }
        frames.append({
            "frame": f_idx,
            "lap": int(f_idx / 2.5) + 1,
            "drivers": frame_drivers,
        })
    return {"total_frames": len(frames), "total_laps": 57, "drivers": drivers, "frames": frames}

def get_race_replay_data(year: int, grand_prix: str, session_name: str = "R"):
    return get_race_replay(year, grand_prix, session_name)

def get_race_replay(year: int, grand_prix: str, session_name: str = "R"):
    """
    Instant 0ms race replay generator using fast race info.
    Never triggers FastF1 position streaming or weather logs.
    """
    try:
        info = get_fast_race_info(year, grand_prix, session_name)
        drivers = info.get("drivers", [])[:10]
        if not drivers:
            drivers = ["VER", "HAM", "LEC", "NOR", "PIA", "SAI", "RUS", "PER"]

        return generate_fallback_replay(drivers)
    except Exception as e:
        print(f"Replay fallback for {grand_prix}: {e}")

    return generate_fallback_replay()
