from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from controllers.user import UserController

import schemas.user as user_schemas
import schemas.hawker as hawker_schemas

router = APIRouter()

tags_metadata = [
    {
        "name": "User Controller",
        "description": "API Endpoints for methods implemented by the User Controller",
    },
    {"name": "User (CRUD)", "description": "API CRUD Endpoints for User Model"},
]


# -------------------------------------------------------- #
# -------------------- Business Logic -------------------- #
# -------------------------------------------------------- #
# ---------- User ---------- #
@router.post("/user-controller/create-user", tags=["User Controller"])
async def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user in the system.

    Args:
        user (UserCreate): User creation schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        User: The created user object.
    """
    return UserController.createUser(db, user)


# # ---------- Hawker ---------- #
# @router.get("/user-controller/get-all-public-hawkers", tags=["User Controller"])
# async def get_all_public_hawkers():
#     hawkersLocation = UserController.getAllPublicHawkers()
#     if hawkersLocation is None:
#         raise HTTPException(status_code=404, detail="Public Hawkers not found")
#     return hawkersLocation


# @router.get(
#     "/user-controller/get-all-hawkers",
#     response_model=list[hawker_schemas.Hawker],
#     tags=["User Controller"],
# )
# async def get_all_hawkers(
#     skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
# ):
#     return UserController.getAllHawkers(db, skip, limit)


# ------------------------------------------------------------ #
# -------------------- User (CRUD) --------------------------- #
# ------------------------------------------------------------ #
@router.get(
    "/users",
    response_model=list[user_schemas.User],
    tags=["User (CRUD)"],
)
async def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all users with pagination.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of user objects.
    """
    return UserController.getAllUsers(db, skip, limit)


@router.get(
    "/user/{userID}",
    response_model=user_schemas.User,
    tags=["User (CRUD)"],
)
async def get_user_by_id(userID: str, db: Session = Depends(get_db)):
    """Get a user by their user ID.

    Args:
        userID (str): User ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        User: The user object.
    """
    return UserController.getUserById(db, userID)


@router.get(
    "/user/email/{email}", response_model=user_schemas.User, tags=["User (CRUD)"]
)
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    """Get a user by their email address.

    Args:
        email (str): Email address from the path.
        db (Session, optional): Database session dependency.
    Returns:
        User: The user object.
    """
    return UserController.getUserByEmail(db, email)


@router.put("/user/update", response_model=user_schemas.User, tags=["User (CRUD)"])
def update_user(user: user_schemas.UserUpdate, db: Session = Depends(get_db)):
    """Update an existing user's information.

    Args:
        user (UserUpdate): Updated user schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        User: The updated user object.
    """
    return UserController.updateUser(db, user)
