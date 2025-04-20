from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped

from database import Base
from .user import User


class Admin(Base):
    """
    Admin model representing system administrators.

    This class defines the SQLAlchemy ORM model for administrators in the system.
    Admins are users with elevated privileges for system management.

    Attributes:
        adminID (int): Primary key and unique identifier for the admin.
        userID (int): Foreign key linking to the associated User record.

    Relationships:
        user: One-to-one relationship with the User model.
    """

    __tablename__ = "admins"

    adminID = Column(Integer, primary_key=True, index=True)

    userID = Column(Integer, ForeignKey("users.userID"))
    user: Mapped["User"] = relationship("User", back_populates="admin")

    # notifications: Mapped["Notification"] = relationship("Notification", back_populates="admin")
    # css_history: Mapped[list["CustomerServiceSupportHistory"]] = relationship("CustomerServiceSupportHistory", back_populates="admin")
