from sqlalchemy.orm import Session

import services.user as user_services
import schemas.admin as admin_schemas
import schemas.user as user_schemas
from models.admin import Admin
from models.user import User


def get_admin_by_user_id(db: Session, userID: int):
    """Retrieve an admin by their user ID.

    Args:
        db (Session): Database session.
        userID (int): User ID of the admin.

    Returns:
        Admin: The admin object, or None if not found.
    """
    return db.query(Admin).filter(Admin.userID == userID).first()


def get_admin_by_admin_id(db: Session, adminID: int):
    """Retrieve an admin by their admin ID.

    Args:
        db (Session): Database session.
        adminID (int): Admin ID.

    Returns:
        Admin: The admin object, or None if not found.
    """
    return db.query(Admin).filter(Admin.adminID == adminID).first()


def get_all_admins(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve all admins with pagination.

    Args:
        db (Session): Database session.
        skip (int): Number of records to skip.
        limit (int): Maximum number of records to return.

    Returns:
        list: List of admins.
    """
    return db.query(Admin).offset(skip).limit(limit).all()


def create_admin(db: Session, user: admin_schemas.AdminCreate):
    """Create a new admin and associated user.

    Args:
        db (Session): Database session.
        user (AdminCreate): Admin creation schema.

    Returns:
        Admin: The created admin object, or None if user creation fails.
    """
    user_to_create = user_schemas.UserCreate(
        name=user.name,
        emailAddress=user.emailAddress,
        password=user.password,
        role=user_schemas.Role.ADMIN,
        profilePhoto=user.profilePhoto,
        contactNumber=user.contactNumber,
    )
    db_user = user_services.create_user(db, user_to_create)

    if not db_user:
        return None

    db_admin = Admin(userID=db_user.userID, adminID=db_user.userID)

    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin


def update_admin(db: Session, updated_admin: admin_schemas.AdminUpdate):
    """Update an existing admin and associated user.

    Args:
        db (Session): Database session.
        updated_admin (AdminUpdate): Updated admin schema.

    Returns:
        Admin: The updated admin object, or None if not found.
    """
    db_user = db.query(User).filter(User.userID == updated_admin.userID).first()
    db_admin = db.query(Admin).filter(Admin.adminID == updated_admin.adminID).first()
    if not db_user or not db_admin:
        return None

    # Update User
    updated_user_data = updated_admin.model_dump(exclude_unset=True)
    for key, value in updated_user_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Update Admin
    updated_admin_data = updated_admin.model_dump(exclude_unset=True)
    for key, value in updated_admin_data.items():
        setattr(db_admin, key, value)

    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin
