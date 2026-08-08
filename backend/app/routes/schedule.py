from fastapi import APIRouter
from app.services.schedule_service import get_schedule

router = APIRouter()

@router.get("/schedule/{year}")
def schedule(year: int):
    return get_schedule(year)
