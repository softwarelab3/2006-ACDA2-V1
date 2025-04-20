from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from typing import List

from database import Base
from .user import User


class HawkerCenter(Base):
    """
    HawkerCenter model representing food centers in the system.

    This class defines the SQLAlchemy ORM model for hawker centers, which are
    venues that contain multiple food stalls.

    Attributes:
        hawkerCenterID (int): Primary key and unique identifier for the hawker center.
        name (str): Name of the hawker center.
        address (str): Physical address of the hawker center.
        latitude (float): Geographic latitude coordinate of the hawker center.
        longitude (float): Geographic longitude coordinate of the hawker center.

    Relationships:
        stalls: One-to-many relationship with Stall models located in this hawker center.
    """

    __tablename__ = "hawkerCenters"

    hawkerCenterID = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

    stalls: Mapped[List["Stall"]] = relationship("Stall", back_populates="hawkerCenter")
