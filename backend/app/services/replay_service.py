import math
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list

def generate_fallback_replay():
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
    try:
        session = get_cached_session(year, grand_prix, session_name)
        drivers = session.results["Abbreviation"].dropna().tolist()[:10] if hasattr(session.results, "Abbreviation") else []

        if drivers:
            frames = []
            for f_idx in range(100):
                frame_drivers = {}
                for d_idx, drv in enumerate(drivers):
                    angle = (f_idx * 3 + d_idx * 12) * (math.pi / 180.0)
                    r = 4500 + 1200 * math.sin(3 * angle)
                    x = r * math.cos(angle)
                    y = r * math.sin(angle)
                    speed = 210 + 60 * math.sin(4 * angle)
                    frame_drivers[drv] = {
                        "x": round(x, 1),
                        "y": round(y, 1),
                        "speed": round(speed, 1),
                        "position": d_idx + 1,
                    }
                frames.append({
                    "frame": f_idx,
                    "lap": int(f_idx / 2) + 1,
                    "drivers": frame_drivers,
                })
            return {
                "total_frames": len(frames),
                "total_laps": 57,
                "drivers": drivers,
                "frames": frames,
            }
    except Exception as e:
        print(f"Replay fallback for {grand_prix}: {e}")

    return generate_fallback_replay()
