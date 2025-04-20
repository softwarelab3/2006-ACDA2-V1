from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Union

from database import get_db
from controllers.stall import StallController
from controllers.dish import DishController
from controllers.review import ReviewController
from controllers.consumer import ConsumerController

import schemas.stall as stall_schemas
import schemas.dish as dish_schemas
import schemas.review as review_schemas
import schemas.hawkerCenter as hawkerCenter_schemas
import schemas.likeStall as likeStall_schemas
from schemas.response import StandardResponse


router = APIRouter()

tags_metadata = [
    {
        "name": "Stall Controller",
        "description": "API Endpoints for methods implemented by the Stall Controller",
    },
    {"name": "Stall (CRUD)", "description": "API CRUD Endpoints for Stall Model"},
]

# -------------------------------------------------------- #
# -------------------- Business Logic -------------------- #
# -------------------------------------------------------- #


@router.get(
    "/stall/{stall_id}/dishes",
    response_model=list[dish_schemas.DishUpdate],
    tags=["Stall-Dish"],
)
async def get_dish_by_stall_id(stall_id: str, db: Session = Depends(get_db)):
    """Get all dishes for a given stall ID.

    Args:
        stall_id (str): Stall ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of dish objects for the stall.
    """
    return DishController.getDishesByStallId(db, stall_id)


@router.post(
    "/stall/{stall_id}/add-dish",
    response_model=StandardResponse,
    tags=["Stall-Dish"],
)
def add_dish(
    stall_id: str, dish: dish_schemas.DishCreate, db: Session = Depends(get_db)
):
    """Add a new dish to a stall.

    Args:
        stall_id (str): Stall ID from the path.
        dish (DishCreate): Dish creation schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if added.
    """
    StallController.addDish(db, dish)
    return StandardResponse(success=True, message="Dish added successfully")


@router.put(
    "/dish/update/{dish_id}",
    response_model=StandardResponse,
    tags=["Stall-Dish"],
)
def edit_dish(
    dish_id: int, dish: dish_schemas.DishUpdate, db: Session = Depends(get_db)
):
    """Edit an existing dish.

    Args:
        dish_id (int): Dish ID from the path.
        dish (DishUpdate): Updated dish schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if updated.
    """
    StallController.editDish(db, dish)
    return StandardResponse(success=True, message="Dish updated successfully")


@router.delete(
    "/dish/delete/{dish_id}", response_model=StandardResponse, tags=["Stall-Dish"]
)
def delete_dish(dish_id: int, db: Session = Depends(get_db)):
    """Delete a dish by its ID.

    Args:
        dish_id (int): Dish ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if deleted.
    Raises:
        HTTPException: If the dish is not found.
    """
    result = StallController.deleteDish(db, dish_id)
    if not result:
        raise HTTPException(status_code=404, detail="Dish not found")
    return StandardResponse(success=True, message="Dish deleted successfully")


@router.get(
    "/stall/{stall_id}/reviews",
    response_model=list[review_schemas.Review],
    tags=["Stall-Review"],
)
async def get_review_by_stall_id(stall_id: str, db: Session = Depends(get_db)):
    """Get all reviews for a given stall ID.

    Args:
        stall_id (str): Stall ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of review objects for the stall.
    """
    return ReviewController.getReviewsByStallId(db, stall_id)


@router.post(
    "/stall/{stall_id}/add-review",
    response_model=StandardResponse,
    tags=["Stall-Review"],
)
def submit_review(
    stall_id: int, review: review_schemas.ReviewCreate, db: Session = Depends(get_db)
):
    """Submit a new review for a stall.

    Args:
        stall_id (int): Stall ID from the path.
        review (ReviewCreate): Review creation schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if added.
    """
    ConsumerController.submitReview(db, review)
    return StandardResponse(success=True, message="Review added successfully")


@router.post(
    "/stall/{user_id}/like/{stall_id}",
    response_model=StandardResponse,
    tags=["Stall-Like"],
)
def like_stall(stall_id: int, user_id: int, db: Session = Depends(get_db)):
    """Like a stall for a user.

    Args:
        stall_id (int): Stall ID from the path.
        user_id (int): User ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if liked.
    """
    StallController.likeStall(db, user_id, stall_id)
    return StandardResponse(success=True, message="Stall liked successfully")


@router.delete(
    "/stall/{user_id}/unlike/{stall_id}",
    response_model=StandardResponse,
    tags=["Stall-Like"],
)
def unlike_stall(stall_id: int, user_id: int, db: Session = Depends(get_db)):
    """Remove a like from a stall for a user.

    Args:
        stall_id (int): Stall ID from the path.
        user_id (int): User ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if unliked.
    """
    StallController.unlikeStall(db, user_id, stall_id)
    return StandardResponse(success=True, message="Stall unliked successfully")


@router.get(
    "/stall/{user_id}/liked",
    response_model=list[likeStall_schemas.LikedStallByUserID],
    tags=["Stall-Like"],
)
def get_liked_stalls(user_id: int, db: Session = Depends(get_db)):
    """Get all stalls liked by a user.

    Args:
        user_id (int): User ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of liked stalls.
    Raises:
        HTTPException: If no liked stalls are found.
    """
    liked_stalls = StallController.getLikedStalls(db, user_id)
    if not liked_stalls:
        raise HTTPException(status_code=404, detail="No liked stalls found")
    return liked_stalls


# ------------------------------------------------------------ #
# -------------------- Stall (CRUD) ------------------------- #
# ------------------------------------------------------------ #


@router.get("/stalls", response_model=list[stall_schemas.Stall], tags=["Stall (CRUD)"])
def get_all_stalls(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all stalls with pagination.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of stall objects.
    """
    return StallController.getAllStalls(db, skip, limit)


@router.get(
    "/hawker-centers",
    response_model=list[hawkerCenter_schemas.HawkerCenter],
    tags=["Hawker Center"],
)
async def get_all_hawker_centers(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Get all hawker centers with pagination.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of hawker center objects.
    Raises:
        HTTPException: If no hawker centers are found.
    """
    hawker_centers = StallController.getAllHawkerCenters(db, skip, limit)
    if not hawker_centers:
        raise HTTPException(status_code=404, detail="No hawker centers found")
    return hawker_centers


@router.get(
    "/stall/{stall_id}", response_model=stall_schemas.Stall, tags=["Stall (CRUD)"]
)
async def get_stall_by_stall_id(stall_id: str, db: Session = Depends(get_db)):
    """Get a stall by its ID.

    Args:
        stall_id (str): Stall ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        Stall: Stall object.
    """
    return StallController.getStallByStallId(db, stall_id)


@router.get(
    "/stall/hawkerid/{hawker_id}",
    response_model=list[stall_schemas.Stall],
    tags=["Stall (CRUD)"],
)
async def get_stall_by_hawker_id(hawker_id: str, db: Session = Depends(get_db)):
    """Get all stalls for a given hawker center ID.

    Args:
        hawker_id (str): Hawker center ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of stall objects for the hawker center.
    """
    return StallController.getStallByHawkerId(db, hawker_id)


@router.get(
    "/stall/{stall_id}/hawker-center",
    response_model=hawkerCenter_schemas.HawkerCenter,
    tags=["Stall (CRUD)"],
)
async def get_hawker_center_by_stall_id(stall_id: str, db: Session = Depends(get_db)):
    """Get the hawker center for a given stall ID.

    Args:
        stall_id (str): Stall ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        HawkerCenter: Hawker center object.
    Raises:
        HTTPException: If the stall is not found.
    """
    stall = StallController.getStallByStallId(db, stall_id)
    if not stall:
        raise HTTPException(status_code=404, detail="Stall not found")
    hawker_center = stall.hawkerCenter

    return hawker_center


@router.post(
    "/stall/add",
    response_model=StandardResponse,
    tags=["Stall (CRUD)"],
)
def add_stall(stall: stall_schemas.StallCreate, db: Session = Depends(get_db)):
    """Add a new stall.

    Args:
        stall (StallCreate): Stall creation schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if created.
    """
    StallController.addStall(db, stall)
    return StandardResponse(success=True, message="Stall created successfully")


@router.put(
    "/stall/update/{stall_id}",
    response_model=StandardResponse,
    tags=["Stall (CRUD)"],
)
def update_stall(
    stall_id: int, stall: stall_schemas.StallUpdate, db: Session = Depends(get_db)
):
    """Update an existing stall.

    Args:
        stall_id (int): Stall ID from the path.
        stall (StallUpdate): Updated stall schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if updated.
    """
    StallController.updateStall(db, stall, stall_id)
    return StandardResponse(success=True, message="Stall updated successfully")


@router.delete(
    "/stall/delete/{stall_id}", response_model=StandardResponse, tags=["Stall (CRUD)"]
)
def delete_stall(stall_id: int, db: Session = Depends(get_db)):
    """Delete a stall by its ID.

    Args:
        stall_id (int): Stall ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if deleted.
    Raises:
        HTTPException: If the stall is not found.
    """
    result = StallController.deleteStall(db, stall_id)
    if not result:
        raise HTTPException(status_code=404, detail="Stall not found")
    return StandardResponse(success=True, message="Stall deleted successfully")
