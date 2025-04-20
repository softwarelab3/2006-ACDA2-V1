from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped

from database import Base


class Promotion(Base):
    """
    Promotion model representing dish promotions or special offers.
    
    This class defines the SQLAlchemy ORM model for promotional offers
    on dishes within the system, providing details on discounted pricing
    and the period during which the promotion is valid.
    
    Attributes:
        promotionID (int): Primary key and unique identifier for the promotion.
        startDate (DateTime): Date and time when the promotion starts.
        endDate (DateTime): Date and time when the promotion ends.
        discountedPrice (float): The special promotional price for the dish.
        dishID (int): Foreign key linking to the dish on promotion.
        
    Relationships:
        dishes: Many-to-one relationship with the Dish model.
    """
    __tablename__ = "promotions"

    promotionID = Column(Integer, primary_key=True, index=True)
    startDate = Column(DateTime)
    endDate = Column(DateTime)
    discountedPrice = Column(Float)

    dishID = Column(Integer, ForeignKey("dishes.dishID"))
    dishes: Mapped["Dish"] = relationship("Dish", back_populates="promotions")
