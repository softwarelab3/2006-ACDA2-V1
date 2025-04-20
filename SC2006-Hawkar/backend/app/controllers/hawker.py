from fastapi import HTTPException
from sqlalchemy.orm import Session
import json

import services.hawker as hawker_services
import services.stall as stall_services


import schemas.hawker as hawker_schemas
import schemas.stall as stall_schemas


class HawkerController:
    """Controller for hawker-related operations, including CRUD for hawkers."""

    # ------------------------------------------------------------ #
    # -------------------- Hawker (CRUD) ------------------------- #
    # ------------------------------------------------------------ #
    def addHawker(db: Session, hawker: hawker_schemas.HawkerCreate):
        """Add a new hawker.

        Args:
            db (Session): Database session.
            hawker (HawkerCreate): Hawker creation schema.
        Returns:
            Hawker: The created hawker object.
        """
        db_hawker = hawker_services.create_hawker(db, hawker)
        return db_hawker

    def getHawkerByUserId(db: Session, userID: int):
        """Get a hawker by their user ID.

        Args:
            db (Session): Database session.
            userID (int): User ID of the hawker.
        Raises:
            HTTPException: If the hawker is not found.
        Returns:
            Hawker: The hawker object.
        """
        hawker = hawker_services.get_hawker_by_user_id(db, userID=userID)
        if hawker is None:
            raise HTTPException(status_code=404, detail="Hawker not found")

        return hawker

    def getHawkerByHawkerId(db: Session, hawkerID: int):
        """Get a hawker by their hawker ID.

        Args:
            db (Session): Database session.
            hawkerID (int): Hawker ID.
        Raises:
            HTTPException: If the hawker is not found.
        Returns:
            Hawker: The hawker object.
        """
        hawker = hawker_services.get_hawker_by_hawker_id(db, hawkerID=hawkerID)
        if hawker is None:
            raise HTTPException(status_code=404, detail="Hawker not found")

        return hawker

    def getAllHawkers(db: Session, skip: int, limit: int):
        """Get all hawkers with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of hawkers.
        """
        hawkers = hawker_services.get_all_hawkers(db, skip=skip, limit=limit)

        return hawkers

    def updateHawker(db: Session, updated_hawker: hawker_schemas.HawkerUpdate):
        """Update a hawker's information.

        Args:
            db (Session): Database session.
            updated_hawker (HawkerUpdate): Updated hawker schema.
        Raises:
            HTTPException: If the hawker is not found.
        Returns:
            Hawker: The updated hawker object.
        """
        hawker = hawker_services.update_hawker(db, updated_hawker)
        if hawker is None:
            raise HTTPException(status_code=404, detail="Hawker not found")

        # # convert geometry json to dict
        # hawker.geometry = json.loads(hawker.geometry)

        return hawker

    def deleteHawker(db: Session, hawkerID: int):
        """Delete a hawker by their ID.

        Args:
            db (Session): Database session.
            hawkerID (int): ID of the hawker to delete.
        Returns:
            bool: True if deleted, False otherwise.
        """
        return hawker_services.delete_hawker(db, hawkerID)
