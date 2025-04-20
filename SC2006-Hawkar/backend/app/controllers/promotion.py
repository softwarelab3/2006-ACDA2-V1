from fastapi import HTTPException
from sqlalchemy.orm import Session

import services.promotion as promotion_services

import schemas.promotion as promotion_schemas


class PromotionController:
    """Controller for promotion-related operations, including CRUD for promotions."""

    # ------------------------------------------------------------ #
    # -------------------- Promotion (CRUD) ----------------------- #
    # ------------------------------------------------------------ #
    # ----- Promotion ----- #
    def getPromotionsByDishId(db: Session, dishID: int):
        """Get all promotions for a given dish ID.

        Args:
            db (Session): Database session.
            dishID (int): ID of the dish.
        Raises:
            HTTPException: If no promotions are found.
        Returns:
            list: List of promotions for the dish.
        """
        promotions = promotion_services.get_promotions_by_dish_id(db, dishID=dishID)
        if promotions is None:
            raise HTTPException(status_code=404, detail="Promotion not found")
        return promotions

    def getPromotionByPromotionId(db: Session, promotionID: int):
        """Get a promotion by its promotion ID.

        Args:
            db (Session): Database session.
            promotionID (int): ID of the promotion.
        Raises:
            HTTPException: If the promotion is not found.
        Returns:
            Promotion: The promotion object.
        """
        promotion = promotion_services.get_promotion_by_promotion_id(
            db, promotionID=promotionID
        )
        if promotion is None:
            raise HTTPException(status_code=404, detail="Promotion not found")
        return promotion

    def getAllPromotions(db: Session, skip: int, limit: int):
        """Get all promotions with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of promotions.
        """
        promotions = promotion_services.get_all_promotions(db, skip=skip, limit=limit)
        return promotions

    def updatePromotion(
        db: Session, updated_promotion: promotion_schemas.PromotionUpdate
    ):
        """Update a promotion by its ID.

        Args:
            db (Session): Database session.
            updated_promotion (PromotionUpdate): Updated promotion schema.
        Raises:
            HTTPException: If the promotion is not found.
        Returns:
            Promotion: The updated promotion object.
        """
        promotion = promotion_services.update_promotion(db, updated_promotion)
        if promotion is None:
            raise HTTPException(status_code=404, detail="Promotion not found")
        return promotion
