import fastf1
from functools import lru_cache

@lru_cache(maxsize=16)
def get_cached_session(year: int, grand_prix: str, session_name: str = "R"):
    """
    Loads and caches FastF1 Session object in memory to avoid duplicate loading
    across multiple service calls.
    """
    session = fastf1.get_session(year, grand_prix, session_name)
    session.load()
    return session
