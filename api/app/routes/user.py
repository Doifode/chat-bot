import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.user_service import create_user
from app.schemas.user import UserCreate,UserRead
from app.models import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/",response_model=UserRead)
def create_user_route(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_user(
            db=db,
            name=user_data.name,
            email=user_data.email,
            password=user_data.password
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
            )

@router.get("/{user_id}")
def get_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    print(user.user_metadata)

    return {
        "id": str(user.id),
        "name": user.name,
        "user_metadata": {
            "bio": user.user_metadata.bio if user.user_metadata else None,
            "occupation": user.user_metadata.occupation if user.user_metadata else None,
        }
    }

    
@router.get("/{user_id}/chats")
def get_user_chats(
    user_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    print(user.chats)

    return [
        {
            "id": str(chat.id),
            "title": chat.title
        }
        for chat in user.chats
    ]