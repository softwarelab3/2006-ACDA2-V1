from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from controllers.review import ReviewController
import schemas.review as review_schemas
from schemas.response import StandardResponse

router = APIRouter()

tags_metadata = [
    {
        "name": "Review Controller",
        "description": "API Endpoints for methods implemented by the Review Controller",
    },
    {"name": "Review (CRUD)", "description": "API CRUD Endpoints for Review Model"},
]

# ------------------------------------------------------------ #
# -------------------- Review (CRUD) ------------------------- #
# ------------------------------------------------------------ #


@router.get(
    "/reviews", response_model=list[review_schemas.Review], tags=["Review (CRUD)"]
)
def get_all_reviewes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all reviews with pagination.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of review objects.
    """
    return ReviewController.getAllReviews(db, skip, limit)


@router.get(
    "/review/{review_id}", response_model=review_schemas.Review, tags=["Review (CRUD)"]
)
async def get_review_by_review_id(review_id: str, db: Session = Depends(get_db)):
    """Get a review by its review ID.

    Args:
        review_id (str): Review ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        Review: The review object.
    """
    return ReviewController.getReviewByReviewId(db, review_id)


@router.get(
    "/review/userid/{user_id}",
    response_model=list[review_schemas.Review],
    tags=["Review (CRUD)"],
)
async def get_review_by_user_id(user_id: str, db: Session = Depends(get_db)):
    """Get all reviews submitted by a specific user.

    Args:
        user_id (str): User ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of review objects submitted by the user.
    """
    return ReviewController.getReviewsByConsumerId(db, user_id)


@router.put(
    "/review/update/{review_id}",
    response_model=StandardResponse,
    tags=["Review (CRUD)"],
)
def update_review(
    review_id: int, review: review_schemas.ReviewUpdate, db: Session = Depends(get_db)
):
    """Update an existing review.

    Args:
        review_id (int): Review ID from the path.
        review (ReviewUpdate): Updated review schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if updated.
    """
    ReviewController.updateReview(db, review)
    return StandardResponse(success=True, message="Review updated successfully")


@router.delete(
    "/review/delete/{review_id}",
    response_model=StandardResponse,
    tags=["Review (CRUD)"],
)
def delete_review(review_id: int, db: Session = Depends(get_db)) -> bool:
    """Delete a review by its ID.

    Args:
        review_id (int): Review ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if deleted.
    """
    ReviewController.deleteReview(db, review_id)
    return StandardResponse(success=True, message="Review deleted successfully")


@router.post(
    "/review/{review_id}/report",
    response_model=StandardResponse,
    tags=["Review (CRUD)"],
)
def report_review(
    review_id: int, report: review_schemas.ReviewReport, db: Session = Depends(get_db)
):
    """Report a review for inappropriate content or other issues.

    Args:
        review_id (int): Review ID from the path.
        report (ReviewReport): Report details from request body.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if reported.
    """
    ReviewController.reportReview(db, review_id, report.reportType, report.reportText)
    return StandardResponse(success=True, message="Review reported successfully")
