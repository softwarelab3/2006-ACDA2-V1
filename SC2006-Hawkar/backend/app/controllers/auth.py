from fastapi import HTTPException
from sqlalchemy.orm import Session

import schemas.user as user_schemas
import services.user as user_services
import services.admin as admin_services
import services.consumer as consumer_services
import services.hawker as hawker_services


class AuthController:
    def signup(db: Session, user: user_schemas.UserCreate):
        """
        Register a new user in the system based on their role.

        Args:
            db (Session): Database session
            user (user_schemas.UserCreate): User information for registration

        Returns:
            The created user object based on their role (Admin/Consumer/Hawker)

        Raises:
            HTTPException: If email is already registered or role is invalid
        """
        db_user = user_services.get_user_by_email(db, email=user.emailAddress)
        if db_user:
            raise HTTPException(status_code=400, detail="Email is already registered!")

        match user.role:
            case user_schemas.Role.ADMIN:
                return admin_services.create_admin(db=db, user=user)
            case user_schemas.Role.CONSUMER:
                return consumer_services.create_consumer(db=db, user=user)
            case user_schemas.Role.HAWKER:
                return hawker_services.create_hawker(db=db, user=user)
        raise HTTPException(status_code=400, detail="User role is not valid.")

    def login(db: Session, user: user_schemas.UserLogin):
        """
        Authenticate and log in an existing user.

        Args:
            db (Session): Database session
            user (user_schemas.UserLogin): User login credentials

        Returns:
            The user object based on their role (Admin/Consumer/Hawker)

        Raises:
            HTTPException: If login credentials are invalid
        """
        db_user = user_services.login_user(db, user)
        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid login credentials")

        match db_user.role:
            case user_schemas.Role.ADMIN:
                return admin_services.get_admin_by_user_id(db, db_user.userID)
            case user_schemas.Role.CONSUMER:
                return consumer_services.get_consumer_by_user_id(db, db_user.userID)
            case user_schemas.Role.HAWKER:
                return hawker_services.get_hawker_by_user_id(db, db_user.userID)

        return db_user

    def loginOrSignupWithGoogle(db: Session, email: str, name: str, picture: str = ""):
        """
        Handle Google authentication - login existing users or create new ones.

        Args:
            db (Session): Database session
            email (str): User's email from Google authentication
            name (str): User's name from Google authentication
            picture (str, optional): URL to user's profile picture. Defaults to empty string.

        Returns:
            The appropriate user object (Admin/Consumer/Hawker)

        Raises:
            HTTPException: If Google authentication processing fails
        """
        print(f"Processing Google authentication for: {email}")

        # The login_or_create_google_user function now returns the appropriate
        # Admin/Consumer/Hawker object already, so we don't need to do additional mapping
        result = user_services.login_or_create_google_user(db, email, name, picture)

        if not result:
            print("Failed to process Google authentication - no result returned")
            raise HTTPException(
                status_code=400, detail="Failed to process Google authentication"
            )

        print(f"Successfully authenticated Google user: {result}")
        return result
