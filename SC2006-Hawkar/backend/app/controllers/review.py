from fastapi import HTTPException
from sqlalchemy.orm import Session

import services.review as review_services
import schemas.review as review_schemas

from services.consumer import convert_favorite_stalls_to_list
from services.stall import convert_str_to_list


def convert_db_review_to_list(review):
    """Convert DB review object fields to appropriate list types for API response.

    Args:
        review: The review object from the database.
    Returns:
        The review object with converted fields.
    """
    # if review.consumer and hasattr(review.consumer, "favoriteStalls"):
    #     review.consumer.favoriteStalls = convert_favorite_stalls_to_list(
    #         review.consumer.favoriteStalls
    #     )

    if review.stall:
        if hasattr(review.stall, "images"):
            review.stall.images = convert_str_to_list(review.stall.images)
        if hasattr(review.stall, "cuisineType"):
            review.stall.cuisineType = convert_str_to_list(review.stall.cuisineType)

    return review


class ReviewController:
    """Controller for review-related operations, including CRUD for reviews."""

    # ------------------------------------------------------------ #
    # -------------------- Review (CRUD) -------------------------- #
    # ------------------------------------------------------------ #
    # ----- Review ----- #
    def getReviewByReviewId(db: Session, reviewID: int):
        """Get a review by its review ID.

        Args:
            db (Session): Database session.
            reviewID (int): ID of the review.
        Raises:
            HTTPException: If the review is not found.
        Returns:
            Review: The review object.
        """
        review = review_services.get_review_by_review_id(db, reviewID=reviewID)
        review = convert_db_review_to_list(review)
        if review is None:
            raise HTTPException(status_code=404, detail="Review not found")
        return review

    def getReviewsByConsumerId(db: Session, consumerID: int):
        """Get all reviews by a consumer ID.

        Args:
            db (Session): Database session.
            consumerID (int): Consumer ID.
        Raises:
            HTTPException: If no reviews are found for the consumer.
        Returns:
            list: List of reviews.
        """
        reviews = review_services.get_reviews_by_consumer_id(db, consumerID=consumerID)
        if not reviews:
            return []
        for review in reviews:
            review = convert_db_review_to_list(review)
        return reviews

    def getReviewsByStallId(db: Session, stallID: int):
        """Get all reviews by a stall ID.

        Args:
            db (Session): Database session.
            stallID (int): Stall ID.
        Raises:
            HTTPException: If no reviews are found for the stall.
        Returns:
            list: List of reviews.
        """
        reviews = review_services.get_reviews_by_stall_id(db, stallID=stallID)
        if reviews == []:
            return reviews
        for review in reviews:
            review = convert_db_review_to_list(review)
        return reviews

    def getAllReviews(db: Session, skip: int, limit: int):
        """Get all reviews with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of reviews.
        """
        reviews = review_services.get_all_reviews(db, skip=skip, limit=limit)
        for review in reviews:
            review = convert_db_review_to_list(review)
        return reviews

    def createReview(db: Session, review: review_schemas.ReviewCreate):
        """Create a new review.

        Args:
            db (Session): Database session.
            review (ReviewCreate): Review creation schema.
        Raises:
            HTTPException: If the review cannot be created.
        Returns:
            Review: The created review object.
        """
        review = review_services.create_review(db, review)
        if review is None:
            raise HTTPException(status_code=400, detail="Review cannot be created")
        return review

    def updateReview(db: Session, updated_review: review_schemas.ReviewUpdate):
        """Update a review by its ID.

        Args:
            db (Session): Database session.
            updated_review (ReviewUpdate): Updated review schema.
        Raises:
            HTTPException: If the review is not found.
        Returns:
            Review: The updated review object.
        """
        review = review_services.update_review(db, updated_review)
        if review is None:
            raise HTTPException(status_code=404, detail="Review not found")
        return review

    def deleteReview(db: Session, reviewID: int):
        """Delete a review by its ID.

        Args:
            db (Session): Database session.
            reviewID (int): ID of the review to delete.
        Returns:
            bool: True if deleted, False otherwise.
        """
        return review_services.delete_review(db, reviewID)

    def reportReview(db: Session, reviewID: int, reportType: str, reportText: str):
        """Report a review for inappropriate content or other reasons.

        Args:
            db (Session): Database session.
            reviewID (int): ID of the review to report.
            reportType (str): Type of report.
            reportText (str): Description of the report.
        Returns:
            Review: The reported review object.
        """
        review = review_services.report_review(db, reviewID, reportType, reportText)
        return review
