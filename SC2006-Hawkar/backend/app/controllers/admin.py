import json
from fastapi import HTTPException
from sqlalchemy.orm import Session

import services.admin as admin_services
import services.hawker as hawker_services
import services.review as review_services

import schemas.admin as admin_schemas
import schemas.hawker as hawker_schemas
from controllers.review import convert_db_review_to_list


class AdminController:
    """Controller for admin-related operations, including hawker verification and review management."""

    # -------------------------------------------------------- #
    # -------------------- Business Logic -------------------- #
    # -------------------------------------------------------- #
    def verifyHawker(db: Session, hawkerID: int):
        """Verify a hawker by setting their verifyStatus to True.

        Args:
            db (Session): Database session.
            hawkerID (int): ID of the hawker to verify.
        Raises:
            HTTPException: If the hawkerID is invalid.
        Returns:
            Hawker: The updated hawker object.
        """
        hawker_db = hawker_services.get_hawker_by_hawker_id(db, hawkerID)
        if not hawker_db:
            raise HTTPException(status_code=400, detail="Invalid hawkerID")

        hawker_update = hawker_schemas.HawkerUpdate(
            name=hawker_db.user.name,
            emailAddress=hawker_db.user.emailAddress,
            userID=hawker_db.userID,
            profilePhoto=hawker_db.user.profilePhoto,
            hawkerID=hawker_db.hawkerID,
            license=hawker_db.license,
            address=hawker_db.address,
            verifyStatus=True,
        )

        hawker_update_db = hawker_services.update_hawker(db, hawker_update)

        return hawker_update_db

    def getAllReportedReviews(db: Session, skip: int, limit: int):
        """Get all reported reviews with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Raises:
            HTTPException: If no reported reviews are found.
        Returns:
            list: List of reported reviews.
        """
        reported_reviews = review_services.get_all_reported_reviews(
            db, skip=skip, limit=limit
        )
        if reported_reviews is None:
            raise HTTPException(status_code=404, detail="No reported reviews found")
        for review in reported_reviews:
            review = convert_db_review_to_list(review)

        return reported_reviews

    def ignoreReportedReview(db: Session, reviewID: int):
        """Ignore a reported review by setting isReported to False.

        Args:
            db (Session): Database session.
            reviewID (int): ID of the review to ignore.
        Raises:
            HTTPException: If the review is not found.
        Returns:
            Review: The updated review object.
        """
        review = review_services.get_review_by_review_id(db, reviewID=reviewID)
        if review is None:
            raise HTTPException(status_code=404, detail="Review not found")

        review.isReported = False

        db.commit()

        return review

    # ------------------------------------------------------------ #
    # -------------------- Admin (CRUD) -------------------------- #
    # ------------------------------------------------------------ #
    # ----- Admin ----- #
    def getAdminByUserId(db: Session, userID: int):
        """Get an admin by their user ID.

        Args:
            db (Session): Database session.
            userID (int): User ID of the admin.
        Raises:
            HTTPException: If the admin is not found.
        Returns:
            Admin: The admin object.
        """
        admin = admin_services.get_admin_by_user_id(db, userID=userID)
        if admin is None:
            raise HTTPException(status_code=404, detail="Admin not found")
        return admin

    def getAdminByAdminId(db: Session, adminID: int):
        """Get an admin by their admin ID.

        Args:
            db (Session): Database session.
            adminID (int): Admin ID.
        Raises:
            HTTPException: If the admin is not found.
        Returns:
            Admin: The admin object.
        """
        admin = admin_services.get_admin_by_admin_id(db, adminID=adminID)
        if admin is None:
            raise HTTPException(status_code=404, detail="Admin not found")
        return admin

    def getAllAdmins(db: Session, skip: int, limit: int):
        """Get all admins with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of admins.
        """
        admins = admin_services.get_all_admins(db, skip=skip, limit=limit)
        return admins

    def updateAdmin(db: Session, updated_admin: admin_schemas.AdminUpdate):
        """Update an admin's information.

        Args:
            db (Session): Database session.
            updated_admin (AdminUpdate): Updated admin schema.
        Raises:
            HTTPException: If the admin is not found.
        Returns:
            Admin: The updated admin object.
        """
        admin = admin_services.update_admin(db, updated_admin)
        if admin is None:
            raise HTTPException(status_code=404, detail="Admin not found")
        return admin
