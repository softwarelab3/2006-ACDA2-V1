from fastapi import HTTPException
from sqlalchemy.orm import Session

import services.stall as stall_services
import services.dish as dish_services
import services.likeStall as likeStall_services

import schemas.stall as stall_schemas
import schemas.dish as dish_schemas


class StallController:
    """Controller for stall-related operations, including CRUD for stalls and dish management."""

    # -------------------------------------------------------- #
    # -------------------- Business Logic -------------------- #
    # -------------------------------------------------------- #

    def addDish(db: Session, dish: dish_schemas.DishCreate):
        """Add a new dish to a stall.

        Args:
            db (Session): Database session.
            dish (DishCreate): Dish creation schema.
        Returns:
            Dish: The created dish object.
        """
        db_dish = dish_services.create_dish(db, dish)
        return db_dish

    def editDish(db: Session, updated_dish: dish_schemas.DishUpdate):
        """Edit an existing dish.

        Args:
            db (Session): Database session.
            updated_dish (DishUpdate): Updated dish schema.
        Returns:
            Dish: The updated dish object.
        """
        db_dish = dish_services.update_dish(db, updated_dish)
        return db_dish

    def deleteDish(db: Session, dishID: int):
        """Delete a dish by its ID.

        Args:
            db (Session): Database session.
            dishID (int): ID of the dish to delete.
        Returns:
            bool: True if deleted, False otherwise.
        """
        return dish_services.delete_dish(db, dishID)

    # ------------------------------------------------------------ #
    # -------------------- Stall (CRUD) ----------------------- #
    # ------------------------------------------------------------ #
    # ----- Stall ----- #
    def getStallByHawkerId(db: Session, hawkerID: int):
        """Get a stall by the hawker's user ID.

        Args:
            db (Session): Database session.
            hawkerID (int): User ID of the hawker.
        Raises:
            HTTPException: If the stall is not found.
        Returns:
            Stall: The stall object.
        """
        stall = stall_services.get_stalls_by_hawker_id(db, hawkerID=hawkerID)
        if stall is None:
            raise HTTPException(status_code=404, detail="Stall not found")
        return stall

    def getStallByStallId(db: Session, stallID: int):
        """Get a stall by its stall ID.

        Args:
            db (Session): Database session.
            stallID (int): ID of the stall.
        Raises:
            HTTPException: If the stall is not found.
        Returns:
            Stall: The stall object.
        """
        stall = stall_services.get_stall_by_stall_id(db, stallID=stallID)
        if stall is None:
            raise HTTPException(status_code=404, detail="Stall not found")
        return stall

    def getAllStalls(db: Session, skip: int, limit: int):
        """Get all stalls with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of stalls.
        """
        stalls = stall_services.get_all_stalls(db, skip=skip, limit=limit)
        return stalls

    def getAllHawkerCenters(db: Session, skip: int, limit: int):
        """Get all hawker centers with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of hawker centers.
        """
        hawker_centers = stall_services.get_all_hawker_centers(
            db, skip=skip, limit=limit
        )
        return hawker_centers

    def addStall(db: Session, stall: stall_schemas.StallCreate):
        """Add a new stall.

        Args:
            db (Session): Database session.
            stall (StallCreate): Stall creation schema.
        Returns:
            Stall: The created stall object.
        """
        db_stall = stall_services.create_stall(db, stall)
        return db_stall

    def updateStall(
        db: Session, updated_stall: stall_schemas.StallUpdate, stall_id: int
    ):
        """Update a stall's information.

        Args:
            db (Session): Database session.
            updated_stall (StallUpdate): Updated stall schema.
            stall_id (int): ID of the stall to update.
        Raises:
            HTTPException: If the stall is not found.
        Returns:
            Stall: The updated stall object.
        """
        stall = stall_services.update_stall(db, updated_stall, stall_id)
        if stall is None:
            raise HTTPException(status_code=404, detail="Stall not found")
        return stall

    def deleteStall(db: Session, stallID: int):
        """Delete a stall by its ID.

        Args:
            db (Session): Database session.
            stallID (int): ID of the stall to delete.
        Returns:
            bool: True if deleted, False otherwise.
        """
        return stall_services.delete_stall(db, stallID)

    def likeStall(db: Session, userID: int, stallID: int):
        """Like a stall for a user.

        Args:
            db (Session): Database session.
            userID (int): User ID.
            stallID (int): Stall ID.
        Returns:
            LikeStall: The like record object.
        """
        return likeStall_services.like_stall(db, userID, stallID)

    def unlikeStall(db: Session, userID: int, stallID: int):
        """Remove a like from a stall for a user.

        Args:
            db (Session): Database session.
            userID (int): User ID.
            stallID (int): Stall ID.
        Returns:
            bool: True if unliked, False otherwise.
        """
        return likeStall_services.unlike_stall(db, userID, stallID)

    def getLikedStalls(db: Session, userID: int):
        """Get all stalls liked by a user.

        Args:
            db (Session): Database session.
            userID (int): User ID.
        Returns:
            list: List of liked stalls.
        """
        return likeStall_services.get_liked_stalls(db, userID)
