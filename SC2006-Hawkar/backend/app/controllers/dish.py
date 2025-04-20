from fastapi import HTTPException
from sqlalchemy.orm import Session

import services.dish as dish_services
import services.promotion as promotion_services

import schemas.dish as dish_schemas
import schemas.promotion as promotion_schemas


class DishController:
    """Controller for dish and promotion related operations."""

    # -------------------------------------------------------- #
    # -------------------- Business Logic -------------------- #
    # -------------------------------------------------------- #

    def addPromotion(db: Session, promotion: promotion_schemas.PromotionCreate):
        """Add a new promotion for a dish.

        Args:
            db (Session): Database session.
            promotion (PromotionCreate): Promotion creation schema.
        Raises:
            HTTPException: If a promotion already exists for the dish.
        Returns:
            Promotion: The created promotion object.
        """
        existedPromotion = promotion_services.get_promotions_by_dish_id(
            db, promotion.dishID
        )

        if existedPromotion:  # Changed to check if the list has any items
            raise HTTPException(status_code=400, detail="Promotion already exists")
        db_promotion = promotion_services.create_promotion(db, promotion)
        return db_promotion

    def editPromotion(
        db: Session, updated_promotion: promotion_schemas.PromotionUpdate
    ):
        """Edit an existing promotion.

        Args:
            db (Session): Database session.
            updated_promotion (PromotionUpdate): Updated promotion schema.
        Returns:
            Promotion: The updated promotion object.
        """
        db_promotion = promotion_services.update_promotion(db, updated_promotion)
        return db_promotion

    def deletePromotion(db: Session, promotionID: int):
        """Delete a promotion by its ID.

        Args:
            db (Session): Database session.
            promotionID (int): ID of the promotion to delete.
        Returns:
            bool: True if deleted, False otherwise.
        """
        return promotion_services.delete_promotion(db, promotionID)

    # ------------------------------------------------------------ #
    # -------------------- Dish (CRUD) ----------------------- #
    # ------------------------------------------------------------ #
    # ----- Dish ----- #
    def getDishesByStallId(db: Session, stallID: int):
        """Get all dishes for a given stall ID.

        Args:
            db (Session): Database session.
            stallID (int): ID of the stall.
        Raises:
            HTTPException: If no dishes are found.
        Returns:
            list: List of dishes for the stall.
        """
        dishes = dish_services.get_dishes_by_stall_id(db, stallID=stallID)
        if dishes is None:
            raise HTTPException(status_code=404, detail="Dish not found")
        return dishes

    def getDishByDishId(db: Session, dishID: int):
        """Get a dish by its dish ID.

        Args:
            db (Session): Database session.
            dishID (int): ID of the dish.
        Raises:
            HTTPException: If the dish is not found.
        Returns:
            Dish: The dish object.
        """
        dish = dish_services.get_dish_by_dish_id(db, dishID=dishID)
        if dish is None:
            raise HTTPException(status_code=404, detail="Dish not found")
        return dish

    def getAllDishes(db: Session, skip: int, limit: int):
        """Get all dishes with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of dishes.
        """
        dishs = dish_services.get_all_dishes(db, skip=skip, limit=limit)
        return dishs

    def updateDish(db: Session, updated_dish: dish_schemas.DishUpdate):
        """Update a dish by its ID.

        Args:
            db (Session): Database session.
            updated_dish (DishUpdate): Updated dish schema.
        Raises:
            HTTPException: If the dish is not found.
        Returns:
            Dish: The updated dish object.
        """
        dish = dish_services.update_dish(db, updated_dish)
        if dish is None:
            raise HTTPException(status_code=404, detail="Dish not found")
        return dish
