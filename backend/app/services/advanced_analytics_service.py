from typing import Dict, Any, List
from app.services.session_cache import get_cached_session
from app.utils.downsample import downsample_list


def get_advanced_race_analytics(year: int, grand_prix: str, session_name: str = "R") -> Dict[str, Any]:
    session = get_cached_session(year, grand_prix, session_name)

    drivers = session.results["Abbreviation"].dropna().tolist()[:10] if hasattr(session.results, "Abbreviation") else []

    position_progression = {}
    pace_medians = {}
    sector_matrix = {}

    for drv in drivers:
        laps = session.laps.pick_drivers(drv)
        if laps.empty:
            continue

        # Position progression across laps
        if "Position" in laps.columns:
            positions = laps["Position"].fillna(20).astype(int).tolist()
            position_progression[drv] = downsample_list(positions, max_points=100)

        # Race pace median (excluding in/out laps)
        quick_laps = laps.pick_quicklaps()
        if not quick_laps.empty and "LapTime" in quick_laps.columns:
            sec_laps = [t.total_seconds() for t in quick_laps["LapTime"].dropna()]
            if sec_laps:
                sec_laps.sort()
                mid = len(sec_laps) // 2
                pace_medians[drv] = round(sec_laps[mid], 3)

        # Sector best splits & speed trap
        fastest_lap = laps.pick_fastest()
        if fastest_lap is not None and not fastest_lap.empty:
            def format_sec(td):
                return round(td.total_seconds(), 3) if td is not None and str(td) != "NaT" else None

            speed_trap = float(fastest_lap.get("SpeedI1", 0.0)) if "SpeedI1" in fastest_lap else 0.0

            sector_matrix[drv] = {
                "s1": format_sec(fastest_lap.get("Sector1Time")),
                "s2": format_sec(fastest_lap.get("Sector2Time")),
                "s3": format_sec(fastest_lap.get("Sector3Time")),
                "speed_trap": round(speed_trap, 1) if speed_trap > 0 else 315.0,
            }

    return {
        "year": year,
        "grand_prix": grand_prix,
        "session": session_name,
        "position_progression": position_progression,
        "pace_medians": pace_medians,
        "sector_matrix": sector_matrix,
    }
