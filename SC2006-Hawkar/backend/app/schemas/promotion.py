from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Promotion(BaseModel):
    """
    Pydantic schema for representing a promotion on a dish.

    This schema is used for serializing promotion data from the database
    to be sent to clients. It includes details about the promotional period
    and special pricing.

    Attributes:
        promotionID (int): The unique identifier for the promotion.
        dishID (int, optional): The ID of the dish on promotion.
        startDate (datetime): When the promotion begins.
        endDate (datetime): When the promotion ends.
        discountedPrice (float): The special promotional price.
    """

    promotionID: int
    dishID: Optional[int] = None
    startDate: datetime
    endDate: datetime
    discountedPrice: float

    class ConfigDict:
        from_attributes = True


class PromotionCreate(BaseModel):
    """
    Pydantic schema for creating a new promotion.

    This schema is used when adding a new promotional offer to the system.

    Attributes:
        dishID (int, optional): The ID of the dish to put on promotion.
        startDate (datetime): When the promotion begins.
        endDate (datetime): When the promotion ends.
        discountedPrice (float): The special promotional price.
    """

    dishID: Optional[int] = None
    startDate: datetime
    endDate: datetime
    discountedPrice: float


class PromotionUpdate(BaseModel):
    """
    Pydantic schema for updating an existing promotion.

    This schema is used when modifying a promotion's information.
    All fields except promotionID are optional to allow partial updates.

    Attributes:
        promotionID (int): The unique identifier of the promotion to update.
        dishID (int, optional): Updated dish ID.
        startDate (datetime, optional): Updated promotion start date.
        endDate (datetime, optional): Updated promotion end date.
        discountedPrice (float, optional): Updated promotional price.
    """

    promotionID: int
    dishID: Optional[int] = None
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None
    discountedPrice: Optional[float] = None
