from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from controllers.consumer import ConsumerController

import schemas.consumer as consumer_schemas
import schemas.review as review_schemas

router = APIRouter()

tags_metadata = [
    {
        "name": "Consumer Controller",
        "description": "API Endpoints for methods implemented by the Consumer Controller",
    },
    {"name": "Consumer (CRUD)", "description": "API CRUD Endpoints for Consumer Model"},
]

# -------------------------------------------------------- #
# -------------------- Business Logic -------------------- #
# -------------------------------------------------------- #


# @router.post(
#     "/consumer-controller/submit-review",
#     response_model=review_schemas.Review,
#     tags=["Consumer Controller"],
# )
# def submit_review(review: review_schemas.ReviewCreate, db: Session = Depends(get_db)):
#     return ConsumerController.submitReview(db, review)


# @router.put(
#     "/consumer-controller/edit-review",
#     response_model=review_schemas.Review,
#     tags=["Consumer Controller"],
# )
# def edit_review(review: review_schemas.ReviewUpdate, db: Session = Depends(get_db)):
#     return ConsumerController.editReview(db, review)


# ------------------------------------------------------------ #
# -------------------- Consumer (CRUD) ----------------------- #
# ------------------------------------------------------------ #
@router.get(
    "/consumers",
    response_model=list[consumer_schemas.Consumer],
    tags=["Consumer (CRUD)"],
)
def get_all_consumers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all consumers with pagination.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of consumer objects.
    """
    return ConsumerController.getAllConsumers(db, skip, limit)


@router.get(
    "/consumer/{consumer_id}",
    response_model=consumer_schemas.Consumer,
    tags=["Consumer (CRUD)"],
)
async def get_consumer_by_consumer_id(consumer_id: str, db: Session = Depends(get_db)):
    """Get a consumer by their consumer ID.

    Args:
        consumer_id (str): Consumer ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        Consumer: The consumer object.
    """
    return ConsumerController.getConsumerByConsumerId(db, consumer_id)


@router.get(
    "/consumer/userid/{user_id}",
    response_model=consumer_schemas.Consumer,
    tags=["Consumer (CRUD)"],
)
async def get_consumer_by_user_id(user_id: str, db: Session = Depends(get_db)):
    """Get a consumer by their user ID.

    Args:
        user_id (str): User ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        Consumer: The consumer object.
    """
    return ConsumerController.getConsumerByUserId(db, user_id)


@router.put(
    "/consumer/update",
    response_model=consumer_schemas.Consumer,
    tags=["Consumer (CRUD)"],
)
def update_consumer(
    consumer: consumer_schemas.ConsumerUpdate, db: Session = Depends(get_db)
):
    """Update an existing consumer's information.

    Args:
        consumer (ConsumerUpdate): Updated consumer schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        Consumer: The updated consumer object.
    """
    return ConsumerController.updateConsumer(db, consumer)
