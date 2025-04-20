from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Dish(BaseModel):
    """
    Pydantic schema for representing a dish.

    This schema is used for serializing dish data from the database
    to be sent to clients. It includes basic dish information like
    name, price, and promotional status.

    Attributes:
        dishID (int): The unique identifier for the dish.
        stallID (int, optional): The ID of the stall offering this dish.
        dishName (str): The name of the dish.
        price (float): The regular price of the dish.
        photo (str, optional): URL or path to the dish's photo.
        onPromotion (bool, optional): Whether the dish is on promotion.
    """

    dishID: int
    stallID: Optional[int] = None
    dishName: str
    price: float
    photo: Optional[str] = None
    onPromotion: Optional[bool] = False

    class ConfigDict:
        from_attributes = True


class DishCreate(BaseModel):
    """
    Pydantic schema for creating a new dish.

    This schema is used when adding a new dish to the system.
    It includes fields for both the dish and its potential promotion.

    Attributes:
        stallID (int): The ID of the stall offering this dish.
        dishName (str): The name of the dish.
        price (float): The regular price of the dish.
        photo (str, optional): URL or path to the dish's photo.
        onPromotion (bool, optional): Whether the dish is on promotion.
        startDate (datetime, optional): Start date of promotion if applicable.
        endDate (datetime, optional): End date of promotion if applicable.
        discountedPrice (float, optional): Promotional price if on promotion.
    """

    stallID: int
    dishName: str
    price: float
    photo: Optional[str] = None
    onPromotion: Optional[bool] = False
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None
    discountedPrice: Optional[float] = None


class DishUpdate(BaseModel):
    """
    Pydantic schema for updating an existing dish.

    This schema is used when modifying a dish's information.
    All fields except dishID are optional to allow partial updates.

    Attributes:
        dishID (int): The unique identifier of the dish to update.
        stallID (int, optional): Updated stall ID.
        dishName (str, optional): Updated dish name.
        price (float, optional): Updated price.
        photo (str, optional): Updated photo URL or path.
        onPromotion (bool, optional): Updated promotion status.
        startDate (datetime, optional): Updated promotion start date.
        endDate (datetime, optional): Updated promotion end date.
        discountedPrice (float, optional): Updated promotional price.
    """

    dishID: int
    stallID: Optional[int] = None
    dishName: Optional[str] = None
    price: Optional[float] = None
    photo: Optional[str] = None
    onPromotion: Optional[bool] = False
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None
    discountedPrice: Optional[float] = None
