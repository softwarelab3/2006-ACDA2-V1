from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Literal, Any
from enum import Enum


class Role(Enum):
    ADMIN = "Admin"
    CONSUMER = "Consumer"
    HAWKER = "Hawker"


class DietaryType(Enum):
    Vegetarian = "Vegetarian"
    Vegan = "Vegan"
    Halal = "Halal"
    GlutenFree = "Gluten-Free"
    DairyFree = "Dairy-Free"
    Normal = "Normal"


class CuisineType(Enum):
    Chinese = "Chinese"
    Indian = "Indian"
    Malay = "Malay"
    Western = "Western"
    Japanese = "Japanese"
    Korean = "Korean"
    Thai = "Thai"
    Italian = "Italian"
    Indonesian = "Indonesian"
    Vietnamese = "Vietnamese"


class StatusType(Enum):
    """
    Enumeration for ambulatory status types of consumers.

    This enum defines the possible mobility statuses that can be
    assigned to consumers for accessibility considerations.

    Attributes:
        Ambulatory: User can walk but has mobility limitations.
        Wheelchair: User requires wheelchair accessibility.
        Normal: User has no specific mobility requirements.
    """

    Ambulatory = "Ambulatory"
    Wheelchair = "Wheelchair"
    Normal = "Normal"


class HygieneRating(Enum):
    """
    Enumeration for hygiene ratings of food stalls.

    This enum defines the standard hygiene ratings that can be
    assigned to hawker stalls based on cleanliness inspections.

    Attributes:
        A: Excellent hygiene standards.
        B: Good hygiene standards.
        C: Acceptable hygiene standards.
    """

    A = "A"
    B = "B"
    C = "C"


class UserBase(BaseModel):
    """
    Base Pydantic schema for user data.

    This schema defines the common fields required for all user types
    and serves as a base class for other user-related schemas.

    Attributes:
        name (str): User's full name.
        emailAddress (EmailStr): User's email address (validated email format).
    """

    name: str
    emailAddress: EmailStr


class User(UserBase):
    """
    Pydantic schema for representing a user.

    This schema extends UserBase and is used for serializing user data
    from the database to be sent to clients. It includes all user details.

    Attributes:
        userID (int): The unique identifier for the user.
        profilePhoto (str, optional): URL or path to user's profile photo.
        contactNumber (str, optional): User's contact phone number.
        role (Role): User's role in the system (Admin, Consumer, or Hawker).
        isGoogleUser (bool): Whether the user authenticated via Google OAuth.
    """

    userID: int
    profilePhoto: Optional[str] = ""
    contactNumber: Optional[str] = ""
    role: Role
    isGoogleUser: bool = False

    class ConfigDict:
        from_attributes = True


class UserCreate(UserBase):
    """
    Pydantic schema for creating a new user.

    This schema extends UserBase and is used when registering a new user
    in the system, including authentication and role information.

    Attributes:
        password (str, optional): User's password (nullable for Google users).
        role (Role): User's role in the system.
        profilePhoto (str, optional): URL or path to user's profile photo.
        contactNumber (str, optional): User's contact phone number.
        isGoogleUser (bool): Whether the user is being created via Google OAuth.
    """

    password: Optional[str] = None
    role: Role
    profilePhoto: Optional[str] = ""
    contactNumber: Optional[str] = ""
    isGoogleUser: bool = False


class UserUpdate(UserBase):
    userID: int
    profilePhoto: Optional[str] = ""
    contactNumber: Optional[str] = ""


class UserLogin(BaseModel):
    emailAddress: EmailStr
    password: str


class UserSignup(BaseModel):
    userType: Literal["admin", "consumer", "hawker"]
    data: Dict[str, Any]


class GoogleUser(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = ""
