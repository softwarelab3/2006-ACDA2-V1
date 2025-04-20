from pydantic import BaseModel


class HawkerCenter(BaseModel):
    """
    Pydantic schema for representing a hawker center.

    This schema is used for serializing hawker center data from the database
    to be sent to clients. It includes location and identification information.

    Attributes:
        hawkerCenterID (int): The unique identifier for the hawker center.
        name (str): The name of the hawker center.
        address (str): Physical address of the hawker center.
        latitude (float): Geographic latitude coordinate.
        longitude (float): Geographic longitude coordinate.
    """

    hawkerCenterID: int
    name: str
    address: str
    latitude: float
    longitude: float

    class ConfigDict:
        from_attributes = True


class HawkerCenterCreate(BaseModel):
    """
    Pydantic schema for creating a new hawker center.

    This schema is used when adding a new hawker center to the system.

    Attributes:
        name (str): The name of the hawker center.
        address (str): Physical address of the hawker center.
        latitude (float): Geographic latitude coordinate.
        longitude (float): Geographic longitude coordinate.
    """

    name: str
    address: str
    latitude: float
    longitude: float


class HawkerCenterUpdate(BaseModel):
    """
    Pydantic schema for updating an existing hawker center.

    This schema is used when modifying a hawker center's information.

    Attributes:
        hawkerCenterID (int): The unique identifier of the hawker center to update.
        name (str): Updated name of the hawker center.
        address (str): Updated physical address.
        latitude (float): Updated geographic latitude coordinate.
        longitude (float): Updated geographic longitude coordinate.
    """

    hawkerCenterID: int
    name: str
    address: str
    latitude: float
    longitude: float
