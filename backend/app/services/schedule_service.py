import fastf1
from typing import List, Dict, Any
from functools import lru_cache

def get_schedule(year: int) -> List[Dict[str, Any]]:
    schedule = fastf1.get_event_schedule(year)
    events = []
    
    for _, row in schedule.iterrows():
        event_name = row.get("EventName", "")
        if not event_name or "Testing" in event_name:
            continue
            
        events.append({
            "round": int(row.get("RoundNumber", 0)),
            "event_name": str(event_name),
            "official_name": str(row.get("OfficialEventName", event_name)),
            "location": str(row.get("Location", "")),
            "country": str(row.get("Country", "")),
            "year": year,
            "event_date": str(row.get("EventDate", "")),
            "event_format": str(row.get("EventFormat", "conventional"))
        })
        
    return events


@lru_cache(maxsize=1)
def get_all_races() -> List[Dict[str, Any]]:
    all_events = []
    # 2026 current season down to 2021
    for yr in [2026, 2025, 2024, 2023, 2022, 2021]:
        try:
            events = get_schedule(yr)
            all_events.extend(events)
        except Exception:
            continue
    return all_events
