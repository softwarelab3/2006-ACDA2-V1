from sqlalchemy.orm import Session
from fastapi import HTTPException

import schemas.promotion as promotion_schemas
from models.promotion import Promotion
from models.dish import Dish


def get_promotion_by_promotion_id(db: Session, promotionID: int):
    """Retrieve a promotion by its promotion ID.

    Args:
        db (Session): Database session.
        promotionID (int): ID of the promotion.

    Returns:
        Promotion: The promotion object, or None if not found.
    """
    db_promotion = (
        db.query(Promotion).filter(Promotion.promotionID == promotionID).first()
    )
    return db_promotion


def get_promotions_by_dish_id(db: Session, dishID: int):
    """Retrieve a promotion by the dish ID.

    Args:
        db (Session): Database session.
        dishID (int): ID of the dish.

    Returns:
        Promotion: The promotion object, or None if not found.
    """
    db_promotion = db.query(Promotion).filter(Promotion.dishID == dishID).first()

    return db_promotion


def get_all_promotions(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve all promotions with pagination.

    Args:
        db (Session): Database session.
        skip (int): Number of records to skip.
        limit (int): Maximum number of records to return.

    Returns:
        list: List of promotions.
    """
    db_promotions = db.query(Promotion).offset(skip).limit(limit).all()

    return db_promotions


def create_promotion(db: Session, promotion: promotion_schemas.PromotionCreate):
    """Create a new promotion for a dish.

    Args:
        db (Session): Database session.
        promotion (PromotionCreate): Promotion creation schema.

    Raises:
        HTTPException: If the dishID is invalid.

    Returns:
        Promotion: The created promotion object.
    """
    db_dish = db.query(Dish).filter(Dish.dishID == promotion.dishID).first()
    if not db_dish:
        raise HTTPException(status_code=400, detail="Invalid dishID")

    db_promotion = Promotion(
        dishID=promotion.dishID,
        startDate=promotion.startDate,
        endDate=promotion.endDate,
        discountedPrice=promotion.discountedPrice,
    )

    db.add(db_promotion)
    db.commit()
    db.refresh(db_promotion)

    return db_promotion


def update_promotion(db: Session, updated_promotion: promotion_schemas.PromotionUpdate):
    """Update an existing promotion.

    Args:
        db (Session): Database session.
        updated_promotion (PromotionUpdate): Updated promotion schema.

    Returns:
        Promotion: The updated promotion object, or None if not found.
    """
    db_promotion = (
        db.query(Promotion)
        .filter(Promotion.promotionID == updated_promotion.promotionID)
        .first()
    )
    if not db_promotion:
        return None

    # Update Promotion
    updated_promotion_data = updated_promotion.model_dump(exclude_unset=True)
    for key, value in updated_promotion_data.items():
        setattr(db_promotion, key, value)

    db.add(db_promotion)
    db.commit()
    db.refresh(db_promotion)

    return db_promotion


def delete_promotion(db: Session, promotionID: int) -> bool:
    """Delete a promotion by its ID.

    Args:
        db (Session): Database session.
        promotionID (int): ID of the promotion to delete.

    Raises:
        HTTPException: If the promotionID is invalid.

    Returns:
        bool: True if deleted successfully.
    """
    db_promotion = (
        db.query(Promotion).filter(Promotion.promotionID == promotionID).first()
    )

    if not db_promotion:
        raise HTTPException(status_code=400, detail="Invalid promotionID")

    db.delete(db_promotion)
    db.commit()

    return True
