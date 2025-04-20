from sqlalchemy import Column, Integer, String, Boolean, Float, Enum, ForeignKey, Time
from sqlalchemy.orm import relationship, Mapped
from typing import List

from database import Base
from schemas.user import CuisineType, HygieneRating


class Stall(Base):
    """
    Stall model representing food stalls in hawker centers.

    This class defines the SQLAlchemy ORM model for food stalls that operate
    within hawker centers. Each stall has details about its cuisine type,
    operating hours, hygiene rating, and other relevant information.

    Attributes:
        stallID (int): Primary key and unique identifier for the stall.
        stallName (str): Name of the food stall.
        images (str): URLs or paths to stall images.
        unitNumber (str): Physical unit number of the stall in the hawker center.
        startTime (Time): Daily opening time of the stall.
        endTime (Time): Daily closing time of the stall.
        hygieneRating (HygieneRating): Official hygiene rating of the stall.
        cuisineType (CuisineType): Type of cuisine served by the stall.
        estimatedWaitTime (int): Estimated waiting time in minutes.
        priceRange (str): Indication of the price range of dishes.
        hawkerID (int): Foreign key linking to the hawker who owns the stall.
        hawkerCenterID (int): Foreign key linking to the hawker center where the stall is located.

    Relationships:
        hawker: Many-to-one relationship with the Hawker model.
        hawkerCenter: Many-to-one relationship with the HawkerCenter model.
        reviews: One-to-many relationship with Review models for this stall.
        dishes: One-to-many relationship with Dish models offered by this stall.
    """

    __tablename__ = "stalls"

    stallID = Column(Integer, primary_key=True, index=True)
    stallName = Column(String)
    images = Column(String)
    unitNumber = Column(String)
    startTime = Column(Time)
    endTime = Column(Time)
    hygieneRating = Column(Enum(HygieneRating))
    cuisineType = Column(String, Enum(CuisineType))
    estimatedWaitTime = Column(Integer)
    priceRange = Column(String)

    hawkerID = Column(Integer, ForeignKey("hawkers.hawkerID"))
    hawker: Mapped["Hawker"] = relationship("Hawker", back_populates="stall")

    hawkerCenterID = Column(Integer, ForeignKey("hawkerCenters.hawkerCenterID"))
    hawkerCenter: Mapped["HawkerCenter"] = relationship(
        "HawkerCenter", back_populates="stalls"
    )

    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="stall")
    dishes: Mapped[List["Dish"]] = relationship("Dish", back_populates="stall")
