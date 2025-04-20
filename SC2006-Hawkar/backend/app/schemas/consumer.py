from pydantic import BaseModel
from typing import Optional, List


from .user import (
    User,
    UserCreate,
    UserUpdate,
    Role,
    DietaryType,
    CuisineType,
    StatusType,
)


class Consumer(BaseModel):
    """
    Pydantic schema for representing a consumer.

    This schema is used for serializing consumer data from the database
    to be sent to clients. It includes consumer-specific preferences and
    dietary information.

    Attributes:
        consumerID (int): The unique identifier for the consumer.
        address (str): Consumer's address.
        dietaryPreference (DietaryType): Consumer's dietary preferences.
        preferredCuisine (CuisineType): Consumer's preferred cuisine type.
        ambulatoryStatus (StatusType): Consumer's mobility status.
        userID (int): Foreign key linking to the associated user.
        user (User): Nested User schema with user details.
    """

    consumerID: int
    address: str
    dietaryPreference: DietaryType
    preferredCuisine: CuisineType
    ambulatoryStatus: StatusType
    # favoriteStalls: Optional[List[int]] = None

    userID: int
    user: User

    class ConfigDict:
        from_attributes = True


class ConsumerCreate(UserCreate):
    """
    Pydantic schema for creating a new consumer.

    This schema extends UserCreate and sets the role to CONSUMER by default.
    Used when registering a new consumer in the system with their preferences.

    Attributes:
        role (Role): User role, defaulted to CONSUMER.
        address (str): Consumer's address.
        dietaryPreference (DietaryType, optional): Consumer's dietary preferences.
        preferredCuisine (CuisineType, optional): Consumer's preferred cuisine type.
        ambulatoryStatus (StatusType, optional): Consumer's mobility status.
    """

    role: Role = Role.CONSUMER
    address: str
    dietaryPreference: Optional[DietaryType]
    preferredCuisine: Optional[CuisineType]
    ambulatoryStatus: Optional[StatusType]
    # favoriteStalls: Optional[List[int]] = None


class ConsumerUpdate(UserUpdate):
    """
    Pydantic schema for updating an existing consumer.

    This schema extends UserUpdate and allows updating consumer-specific
    fields while requiring the consumer's ID to identify which consumer to update.

    Attributes:
        consumerID (int): The unique identifier of the consumer to update.
        address (str, optional): Updated address.
        dietaryPreference (DietaryType, optional): Updated dietary preference.
        preferredCuisine (CuisineType, optional): Updated cuisine preference.
        ambulatoryStatus (StatusType, optional): Updated mobility status.
    """

    consumerID: int
    address: Optional[str]
    dietaryPreference: Optional[DietaryType]
    preferredCuisine: Optional[CuisineType]
    ambulatoryStatus: Optional[StatusType]
    # favoriteStalls: Optional[List[int]] = None
