from sqlalchemy.orm import Session
from fastapi import HTTPException

import schemas.review as review_schemas
from models.review import Review
from models.consumer import Consumer
from models.stall import Stall


def get_review_by_review_id(db: Session, reviewID: int):
    """Retrieve a review by its review ID.

    Args:
        db (Session): Database session.
        reviewID (int): ID of the review.

    Returns:
        Review: The review object, or None if not found.
    """
    review = db.query(Review).filter(Review.reviewID == reviewID).first()

    return review


def get_reviews_by_consumer_id(db: Session, consumerID: int):
    """Retrieve all reviews by a consumer ID.

    Args:
        db (Session): Database session.
        consumerID (int): Consumer ID.

    Returns:
        list: List of reviews for the consumer.
    """
    db_reviews = db.query(Review).filter(Review.consumerID == consumerID).all()

    return db_reviews


def get_reviews_by_stall_id(db: Session, stallID: int):
    """Retrieve all reviews by a stall ID.

    Args:
        db (Session): Database session.
        stallID (int): Stall ID.

    Returns:
        list: List of reviews for the stall.
    """
    db_reviews = db.query(Review).filter(Review.stallID == stallID).all()

    return db_reviews


def get_all_reviews(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve all reviews with pagination.

    Args:
        db (Session): Database session.
        skip (int): Number of records to skip.
        limit (int): Maximum number of records to return.

    Returns:
        list: List of reviews.
    """
    db_reviews = db.query(Review).offset(skip).limit(limit).all()

    return db_reviews


def get_all_reported_reviews(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve all reported reviews with pagination.

    Args:
        db (Session): Database session.
        skip (int): Number of records to skip.
        limit (int): Maximum number of records to return.

    Returns:
        list: List of reported reviews.
    """
    db_reviews = (
        db.query(Review)
        .filter(Review.isReported == True)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return db_reviews


def create_review(db: Session, review: review_schemas.ReviewCreate):
    """Create a new review for a consumer and stall.

    Args:
        db (Session): Database session.
        review (ReviewCreate): Review creation schema.

    Raises:
        HTTPException: If the consumerID or stallID is invalid.

    Returns:
        Review: The created review object.
    """
    db_consumer = (
        db.query(Consumer).filter(Consumer.consumerID == review.consumerID).first()
    )
    if not db_consumer:
        raise HTTPException(status_code=400, detail="Invalid consumerID")

    db_stall = db.query(Stall).filter(Stall.stallID == review.stallID).first()
    if not db_stall:
        raise HTTPException(status_code=400, detail="Invalid stallID")

    db_review = Review(
        reviewText=review.reviewText,
        rating=review.rating,
        consumerID=review.consumerID,
        stallID=review.stallID,
        isReported=review.isReported,
        reportText=review.reportText,
        reportType=review.reportType,
    )

    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    return db_review


def update_review(db: Session, updated_review: review_schemas.ReviewUpdate):
    """Update an existing review's information.

    Args:
        db (Session): Database session.
        updated_review (ReviewUpdate): Updated review schema.

    Returns:
        Review: The updated review object, or None if not found.
    """
    db_review = (
        db.query(Review).filter(Review.reviewID == updated_review.reviewID).first()
    )
    if not db_review:
        return None

    # Update Review
    updated_review_data = updated_review.model_dump(exclude_unset=True)
    for key, value in updated_review_data.items():
        setattr(db_review, key, value)

    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    return db_review


def report_review(db: Session, reviewID: int, reportType: str, reportText: str):
    """Report a review for inappropriate content or other reasons.

    Args:
        db (Session): Database session.
        reviewID (int): ID of the review to report.
        reportType (str): Type of report.
        reportText (str): Description of the report.

    Raises:
        HTTPException: If the reviewID or reportType is invalid.

    Returns:
        Review: The reported review object.
    """
    db_review = db.query(Review).filter(Review.reviewID == reviewID).first()

    if not db_review:
        raise HTTPException(status_code=400, detail="Invalid reviewID")

    # Handle the case when reportType is already an enum
    if isinstance(reportType, review_schemas.ReportType):
        pass  # Already an enum, no conversion needed
    else:
        # Convert string to enum
        try:
            reportType = review_schemas.ReportType[reportType]
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid reportType")

    db_review.isReported = True
    db_review.reportType = reportType
    db_review.reportText = reportText

    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    return db_review


def delete_review(db: Session, reviewID: int) -> bool:
    """Delete a review by its ID.

    Args:
        db (Session): Database session.
        reviewID (int): ID of the review to delete.

    Raises:
        HTTPException: If the reviewID is invalid.

    Returns:
        bool: True if deleted successfully.
    """
    db_review = db.query(Review).filter(Review.reviewID == reviewID).first()

    if not db_review:
        raise HTTPException(status_code=400, detail="Invalid reviewID")

    db.delete(db_review)
    db.commit()

    return True
