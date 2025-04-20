from pydantic import BaseModel


class StandardResponse(BaseModel):
    """
    Pydantic schema for a standardized API response.

    This schema provides a consistent format for API responses
    throughout the application, including a success flag and
    a descriptive message.

    Attributes:
        success (bool): Indicates if the API request was successful.
        message (str): A descriptive message about the result of the request.
    """

    success: bool
    message: str
