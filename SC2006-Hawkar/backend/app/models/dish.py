from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship, Mapped

from database import Base


class Dish(Base):
    """
    Dish model representing food items sold by hawker stalls.
    
    This class defines the SQLAlchemy ORM model for dishes offered by hawker stalls.
    Each dish has details about its name, price, photo, and promotional status.
    
    Attributes:
        dishID (int): Primary key and unique identifier for the dish.
        dishName (str): Name of the dish.
        price (float): Price of the dish.
        photo (str): URL or path to the dish's photo.
        onPromotion (bool): Flag indicating if the dish is currently on promotion.
        stallID (int): Foreign key linking to the stall that sells this dish.
        
    Relationships:
        stall: Many-to-one relationship with the Stall model.
        promotions: Relationship with the Promotion model.
    """
    __tablename__ = "dishes"

    dishID = Column(Integer, primary_key=True, index=True)
    dishName = Column(String)
    price = Column(Float)
    photo = Column(String)
    onPromotion = Column(Boolean)

    stallID = Column(Integer, ForeignKey("stalls.stallID"))
    stall: Mapped["Stall"] = relationship("Stall", back_populates="dishes")

    promotions: Mapped["Promotion"] = relationship("Promotion", back_populates="dishes")
