from pydantic import BaseModel
from typing import Optional
from enum import Enum

from .consumer import Consumer
from .stall import Stall


class ReviewAction(Enum):
    """
    Enumeration for actions that can be taken on reported reviews.

    This enum defines the possible administrative actions when
    handling reported reviews in the moderation system.

    Attributes:
        DELETE: Remove the reported review from the system.
        IGNORE: Keep the review despite the report.
        CANCEL: Cancel the report action.
    """

    DELETE = "Delete"
    IGNORE = "Ignore"
    CANCEL = "Cancel"


class ReportType(Enum):
    """
    Enumeration for types of review reports.

    This enum defines the categories of issues that users
    can report about reviews in the system.

    Attributes:
        SPAM: The review is spam or advertising content.
        IRRELEVANT: The review is not relevant to the stall.
        OFFENSIVE: The review contains offensive or inappropriate content.
    """

    SPAM = "spam"
    IRRELEVANT = "irrelevant"
    OFFENSIVE = "offensive"


class Review(BaseModel):
    """
    Pydantic schema for representing a review of a stall.

    This schema is used for serializing review data from the database
    to be sent to clients. It includes the review content, rating, and
    reporting-related fields.

    Attributes:
        reviewID (int): The unique identifier for the review.
        reviewText (str): The text content of the review.
        rating (float): The numerical rating given (typically 1-5).
        isReported (bool): Whether the review has been reported.
        reportText (str, optional): Additional details about the report.
        reportType (ReportType, optional): The type/reason for the report.
        consumerID (int): The ID of the consumer who wrote the review.
        consumer (Consumer): Nested Consumer schema with consumer details.
        stallID (int): The ID of the stall being reviewed.
        stall (Stall): Nested Stall schema with stall details.
    """

    reviewID: int
    reviewText: str
    rating: float
    isReported: bool = False
    reportText: Optional[str] = None
    reportType: Optional[ReportType] = None

    consumerID: int
    consumer: Consumer

    stallID: int
    stall: Stall

    class ConfigDict:
        from_attributes = True


class ReviewCreate(BaseModel):
    reviewText: str
    rating: float
    isReported: bool = False
    reportText: Optional[str] = None
    reportType: Optional[ReportType] = None

    consumerID: int
    stallID: int


class ReviewUpdate(BaseModel):
    reviewID: int
    reviewText: Optional[str] = None
    rating: Optional[float] = 0.0
    isReported: Optional[bool] = False
    reportText: Optional[str] = None
    reportType: Optional[ReportType] = None

    consumerID: Optional[int] = None


class ReviewReport(BaseModel):
    reviewID: int
    reportType: ReportType
    reportText: str
