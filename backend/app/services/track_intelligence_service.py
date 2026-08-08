from typing import Dict, Any, List
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def get_track_events(year: int, grand_prix: str, session_name: str = "R") -> Dict[str, Any]:
    session = get_cached_session(year, grand_prix, session_name)

    pit_events = []
    battles = []

    if hasattr(session, "laps") and not session.laps.empty:
        # Pit stop events
        pit_laps = session.laps[session.laps["PitOutTime"].notnull()]
        for _, row in pit_laps.iterrows():
            drv = str(row.get("Driver", ""))
            lap_num = int(row.get("LapNumber", 0))
            compound = str(row.get("Compound", "MEDIUM"))
            pit_events.append({
                "driver": drv,
                "lap": lap_num,
                "compound": compound,
            })

        # Identify driver battles (close lap time gap < 1.0s in race)
        drivers = session.results["Abbreviation"].dropna().tolist() if hasattr(session.results, "Abbreviation") else []
        fastest_times = {}
        for drv in drivers[:10]:
            drv_laps = session.laps.pick_drivers(drv)
            if not drv_laps.empty:
                fastest = drv_laps.pick_fastest()
                if fastest is not None and fastest["LapTime"] is not None and str(fastest["LapTime"]) != "NaT":
                    fastest_times[drv] = fastest["LapTime"].total_seconds()

        # Find pairs with gap < 1.0s
        d_keys = list(fastest_times.keys())
        for i in range(len(d_keys)):
            for j in range(i + 1, len(d_keys)):
                d1, d2 = d_keys[i], d_keys[j]
                gap = abs(fastest_times[d1] - fastest_times[d2])
                if gap <= 1.0:
                    battles.append({
                        "driver_a": d1,
                        "driver_b": d2,
                        "gap_sec": round(gap, 3),
                    })

    return {
        "year": year,
        "grand_prix": grand_prix,
        "session": session_name,
        "pit_stops": pit_events,
        "battles": battles,
        "sector_labels": [
            {"name": "Sector 1", "turn_range": "Turns 1 - 4"},
            {"name": "Sector 2", "turn_range": "Turns 5 - 12"},
            {"name": "Sector 3", "turn_range": "Turns 13 - 15"},
        ]
    }
