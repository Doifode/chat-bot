import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.user_metadata_service import create_user_metadata
from sqlalchemy.exc import IntegrityError

from app.db.database import get_db
from app.schemas.user_metadata import UserMetadataCreate


router = APIRouter(
    prefix="/users",
    tags=["User Metadata"]
)

@router.post("/{user_id}/metadata")
def create_user_metadata_route(
    user_metadata: UserMetadataCreate,
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    try: 
        user_metadata = create_user_metadata(
        db,
        user_id,
        user_metadata.bio,
        user_metadata.occupation
        )
        if user_metadata is None :
            return HTTPException(
            detail="User Not Found",
            status_code=404
            )
        return user_metadata
    except IntegrityError:
        raise HTTPException(
        status_code=409,
        detail="Metadata already exists") 