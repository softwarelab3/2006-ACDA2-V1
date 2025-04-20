from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Union

from database import get_db
from controllers.auth import AuthController

import schemas.user as user_schemas
import schemas.admin as admin_schemas
import schemas.consumer as consumer_schemas
import schemas.hawker as hawker_schemas

router = APIRouter(prefix="/auth")

tags_metadata = [
    {
        "name": "Auth Controller",
        "description": "API Endpoints for methods implemented by the Auth Controller",
    },
    {"name": "Auth (CRUD)", "description": "API CRUD Endpoints for Auth Model"},
]


# -------------------------------------------------------- #
# -------------------- Business Logic -------------------- #
# -------------------------------------------------------- #


@router.post(
    "/signup",
    response_model=Union[
        admin_schemas.Admin,
        consumer_schemas.Consumer,
        hawker_schemas.Hawker,
    ],
    tags=["Auth Controller"],
)
async def signup(user_signup: user_schemas.UserSignup, db: Session = Depends(get_db)):
    """Register a new user (admin, consumer, or hawker).

    Args:
        user_signup (UserSignup): Signup data including user type and details.
        db (Session, optional): Database session dependency.
    Returns:
        User: The created user object (Admin, Consumer, or Hawker).
    """
    userType = user_signup.userType
    data = user_signup.data

    if userType == "admin":
        user = admin_schemas.AdminCreate(**data)
    elif userType == "consumer":
        user = consumer_schemas.ConsumerCreate(**data)
    elif userType == "hawker":
        user = hawker_schemas.HawkerCreate(**data)
    else:
        print("Invalid user type")
        return None

    return AuthController.signup(db, user)


@router.post(
    "/login",
    response_model=Union[
        user_schemas.User,
        admin_schemas.Admin,
        consumer_schemas.Consumer,
        hawker_schemas.Hawker,
    ],
    tags=["Auth Controller"],
)
def login(user: user_schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user and return user details if successful.

    Args:
        user (UserLogin): Login credentials from request body.
        db (Session, optional): Database session dependency.
    Returns:
        User: The authenticated user object (User, Admin, Consumer, or Hawker).
    """
    return AuthController.login(db, user)


@router.get("/login-google/{email}", response_model=bool, tags=["Auth Controller"])
def login_with_google(email: str, db: Session = Depends(get_db)):
    """Check if a user with the given email can log in with Google.

    Args:
        email (str): Email address to check.
        db (Session, optional): Database session dependency.
    Returns:
        bool: True if login is possible, False otherwise.
    """
    return AuthController.loginWithGoogle(db, email)


@router.post(
    "/login-google",
    response_model=Union[
        user_schemas.User,
        admin_schemas.Admin,
        consumer_schemas.Consumer,
        hawker_schemas.Hawker,
    ],
    tags=["Auth Controller"],
)
def login_or_signup_with_google(
    google_user: user_schemas.GoogleUser, db: Session = Depends(get_db)
):
    """Authenticate or register a user using Google account information.

    Args:
        google_user (GoogleUser): Google user data from request body.
        db (Session, optional): Database session dependency.
    Returns:
        User: The authenticated or newly created user object.
    """
    return AuthController.loginOrSignupWithGoogle(
        db, google_user.email, google_user.name, google_user.picture
    )
