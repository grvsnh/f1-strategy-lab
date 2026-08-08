import fastf1
from typing import List, Dict, Any

def get_schedule(year: int) -> List[Dict[str, Any]]:
    schedule = fastf1.get_event_schedule(year)
    events = []
    
    for _, row in schedule.iterrows():
        # Exclude testing sessions if desired, but keep official GPs
        event_name = row.get("EventName", "")
        if not event_name or "Testing" in event_name:
            continue
            
        events.append({
            "round": int(row.get("RoundNumber", 0)),
            "event_name": str(event_name),
            "official_name": str(row.get("OfficialEventName", event_name)),
            "location": str(row.get("Location", "")),
            "country": str(row.get("Country", "")),
            "event_date": str(row.get("EventDate", "")),
            "event_format": str(row.get("EventFormat", "conventional"))
        })
        
    return events
