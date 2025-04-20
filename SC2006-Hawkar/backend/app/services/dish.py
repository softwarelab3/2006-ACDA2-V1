from sqlalchemy.orm import Session
from fastapi import HTTPException

import schemas.dish as dish_schemas
import schemas.promotion as promotion_schemas
from models.dish import Dish
from models.stall import Stall
from models.promotion import Promotion
import services.promotion as promotion_services
from services.objectStorage import ObjectStorage


def get_dish_by_dish_id(db: Session, dishID: int):
    """Retrieve a dish by its dish ID.

    Args:
        db (Session): Database session.
        dishID (int): ID of the dish.
    Raises:
        HTTPException: If the dish is not found.
    Returns:
        Dish: The dish object.
    """
    db_dish = db.query(Dish).filter(Dish.dishID == dishID).first()

    if not db_dish:
        raise HTTPException(status_code=404, detail="Dish not found")

    return db_dish


def get_dishes_by_stall_id(db: Session, stallID: int):
    """Retrieve all dishes for a given stall ID.

    Args:
        db (Session): Database session.
        stallID (int): ID of the stall.
    Returns:
        list: List of dishes for the stall (empty if none found).
    """
    db_dishes = db.query(Dish).filter(Dish.stallID == stallID).all()

    if not db_dishes:
        # Return empty list instead of error if no dishes found
        return []

    # Enhance dishes with promotion details
    for dish in db_dishes:
        if dish.onPromotion:
            promotion = promotion_services.get_promotions_by_dish_id(db, dish.dishID)
            if promotion:
                # Add promotion details to the dish
                dish.startDate = promotion.startDate
                dish.endDate = promotion.endDate
                dish.discountedPrice = promotion.discountedPrice

    return db_dishes


def get_all_dishes(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve all dishes with pagination.

    Args:
        db (Session): Database session.
        skip (int): Number of records to skip.
        limit (int): Maximum number of records to return.
    Returns:
        list: List of dishes.
    """
    db_dishes = db.query(Dish).offset(skip).limit(limit).all()

    return db_dishes


def create_dish(db: Session, dish: dish_schemas.DishCreate):
    """Create a new dish and optionally a promotion.

    Args:
        db (Session): Database session.
        dish (DishCreate): Dish creation schema.
    Raises:
        HTTPException: If the stallID is invalid.
    Returns:
        Dish: The created dish object.
    """
    db_stall = db.query(Stall).filter(Stall.stallID == dish.stallID).first()
    if not db_stall:
        raise HTTPException(status_code=400, detail="Invalid stallID")

    if dish.photo:
        storage = ObjectStorage()
        image_url = storage.upload_dish_photo(
            db_stall.stallID, dish.dishName, dish.photo
        )
        dish.photo = image_url

    db_dish = Dish(
        dishName=dish.dishName,
        price=dish.price,
        stallID=dish.stallID,
        photo=dish.photo,
        onPromotion=dish.onPromotion,
    )

    db.add(db_dish)
    db.commit()
    db.refresh(db_dish)

    if dish.onPromotion:
        promotion_services.create_promotion(
            db,
            promotion_schemas.PromotionCreate(
                dishID=db_dish.dishID,
                startDate=dish.startDate,
                endDate=dish.endDate,
                discountedPrice=dish.discountedPrice,
            ),
        )

    return db_dish


def update_dish(db: Session, updated_dish: dish_schemas.DishUpdate):
    """Update an existing dish and its promotion if applicable.

    Args:
        db (Session): Database session.
        updated_dish (DishUpdate): Updated dish schema.
    Returns:
        Dish: The updated dish object, or None if not found.
    """
    db_dish = db.query(Dish).filter(Dish.dishID == updated_dish.dishID).first()
    if not db_dish:
        return None

    if updated_dish.photo:
        storage = ObjectStorage()
        image_url = storage.upload_dish_photo(
            db_dish.stallID, updated_dish.dishName, updated_dish.photo
        )
        updated_dish.photo = image_url

    if updated_dish.onPromotion:
        promotion_services.create_promotion(
            db,
            promotion_schemas.PromotionCreate(
                dishID=updated_dish.dishID,
                startDate=updated_dish.startDate,
                endDate=updated_dish.endDate,
                discountedPrice=updated_dish.discountedPrice,
            ),
        )
    else:
        db_promotion = promotion_services.get_promotions_by_dish_id(
            db, updated_dish.dishID
        )
        if db_promotion:
            db.delete(db_promotion)
            db.commit()

    # Update Dish
    updated_dish_data = updated_dish.model_dump(exclude_unset=True)
    for key, value in updated_dish_data.items():
        setattr(db_dish, key, value)

    db.add(db_dish)
    db.commit()
    db.refresh(db_dish)

    return db_dish


def delete_dish(db: Session, dishID: int) -> bool:
    """Delete a dish and its promotion if it exists.

    Args:
        db (Session): Database session.
        dishID (int): ID of the dish to delete.
    Raises:
        HTTPException: If the dishID is invalid.
    Returns:
        bool: True if deleted successfully.
    """
    db_dish = db.query(Dish).filter(Dish.dishID == dishID).first()

    if db_dish.onPromotion:
        db_promotion = promotion_services.get_promotions_by_dish_id(db, dishID)
        if db_promotion:
            db.delete(db_promotion)
            db.commit()

    if not db_dish:
        raise HTTPException(status_code=400, detail="Invalid dishID")

    db.delete(db_dish)
    db.commit()

    return True
