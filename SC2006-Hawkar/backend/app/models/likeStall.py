from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from database import Base


class LikeStall(Base):
    """
    LikeStall model representing the "likes" or favorites that users have for stalls.

    This class defines the SQLAlchemy ORM model for the many-to-many relationship
    between Users and Stalls, where users can like or favorite specific stalls.
    A unique constraint ensures that a user can only like a specific stall once.

    Attributes:
        id (int): Primary key and unique identifier for the like record.
        userID (int): Foreign key linking to the user who liked the stall.
        stallID (int): Foreign key linking to the stall that was liked.

    Relationships:
        user: Many-to-one relationship with the User model.
        stall: Many-to-one relationship with the Stall model.
    """

    __tablename__ = "like_stalls"

    id = Column(Integer, primary_key=True, index=True)
    userID = Column(Integer, ForeignKey("users.userID"), nullable=False)
    stallID = Column(Integer, ForeignKey("stalls.stallID"), nullable=False)

    # Create relationships for convenient access
    user = relationship("User", backref="liked_stalls")
    stall = relationship("Stall", backref="user_likes")

    # Ensure a user can only like a stall once
    __table_args__ = (UniqueConstraint("userID", "stallID", name="_user_stall_uc"),)
