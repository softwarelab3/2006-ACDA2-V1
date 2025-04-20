from sqlalchemy.orm import Session

import services.user as user_services
import schemas.consumer as consumer_schemas
import schemas.user as user_schemas
from models.consumer import Consumer
from models.user import User


def convert_favorite_stalls_to_list(favorite_stalls):
    """Convert favorite stalls from string format to list of integers.

    Args:
        favorite_stalls (str or None): String of comma-separated stall IDs or None.
    Returns:
        list: List of integers representing stall IDs.
    """
    if favorite_stalls and isinstance(favorite_stalls, str):
        return [int(id.strip()) for id in favorite_stalls.split(",") if id.strip()]
    return [] if favorite_stalls is None else favorite_stalls


def convert_favorite_stalls_to_string(favorite_stalls):
    """Convert favorite stalls from list format to string.

    Args:
        favorite_stalls (list or None): List of stall IDs or None.
    Returns:
        str: Comma-separated string of stall IDs.
    """
    if favorite_stalls and isinstance(favorite_stalls, list):
        return ", ".join(str(stall_id) for stall_id in favorite_stalls)
    return favorite_stalls


def get_consumer_by_user_id(db: Session, userID: int):
    """Retrieve a consumer by their user ID.

    Args:
        db (Session): Database session.
        userID (int): User ID of the consumer.
    Returns:
        Consumer: The consumer object, or None if not found.
    """
    consumer = db.query(Consumer).filter(Consumer.userID == userID).first()
    if consumer is None:
        return None

    # consumer.favoriteStalls = convert_favorite_stalls_to_list(consumer.favoriteStalls)
    return consumer


def get_consumer_by_consumer_id(db: Session, consumerID: int):
    """Retrieve a consumer by their consumer ID.

    Args:
        db (Session): Database session.
        consumerID (int): Consumer ID.
    Returns:
        Consumer: The consumer object, or None if not found.
    """
    consumer = db.query(Consumer).filter(Consumer.consumerID == consumerID).first()
    if consumer is None:
        return None

    # consumer.favoriteStalls = convert_favorite_stalls_to_list(consumer.favoriteStalls)
    return consumer


def get_all_consumers(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve all consumers with pagination.

    Args:
        db (Session): Database session.
        skip (int): Number of records to skip.
        limit (int): Maximum number of records to return.
    Returns:
        list: List of consumers, or None if none found.
    """
    consumers = db.query(Consumer).offset(skip).limit(limit).all()
    if consumers is None:
        return None
    # for consumer in consumers:
    #     consumer.favoriteStalls = convert_favorite_stalls_to_list(consumer.favoriteStalls)
    return consumers


def create_consumer(db: Session, user: consumer_schemas.ConsumerCreate):
    """Create a new consumer and associated user.

    Args:
        db (Session): Database session.
        user (ConsumerCreate): Consumer creation schema.
    Returns:
        Consumer: The created consumer object, or None if user creation fails.
    """
    user_to_create = user_schemas.UserCreate(
        name=user.name,
        emailAddress=user.emailAddress,
        password=user.password,
        role=user_schemas.Role.CONSUMER,
        profilePhoto=user.profilePhoto,
        contactNumber=user.contactNumber,
    )
    db_user = user_services.create_user(db, user_to_create)

    if not db_user:
        return None

    # favorite_stalls_str = convert_favorite_stalls_to_string(user.favoriteStalls)

    db_consumer = Consumer(
        userID=db_user.userID,
        consumerID=db_user.userID,
        address=user.address,
        dietaryPreference=user.dietaryPreference,
        preferredCuisine=user.preferredCuisine,
        ambulatoryStatus=user.ambulatoryStatus,
        # favoriteStalls=favorite_stalls_str,
    )

    db.add(db_consumer)
    db.commit()
    db.refresh(db_consumer)

    # db_consumer.favoriteStalls = convert_favorite_stalls_to_list(db_consumer.favoriteStalls)
    return db_consumer


def update_consumer(db: Session, updated_consumer: consumer_schemas.ConsumerUpdate):
    """Update an existing consumer and associated user.

    Args:
        db (Session): Database session.
        updated_consumer (ConsumerUpdate): Updated consumer schema.
    Returns:
        Consumer: The updated consumer object, or None if not found.
    """
    db_user = db.query(User).filter(User.userID == updated_consumer.userID).first()
    db_consumer = (
        db.query(Consumer)
        .filter(Consumer.consumerID == updated_consumer.consumerID)
        .first()
    )
    if not db_user or not db_consumer:
        return None

    # Update User
    updated_user_data = updated_consumer.model_dump(exclude_unset=True)
    for key, value in updated_user_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Update Consumer
    updated_consumer_data = updated_consumer.model_dump(exclude_unset=True)

    # if "favoriteStalls" in updated_consumer_data:
    #     updated_consumer_data["favoriteStalls"] = convert_favorite_stalls_to_string(
    #         updated_consumer_data["favoriteStalls"]
    #     )

    for key, value in updated_consumer_data.items():
        setattr(db_consumer, key, value)

    db.add(db_consumer)
    db.commit()
    db.refresh(db_consumer)

    # db_consumer.favoriteStalls = convert_favorite_stalls_to_list(db_consumer.favoriteStalls)
    return db_consumer
