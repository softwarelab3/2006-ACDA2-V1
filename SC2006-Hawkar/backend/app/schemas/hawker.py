from pydantic import BaseModel
from typing import Optional, Union

from .user import User, UserCreate, UserUpdate, Role


class Hawker(BaseModel):
    """
    Pydantic schema for representing a hawker.

    This schema is used for serializing hawker data from the database
    to be sent to clients. It includes hawker-specific information like
    address, license, and verification status.

    Attributes:
        hawkerID (int): The unique identifier for the hawker.
        address (str): Hawker's business address.
        license (str): Hawker's license number or identifier.
        verifyStatus (bool): Whether the hawker has been verified.
        userID (int): Foreign key linking to the associated user.
        user (User): Nested User schema with user details.
    """

    hawkerID: int
    address: str
    license: str
    verifyStatus: bool = False
    userID: int
    user: User

    class ConfigDict:
        from_attributes = True


class HawkerCreate(UserCreate):
    """
    Pydantic schema for creating a new hawker.

    This schema extends UserCreate and sets the role to HAWKER by default.
    Used when registering a new hawker in the system with their business details.

    Attributes:
        role (Role): User role, defaulted to HAWKER.
        address (str): Hawker's business address.
        license (str): Hawker's license number or identifier.
        verifyStatus (bool): Initial verification status, defaults to False.
    """

    role: Role = Role.HAWKER
    address: str
    license: str
    verifyStatus: bool = False


class HawkerUpdate(UserUpdate):
    """
    Pydantic schema for updating an existing hawker.

    This schema extends UserUpdate and allows updating hawker-specific
    fields while requiring the hawker's ID to identify which hawker to update.

    Attributes:
        hawkerID (int): The unique identifier of the hawker to update.
        address (str): Updated business address.
        license (str): Updated license information.
        verifyStatus (bool): Updated verification status.
    """

    hawkerID: int
    address: str
    license: str
    verifyStatus: bool = False
