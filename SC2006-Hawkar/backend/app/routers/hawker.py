from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from controllers.user import UserController
from controllers.hawker import HawkerController
import schemas.hawker as hawker_schemas
import schemas.stall as stall_schemas

router = APIRouter()

tags_metadata = [
    {
        "name": "Hawker Controller",
        "description": "API Endpoints for methods implemented by the Hawker Controller",
    },
    {"name": "Hawker (CRUD)", "description": "API CRUD Endpoints for Hawker Model"},
]


# ------------------------------------------------------------ #
# -------------------- Hawker (CRUD) ------------------------- #
# ------------------------------------------------------------ #
@router.post(
    "/hawker-controller/add-hawker",
    response_model=hawker_schemas.Hawker,
    tags=["Hawker (CRUD)"],
)
def add_hawker(hawker: hawker_schemas.HawkerCreate, db: Session = Depends(get_db)):
    """Add a new hawker to the system.

    Args:
        hawker (HawkerCreate): Hawker creation schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        Hawker: The created hawker object.
    """
    return HawkerController.addHawker(db, hawker)


@router.get("/hawkers/public", tags=["Hawker (CRUD)"])
async def getAllPublicHawkers():
    """Get all public hawker locations.

    Returns:
        list: List of public hawker locations.
    Raises:
        HTTPException: If no public hawkers are found.
    """
    hawkersLocation = UserController.getAllPublicHawkers()
    if hawkersLocation is None:
        raise HTTPException(status_code=404, detail="Public Hawkers not found")
    return hawkersLocation


@router.get(
    "/hawkers", response_model=list[hawker_schemas.Hawker], tags=["Hawker (CRUD)"]
)
def get_all_hawkers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all hawkers with pagination.

    Args:
        skip (int, optional): Number of records to skip.
        limit (int, optional): Maximum number of records to return.
        db (Session, optional): Database session dependency.
    Returns:
        list: List of hawker objects.
    """
    return HawkerController.getAllHawkers(db, skip, limit)


@router.get(
    "/hawker/{hawker_id}", response_model=hawker_schemas.Hawker, tags=["Hawker (CRUD)"]
)
async def get_hawker_by_hawker_id(hawker_id: str, db: Session = Depends(get_db)):
    """Get a hawker by their hawker ID.

    Args:
        hawker_id (str): Hawker ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        Hawker: The hawker object.
    """
    return HawkerController.getHawkerByHawkerId(db, hawker_id)


@router.get(
    "/hawker/userid/{user_id}",
    response_model=hawker_schemas.Hawker,
    tags=["Hawker (CRUD)"],
)
async def get_hawker_by_user_id(user_id: str, db: Session = Depends(get_db)):
    """Get a hawker by their user ID.

    Args:
        user_id (str): User ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        Hawker: The hawker object.
    """
    return HawkerController.getHawkerByUserId(db, user_id)


@router.put(
    "/hawker/update", response_model=hawker_schemas.Hawker, tags=["Hawker (CRUD)"]
)
def update_hawker(hawker: hawker_schemas.HawkerUpdate, db: Session = Depends(get_db)):
    """Update an existing hawker's information.

    Args:
        hawker (HawkerUpdate): Updated hawker schema from request body.
        db (Session, optional): Database session dependency.
    Returns:
        Hawker: The updated hawker object.
    """
    return HawkerController.updateHawker(db, hawker)


@router.delete("/hawker/delete/{hawker_id}", tags=["Hawker (CRUD)"])
def delete_hawker(hawker_id: int, db: Session = Depends(get_db)):
    """Delete a hawker by their ID.

    Args:
        hawker_id (int): Hawker ID from the path.
        db (Session, optional): Database session dependency.
    Returns:
        dict: Success message if deleted.
    Raises:
        HTTPException: If the hawker is not found.
    """
    result = HawkerController.deleteHawker(db, hawker_id)
    if not result:
        raise HTTPException(status_code=404, detail="Hawker not found")
    return {"detail": "Hawker deleted successfully"}
