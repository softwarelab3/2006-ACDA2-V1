from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import time

from .hawker import Hawker
from .hawkerCenter import HawkerCenter
from .user import CuisineType, HygieneRating


class Stall(BaseModel):
    """
    Pydantic schema for representing a food stall.

    This schema is used for serializing stall data from the database
    to be sent to clients. It includes details about the stall's location,
    operating hours, cuisine type, and other relevant information.

    Attributes:
        stallID (int): The unique identifier for the stall.
        stallName (str): The name of the stall.
        hawkerID (int): The ID of the hawker who owns this stall.
        hawker (Hawker): Nested Hawker schema with hawker details.
        hawkerCenterID (int, optional): The ID of the hawker center where this stall is located.
        hawkerCenter (HawkerCenter): Nested HawkerCenter schema with center details.
        images (List[str], optional): URLs or paths to stall images.
        unitNumber (str, optional): The unit number within the hawker center.
        startTime (time, optional): Daily opening time.
        endTime (time, optional): Daily closing time.
        hygieneRating (HygieneRating, optional): Hygiene rating of the stall.
        cuisineType (List[CuisineType], optional): Types of cuisine offered.
        estimatedWaitTime (int, optional): Estimated waiting time in minutes.
        priceRange (str, optional): Indication of the price range of dishes.
    """

    stallID: int
    stallName: str
    hawkerID: int
    hawker: Hawker
    hawkerCenterID: Optional[int] = None
    hawkerCenter: HawkerCenter
    images: Optional[List[str]] = None
    unitNumber: Optional[str] = None
    startTime: Optional[time] = None
    endTime: Optional[time] = None
    hygieneRating: Optional[HygieneRating] = None
    cuisineType: Optional[List[CuisineType]] = None
    estimatedWaitTime: Optional[int] = None
    priceRange: Optional[str] = None

    class ConfigDict:
        from_attributes = True


class StallCreate(BaseModel):
    """
    Pydantic schema for creating a new food stall.

    This schema is used when adding a new stall to the system.
    It defines the required and optional fields for stall creation.

    Attributes:
        stallName (str): The name of the stall.
        hawkerID (int): The ID of the hawker who owns this stall.
        hawkerCenterID (int, optional): The ID of the hawker center where this stall is located.
        images (List[str], optional): URLs or paths to stall images.
        unitNumber (str, optional): The unit number within the hawker center.
        startTime (time, optional): Daily opening time.
        endTime (time, optional): Daily closing time.
        hygieneRating (HygieneRating, optional): Hygiene rating of the stall.
        cuisineType (List[CuisineType], optional): Types of cuisine offered.
        estimatedWaitTime (int, optional): Estimated waiting time in minutes.
        priceRange (str, optional): Indication of the price range of dishes.
    """

    stallName: str
    hawkerID: int
    hawkerCenterID: Optional[int] = None
    images: Optional[List[str]] = None
    unitNumber: Optional[str] = None
    startTime: Optional[time] = None
    endTime: Optional[time] = None
    hygieneRating: Optional[HygieneRating] = None
    cuisineType: Optional[List[CuisineType]] = None
    estimatedWaitTime: Optional[int] = None
    priceRange: Optional[str] = None


class StallUpdate(BaseModel):
    """
    Pydantic schema for updating an existing food stall.

    This schema is used when modifying a stall's information.
    All fields except stallID are optional to allow partial updates.

    Attributes:
        stallID (int): The unique identifier of the stall to update.
        stallName (str, optional): Updated stall name.
        hawkerID (int, optional): Updated hawker ID.
        hawkerCenterID (int, optional): Updated hawker center ID.
        images (List[str], optional): Updated stall images.
        unitNumber (str, optional): Updated unit number.
        startTime (time, optional): Updated opening time.
        endTime (time, optional): Updated closing time.
        hygieneRating (HygieneRating, optional): Updated hygiene rating.
        cuisineType (List[CuisineType], optional): Updated cuisine types.
        estimatedWaitTime (int, optional): Updated wait time.
        priceRange (str, optional): Updated price range.
    """

    stallID: int
    stallName: Optional[str] = None
    hawkerID: Optional[int] = None
    hawkerCenterID: Optional[int] = None
    images: Optional[List[str]] = None
    unitNumber: Optional[str] = None
    startTime: Optional[time] = None
    endTime: Optional[time] = None
    hygieneRating: Optional[HygieneRating] = None
    cuisineType: Optional[List[CuisineType]] = None
    estimatedWaitTime: Optional[int] = None
    priceRange: Optional[str] = None
