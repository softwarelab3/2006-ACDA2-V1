from pydantic import BaseModel

from .user import User, UserCreate, UserUpdate, Role


class Admin(BaseModel):
    """
    Pydantic schema for representing an admin.

    This schema is used for serializing admin data from the database
    to be sent to clients.

    Attributes:
        adminID (int): The unique identifier for the admin.
        userID (int): Foreign key linking to the associated user.
        user (User): Nested User schema with user details.
    """

    adminID: int
    userID: int
    user: User

    class ConfigDict:
        from_attributes = True


class AdminCreate(UserCreate):
    """
    Pydantic schema for creating a new admin.

    This schema extends UserCreate and sets the role to ADMIN by default.
    Used when registering a new admin in the system.

    Attributes:
        role (Role): User role, defaulted to ADMIN.
    """

    role: Role = Role.ADMIN


class AdminUpdate(UserUpdate):
    """
    Pydantic schema for updating an existing admin.

    This schema extends UserUpdate and requires the admin's ID
    to identify which admin to update.

    Attributes:
        adminID (int): The unique identifier of the admin to update.
    """

    adminID: int
