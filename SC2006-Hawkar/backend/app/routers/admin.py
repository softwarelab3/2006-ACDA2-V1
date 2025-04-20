from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from controllers.admin import AdminController

import schemas.admin as admin_schemas
import schemas.hawker as hawker_schemas
import schemas.review as review_schemas
from schemas.response import StandardResponse

router = APIRouter()

tags_metadata = [
    {
        "name": "Admin Controller",
        "description": "API Endpoints for methods implemented by the Admin Controller",
    },
    {"name": "Admin (CRUD)", "description": "API CRUD Endpoints for Admin Model"},
]

# -------------------------------------------------------- #
# -------------------- Business Logic -------------------- #
# -------------------------------------------------------- #


@router.put(
    "/admin/verify-hawker/{hawkerID}",
    response_model=StandardResponse,
    tags=["Admin-Hawker"],
)
async def verify_hawker(hawkerID: int, db: Session = Depends(get_db)):
    """Approve a hawker by their ID.

    Args:
        hawkerID (int): The ID of the hawker to verify.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if approved.
    """
    AdminController.verifyHawker(db, hawkerID)
    return StandardResponse(success=True, message="Hawker approved successfully")


@router.get(
    "/admin/reported_reviews",
    response_model=list[review_schemas.Review],
    tags=["Admin-Review"],
)
def get_all_reported_reviews(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Get all reviews that have been reported by users.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of reported review objects.
    """
    return AdminController.getAllReportedReviews(db, skip, limit)


@router.put(
    "/admin/reports/{reviewID}/ignore",
    response_model=StandardResponse,
    tags=["Admin-Review"],
)
def ignore_reported_review(reviewID: int, db: Session = Depends(get_db)):
    """Mark a reported review as resolved/ignored.

    Args:
        reviewID (int): The ID of the review to ignore.
        db (Session, optional): Database session dependency.
    Returns:
        StandardResponse: Success message if resolved.
    """
    AdminController.ignoreReportedReview(db, reviewID)
    return StandardResponse(
        success=True,
        message="Report marked as resolved",
    )


# ------------------------------------------------------------ #
# -------------------- Admin (CRUD) -------------------------- #
# ------------------------------------------------------------ #
@router.get("/admins", response_model=list[admin_schemas.Admin], tags=["Admin (CRUD)"])
def get_all_admins(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all admin users with pagination.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of admin user objects.
    """
    return AdminController.getAllAdmins(db, skip, limit)


@router.get(
    "/admin/{admin_id}", response_model=admin_schemas.Admin, tags=["Admin (CRUD)"]
)
async def get_admin_by_admin_id(admin_id: str, db: Session = Depends(get_db)):
    """Get an admin user by their admin ID.

    Args:
        admin_id (str): Admin ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        Admin: The admin user object.
    """
    return AdminController.getAdminByAdminId(db, admin_id)


@router.get(
    "/admin/userid/{user_id}", response_model=admin_schemas.Admin, tags=["Admin (CRUD)"]
)
async def get_admin_by_user_id(user_id: str, db: Session = Depends(get_db)):
    """Get an admin user by their user ID.

    Args:
        user_id (str): User ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        Admin: The admin user object.
    """
    return AdminController.getAdminByUserId(db, user_id)


@router.put("/admin/update", response_model=admin_schemas.Admin, tags=["Admin (CRUD)"])
def update_admin(admin: admin_schemas.AdminUpdate, db: Session = Depends(get_db)):
    """Update an existing admin user's information.

    Args:
        admin (AdminUpdate): Updated admin schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        Admin: The updated admin user object.
    """
    return AdminController.updateAdmin(db, admin)
