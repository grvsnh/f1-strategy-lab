from fastapi import APIRouter, Query
from app.services.strategy_service import get_strategy

router = APIRouter()


@router.get("/strategy/{year}/{grand_prix}/{driver}")
def strategy(
    year: int,
    grand_prix: str,
    driver: str,
    session: str = Query("R"),
):
    return get_strategy(year, grand_prix, driver, session)
