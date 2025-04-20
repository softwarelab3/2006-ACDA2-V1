from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from controllers.promotion import PromotionController
import schemas.promotion as promotion_schemas

router = APIRouter()

tags_metadata = [
    {
        "name": "Promotion Controller",
        "description": "API Endpoints for methods implemented by the Promotion Controller",
    },
    {
        "name": "Promotion (CRUD)",
        "description": "API CRUD Endpoints for Promotion Model",
    },
]


# ------------------------------------------------------------ #
# -------------------- Promotion (CRUD) ------------------------- #
# ------------------------------------------------------------ #


@router.get(
    "/promotions",
    response_model=list[promotion_schemas.Promotion],
    tags=["Promotion (CRUD)"],
)
def get_all_promotions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all promotions with pagination.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.

    Returns:
        list: List of promotion objects.
    """
    return PromotionController.getAllPromotions(db, skip, limit)


@router.get(
    "/promotion/{promotion_id}",
    response_model=promotion_schemas.Promotion,
    tags=["Promotion (CRUD)"],
)
async def get_promotion_by_promotion_id(
    promotion_id: str, db: Session = Depends(get_db)
):
    """Get a promotion by its promotion ID.

    Args:
        promotion_id (str): Promotion ID from the path.
        db (Session, optional): Database session dependency.

    Returns:
        Promotion: The promotion object.
    """
    return PromotionController.getPromotionByPromotionId(db, promotion_id)


@router.get(
    "/promotion/dishid/{dish_id}",
    response_model=promotion_schemas.Promotion,
    tags=["Promotion (CRUD)"],
)
async def get_promotions_by_dish_id(dish_id: int, db: Session = Depends(get_db)):
    """Get a promotion by the dish ID.

    Args:
        dish_id (int): Dish ID from the path.
        db (Session, optional): Database session dependency.

    Returns:
        Promotion: The promotion object.
    """
    return PromotionController.getPromotionsByDishId(db, dish_id)


@router.put(
    "/promotion/update",
    response_model=promotion_schemas.Promotion,
    tags=["Promotion (CRUD)"],
)
def update_promotion(
    promotion: promotion_schemas.PromotionUpdate, db: Session = Depends(get_db)
):
    """Update an existing promotion's information.

    Args:
        promotion (PromotionUpdate): Updated promotion schema from request body.
        db (Session, optional): Database session dependency.

    Returns:
        Promotion: The updated promotion object.
    """
    return PromotionController.updatePromotion(db, promotion)
