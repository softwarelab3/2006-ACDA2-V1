from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from models.likeStall import LikeStall
from models.stall import Stall


def like_stall(db: Session, userID: int, stallID: int):
    """Like a stall for a user.

    Args:
        db (Session): Database session.
        userID (int): User ID.
        stallID (int): Stall ID.
    Raises:
        HTTPException: If the stall is not found or already liked by the user.
    Returns:
        LikeStall: The like record object.
    """
    # Check if the stall exists
    stall = db.query(Stall).filter(Stall.stallID == stallID).first()
    if not stall:
        raise HTTPException(status_code=404, detail="Stall not found")

    # Create the like relationship
    try:
        db_like = LikeStall(userID=userID, stallID=stallID)
        db.add(db_like)
        db.commit()
        db.refresh(db_like)
        return db_like
    except IntegrityError:
        db.rollback()
        # If the user has already liked this stall
        raise HTTPException(status_code=400, detail="User has already liked this stall")


def unlike_stall(db: Session, userID: int, stallID: int):
    """Remove a like from a stall for a user.

    Args:
        db (Session): Database session.
        userID (int): User ID.
        stallID (int): Stall ID.
    Raises:
        HTTPException: If the like relationship is not found.
    Returns:
        dict: Success message.
    """
    # Find and delete the like relationship
    db_like = (
        db.query(LikeStall)
        .filter(LikeStall.userID == userID, LikeStall.stallID == stallID)
        .first()
    )

    if not db_like:
        raise HTTPException(status_code=404, detail="Like relationship not found")

    db.delete(db_like)
    db.commit()
    return {"success": True, "message": "Stall unliked successfully"}


def get_liked_stalls(db: Session, userID: int):
    """Get all stalls liked by a user.

    Args:
        db (Session): Database session.
        userID (int): User ID.
    Returns:
        list: List of LikeStall objects liked by the user.
    """
    # Get all stalls liked by this user
    liked_stalls = db.query(LikeStall).filter(LikeStall.userID == userID).all()
    return liked_stalls
