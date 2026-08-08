from fastapi import APIRouter
from app.services.schedule_service import get_schedule, get_all_races

router = APIRouter()

@router.get("/schedule/{year}")
def schedule(year: int):
    return get_schedule(year)

@router.get("/races/all")
def all_races():
    return get_all_races()
