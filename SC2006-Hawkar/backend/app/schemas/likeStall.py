from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class LikeStall(BaseModel):
    """
    Pydantic schema for representing a "like" relationship between a user and a stall.

    This schema is used for serializing like information from the database
    to be sent to clients. It represents a user's interest in or favoriting of a stall.

    Attributes:
        stallID (int): The ID of the stall that is liked.
        userID (int): The ID of the user who liked the stall.
    """

    stallID: int
    userID: int

    class ConfigDict:
        from_attributes = True


class LikedStallByUserID(BaseModel):
    """
    Pydantic schema for representing a stall liked by a specific user.

    This schema is used primarily for queries that filter stalls by user likes.
    It contains just the ID of the stall that matches the like criteria.

    Attributes:
        stallID (int, optional): The ID of a stall liked by the user.
    """

    stallID: Optional[int] = None
