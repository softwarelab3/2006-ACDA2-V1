from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from typing import List

from database import Base
from .user import User


class Hawker(Base):
    """
    Hawker model representing hawker stall owners in the system.

    This class defines the SQLAlchemy ORM model for hawkers who own and manage
    food stalls in hawker centers.

    Attributes:
        hawkerID (int): Primary key and unique identifier for the hawker.
        address (str): Hawker's business address.
        license (str): Hawker's license number or identifier.
        verifyStatus (bool): Flag indicating if the hawker has been verified.
        userID (int): Foreign key linking to the associated User record.

    Relationships:
        user: One-to-one relationship with the User model.
        stall: One-to-many relationship with Stall models owned by this hawker.
    """

    __tablename__ = "hawkers"

    hawkerID = Column(Integer, primary_key=True, index=True)
    address = Column(String)
    license = Column(String)
    verifyStatus = Column(Boolean)

    userID = Column(Integer, ForeignKey("users.userID"))
    user: Mapped["User"] = relationship("User", back_populates="hawker")
    stall: Mapped[List["Stall"]] = relationship("Stall", back_populates="hawker")
