import json
from fastapi import HTTPException
from sqlalchemy.orm import Session


import services.user as user_services
import services.hawker as hawker_services

import schemas.user as user_schemas
import schemas.hawker as hawker_schemas


class UserController:
    """Controller for user-related operations, including CRUD for users and hawkers."""

    # -------------------------------------------------------- #
    # -------------------- Business Logic -------------------- #
    # -------------------------------------------------------- #

    # ----- Hawker ----- #
    def getAllHawkers(db: Session, skip: int, limit: int):
        """Get all hawkers with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of hawkers.
        """
        return hawker_services.get_all_hawkers(db, skip=skip, limit=limit)

    # def getAllPublicHawkers():
    #     with open("assets/data/HawkerCentresGEOJSON.geojson") as geojson_file:
    #         raw_json = json.loads(geojson_file.read())

    #         # Parse data
    #         publicHawkers: list[hawker_schemas.Hawker] = []
    #         for hawker_json in raw_json["features"]:
    #             address = (
    #                 hawker_json["properties"]["Description"]["ADDRESSBUILDINGNAME"]
    #                 + " "
    #                 + hawker_json["properties"]["Description"]["ADDRESSBUILDINGNAME"]
    #                 + " "
    #                 + hawker_json["properties"]["Description"]["ADDRESSPOSTALCODE"]
    #             )

    #             hawker: hawker_schemas.Hawker = {
    #                 "userID": 0,
    #                 "user": {
    #                     "userID": 0,
    #                     "name": "Public Hawker",
    #                     "emailAddress": "-",
    #                     "password": "-",
    #                     "profilePhoto": hawker_json["properties"]["Description"][
    #                         "PHOTOURL"
    #                     ],
    #                     "role": user_schemas.Role.HAWKER,
    #                 },
    #                 "hawkerID": 0,
    #                 "businessName": hawker_json["properties"]["Description"]["NAME"],
    #                 "contactNumber": "Unknown",
    #                 "verifyStatus": False,
    #                 "address": address,
    #                 "geometry": {
    #                     "type": hawker_json["properties"]["geometry"]["type"],
    #                     "latitude": hawker_json["properties"]["geometry"][
    #                         "coordinates"
    #                     ][1],
    #                     "longitude": hawker_json["properties"]["geometry"][
    #                         "coordinates"
    #                     ][0],
    #                 },
    #             }
    #             publicHawkers.append(hawker)

    #         return publicHawkers

    # ------------------------------------------------------------ #
    # -------------------- User (CRUD) --------------------------- #
    # ------------------------------------------------------------ #
    def getAllUsers(db: Session, skip: int, limit: int):
        """Get all users with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Returns:
            list: List of users.
        """
        users = user_services.get_all_users(db, skip=skip, limit=limit)
        return users

    def getUserById(db: Session, userID: int):
        """Get a user by their user ID.

        Args:
            db (Session): Database session.
            userID (int): User ID of the user.
        Raises:
            HTTPException: If the user is not found.
        Returns:
            User: The user object.
        """
        user = user_services.get_user_by_id(db, userID=userID)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def getUserByEmail(db: Session, email: str):
        """Get a user by their email address.

        Args:
            db (Session): Database session.
            email (str): Email address of the user.
        Raises:
            HTTPException: If the user is not found.
        Returns:
            User: The user object.
        """
        user = user_services.get_user_by_email(db, email=email)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def updateUser(db: Session, updated_user: user_schemas.UserUpdate):
        """Update a user's information.

        Args:
            db (Session): Database session.
            updated_user (UserUpdate): Updated user schema.
        Raises:
            HTTPException: If the user is not found.
        Returns:
            User: The updated user object.
        """
        user = user_services.update_user(db, updated_user)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def createUser(db: Session, new_user: user_schemas.UserCreate):
        """Create a new user.

        Args:
            db (Session): Database session.
            new_user (UserCreate): User creation schema.
        Returns:
            User: The created user object.
        """
        user = user_services.create_user(db, new_user)
        return user
