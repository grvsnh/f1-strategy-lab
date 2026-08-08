from typing import List
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.services.fastf1_service import get_race_info, get_event_sessions
from app.services.telemetry_service import get_driver_telemetry
from app.services.track_service import get_track_map
from app.services.track_outline_service import get_track_outline
from app.services.driver_intelligence_service import get_driver_intelligence
from app.services.comparison_service import get_multi_driver_comparison
from app.services.delta_service import get_lap_delta

from app.routes.strategy import router as strategy_router
from app.routes.recommendation import router as recommendation_router
from app.routes.schedule import router as schedule_router

app = FastAPI(
    title="F1 Strategy Lab API",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "status": "online",
        "project": "F1 Strategy Lab",
    }


@app.get("/sessions/{year}/{grand_prix}")
def get_sessions(year: int, grand_prix: str):
    return get_event_sessions(year, grand_prix)


@app.get("/race/{year}/{grand_prix}")
def get_race(
    year: int,
    grand_prix: str,
    session: str = Query("R"),
):
    return get_race_info(year, grand_prix, session)


@app.get("/track-outline/{year}/{grand_prix}")
def track_outline(
    year: int,
    grand_prix: str,
    session: str = Query("R"),
):
    return get_track_outline(year, grand_prix, session)


@app.get("/driver-intelligence/{year}/{grand_prix}/{driver}")
def driver_intelligence(
    year: int,
    grand_prix: str,
    driver: str,
    session: str = Query("R"),
):
    return get_driver_intelligence(year, grand_prix, driver, session)


@app.get("/compare/{year}/{grand_prix}")
def compare_drivers(
    year: int,
    grand_prix: str,
    drivers: List[str] = Query(...),
    metrics: List[str] = Query(["speed"]),
    session: str = Query("R"),
):
    return get_multi_driver_comparison(year, grand_prix, drivers, metrics, session)


@app.get("/telemetry/{year}/{grand_prix}/{driver}")
def telemetry(
    year: int,
    grand_prix: str,
    driver: str,
    session: str = Query("R"),
):
    return get_driver_telemetry(year, grand_prix, driver, session)


@app.get("/track/{year}/{grand_prix}/{driver}")
def track(
    year: int,
    grand_prix: str,
    driver: str,
    session: str = Query("R"),
):
    return get_track_map(year, grand_prix, driver, session)


@app.get("/delta/{year}/{grand_prix}/{driver_a}/{driver_b}")
def delta(
    year: int,
    grand_prix: str,
    driver_a: str,
    driver_b: str,
    session: str = Query("R"),
):
    return get_lap_delta(year, grand_prix, driver_a, driver_b, session)


app.include_router(strategy_router)
app.include_router(recommendation_router)
app.include_router(schedule_router)
