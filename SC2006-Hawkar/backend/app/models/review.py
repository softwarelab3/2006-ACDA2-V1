from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship, Mapped

from database import Base
from schemas.review import ReportType


class Review(Base):
    """
    Review model representing consumer reviews of stalls.

    This class defines the SQLAlchemy ORM model for reviews that consumers
    leave for hawker stalls, including ratings and reporting functionality
    for moderation purposes.

    Attributes:
        reviewID (int): Primary key and unique identifier for the review.
        reviewText (str): The text content of the review.
        rating (int): Numerical rating given to the stall.
        isReported (bool): Flag indicating if the review has been reported.
        reportType (ReportType): The type/reason for the report if reported.
        reportText (str): Additional text explaining the report reason.
        consumerID (int): Foreign key linking to the consumer who wrote the review.
        stallID (int): Foreign key linking to the stall being reviewed.

    Relationships:
        consumer: Many-to-one relationship with the Consumer model.
        stall: Many-to-one relationship with the Stall model.
    """

    __tablename__ = "reviews"

    reviewID = Column(Integer, primary_key=True, index=True)
    reviewText = Column(String)
    rating = Column(Integer)
    isReported = Column(Boolean)
    reportType = Column(Enum(ReportType))
    reportText = Column(String)

    consumerID = Column(Integer, ForeignKey("consumers.consumerID"))
    consumer: Mapped["Consumer"] = relationship("Consumer", back_populates="reviews")

    stallID = Column(Integer, ForeignKey("stalls.stallID"))
    stall: Mapped["Stall"] = relationship("Stall", back_populates="reviews")
