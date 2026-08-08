from fastapi import APIRouter, Query
from app.services.recommendation_service import get_strategy_recommendation

router = APIRouter()


@router.get("/recommendation/{year}/{grand_prix}/{driver}")
def recommendation(
    year: int,
    grand_prix: str,
    driver: str,
    session: str = Query("R"),
):
    return get_strategy_recommendation(year, grand_prix, driver, session)
