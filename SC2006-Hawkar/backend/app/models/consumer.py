from sqlalchemy import Column, Integer, Boolean, ForeignKey, String, Enum
from sqlalchemy.orm import relationship, Mapped

from database import Base
from .user import User
from schemas.user import DietaryType, CuisineType, StatusType


class Consumer(Base):
    """
    Consumer model representing system users who consume hawker food.

    This class defines the SQLAlchemy ORM model for consumers in the system.
    Consumers are users who can browse hawker stalls, leave reviews, and have
    specific preferences and requirements.

    Attributes:
        consumerID (int): Primary key and unique identifier for the consumer.
        address (str): Consumer's address for delivery or location-based services.
        dietaryPreference (DietaryType): Consumer's dietary preferences (e.g., vegetarian).
        preferredCuisine (CuisineType): Consumer's preferred cuisine type.
        ambulatoryStatus (StatusType): Consumer's mobility status for accessibility needs.
        userID (int): Foreign key linking to the associated User record.

    Relationships:
        user: One-to-one relationship with the User model.
        reviews: One-to-many relationship with Review models created by this consumer.
    """

    __tablename__ = "consumers"

    consumerID = Column(Integer, primary_key=True, index=True)
    address = Column(String)
    dietaryPreference = Column(Enum(DietaryType))
    preferredCuisine = Column(Enum(CuisineType))
    ambulatoryStatus = Column(Enum(StatusType))
    # favoriteStalls = Column(String)

    userID = Column(Integer, ForeignKey("users.userID"))
    user: Mapped["User"] = relationship("User", back_populates="consumer")
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="consumer")
