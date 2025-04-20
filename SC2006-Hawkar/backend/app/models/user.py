from sqlalchemy import Column, Integer, String, Enum, Boolean
from sqlalchemy.orm import relationship, Mapped

from database import Base
from schemas.user import Role


class User(Base):
    """
    User model representing a system user.

    This class defines the SQLAlchemy ORM model for users in the system.
    Users can have different roles (Admin, Consumer, Hawker) and may authenticate
    through traditional login or Google OAuth.

    Attributes:
        userID (int): Primary key and unique identifier for the user.
        name (str): User's full name.
        emailAddress (str): User's email address (unique, indexed).
        password (str): Hashed password for authentication (nullable for Google users).
        profilePhoto (str): URL or path to the user's profile photo.
        contactNumber (str): User's contact phone number.
        role (Role): User's role in the system (Admin, Consumer, or Hawker).
        isGoogleUser (bool): Flag indicating if the user authenticated via Google.

    Relationships:
        admin: One-to-one relationship with Admin model.
        consumer: One-to-one relationship with Consumer model.
        hawker: One-to-one relationship with Hawker model.
    """

    __tablename__ = "users"

    userID = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    emailAddress = Column(String, unique=True, index=True)
    password = Column(String, nullable=True)  # Made nullable for Google users
    profilePhoto = Column(String)
    contactNumber = Column(String)
    role = Column(Enum(Role))
    isGoogleUser = Column(Boolean, default=False)

    admin: Mapped["Admin"] = relationship("Admin", back_populates="user")
    consumer: Mapped["Consumer"] = relationship("Consumer", back_populates="user")
    hawker: Mapped["Hawker"] = relationship("Hawker", back_populates="user")

    # notifications: Mapped["Notification"] = relationship(
    #     "Notification", back_populates="receiver"
    # )
    # css_history: Mapped[list["CustomerServiceSupportHistory"]] = relationship(
    #     "CustomerServiceSupportHistory", back_populates="user"
    # )
