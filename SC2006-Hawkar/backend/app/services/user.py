from sqlalchemy.orm import Session

import schemas.user as user_schemas
from models.user import User
from services.objectStorage import ObjectStorage
from models.admin import Admin
from models.consumer import Consumer
from models.hawker import Hawker
from sqlalchemy.orm import joinedload

import bcrypt

salt = bcrypt.gensalt()


def get_user_by_id(db: Session, userID: int):
    """Retrieve a user by their user ID.

    Args:
        db (Session): Database session.
        userID (int): User ID of the user.
    Returns:
        User: The user object, or None if not found.
    """
    return db.query(User).filter(User.userID == userID).first()


def get_user_by_email(db: Session, email: str):
    """Retrieve a user by their email address.

    Args:
        db (Session): Database session.
        email (str): Email address of the user.
    Returns:
        User: The user object, or None if not found.
    """
    return db.query(User).filter(User.emailAddress == email).first()


def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve all users with pagination.

    Args:
        db (Session): Database session.
        skip (int): Number of records to skip.
        limit (int): Maximum number of records to return.
    Returns:
        list: List of users.
    """
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: user_schemas.UserCreate):
    """Create a new user with hashed password and optional profile photo.

    Args:
        db (Session): Database session.
        user (UserCreate): User creation schema.
    Returns:
        User: The created user object.
    """
    # hash password
    user.password = bcrypt.hashpw(user.password.encode("utf-8"), salt=salt)
    profile_photo_url = None
    if user.profilePhoto:
        storage = ObjectStorage()
        profile_photo_url = storage.upload_profile_photo(
            user.emailAddress, user.profilePhoto
        )
        user.profilePhoto = profile_photo_url

    db_user = User(**user.model_dump())

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, updated_user: user_schemas.UserUpdate):
    """Update an existing user's information.

    Args:
        db (Session): Database session.
        updated_user (UserUpdate): Updated user schema.
    Returns:
        User: The updated user object, or None if not found.
    """
    db_user = db.query(User).filter(User.userID == updated_user.userID).first()
    if not db_user:
        return None

    profile_photo_url = None
    if updated_user.profilePhoto:
        storage = ObjectStorage()
        profile_photo_url = storage.upload_profile_photo(
            updated_user.emailAddress, updated_user.profilePhoto
        )
        updated_user.profilePhoto = profile_photo_url

    updated_user_data = updated_user.model_dump(exclude_unset=True)
    for key, value in updated_user_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def login_user(db: Session, user: user_schemas.UserLogin):
    """Authenticate a user by email and password.

    Args:
        db (Session): Database session.
        user (UserLogin): User login schema.
    Returns:
        User: The authenticated user object, or None if authentication fails.
    """
    db_user = db.query(User).filter(User.emailAddress == user.emailAddress).first()
    if not db_user:
        return None

    if bcrypt.checkpw(user.password.encode("utf-8"), db_user.password):
        return db_user

    return None


def login_or_create_google_user(
    db: Session, email: str, name: str, profile_photo: str = ""
):
    """Login with Google or create a new user and consumer if not found.

    Args:
        db (Session): Database session.
        email (str): Email address from Google.
        name (str): Name from Google.
        profile_photo (str, optional): Profile photo URL from Google. Defaults to "".
    Returns:
        User|Admin|Consumer|Hawker: The user or role-specific object.
    """
    print(f"Attempting Google login for email: {email}")

    # Check if user already exists
    db_user = db.query(User).filter(User.emailAddress == email).first()
    storage = ObjectStorage()

    # If user exists, we need to return the appropriate object based on role
    if db_user:
        print(f"Existing user found with ID: {db_user.userID}, role: {db_user.role}")

        # For existing users, we need to return the appropriate object based on role
        # instead of just the basic User object

        match db_user.role:
            case user_schemas.Role.ADMIN:
                admin = (
                    db.query(Admin)
                    .options(joinedload(Admin.user))
                    .filter(Admin.userID == db_user.userID)
                    .first()
                )
                if admin:
                    print(f"Returned admin object for user {db_user.userID}")
                    return admin

            case user_schemas.Role.CONSUMER:
                consumer = (
                    db.query(Consumer)
                    .options(joinedload(Consumer.user))
                    .filter(Consumer.userID == db_user.userID)
                    .first()
                )
                if consumer:
                    print(f"Returned consumer object for user {db_user.userID}")
                    return consumer

            case user_schemas.Role.HAWKER:
                hawker = (
                    db.query(Hawker)
                    .options(joinedload(Hawker.user))
                    .filter(Hawker.userID == db_user.userID)
                    .first()
                )
                if hawker:
                    print(f"Returned hawker object for user {db_user.userID}")
                    return hawker

    # If user does not exist, create a new user as Consumer
    print(f"Creating new user for: {name}, {email}")
    # Create user without password for Google users

    profile_photo_url = storage.upload_profile_photo(email, profile_photo)

    db_user = User(
        name=name,
        emailAddress=email,
        role=user_schemas.Role.CONSUMER,
        profilePhoto=profile_photo_url,
        isGoogleUser=True,
    )

    # Add and commit the user first to get the user ID
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    print(f"Created new user with ID: {db_user.userID}")

    # Create consumer with default values
    db_consumer = Consumer(
        userID=db_user.userID,
        consumerID=db_user.userID,
        address="",
        dietaryPreference=user_schemas.DietaryType.Normal,
        preferredCuisine=user_schemas.CuisineType.Chinese,
        ambulatoryStatus=user_schemas.StatusType.Normal,
    )

    db.add(db_consumer)
    db.commit()
    db.refresh(db_consumer)
    print(f"Created new consumer record with ID: {db_consumer.consumerID}")

    complete_consumer = (
        db.query(Consumer)
        .options(joinedload(Consumer.user))
        .filter(Consumer.consumerID == db_consumer.consumerID)
        .first()
    )

    return complete_consumer
