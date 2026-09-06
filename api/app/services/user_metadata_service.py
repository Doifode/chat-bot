from  sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user_metadata import UserMetadata
from app.models.user import User

def create_user_metadata(
        db:Session,
        user_id: str,
        bio:str | None = None,
        occupation:str | None = None
    ):
    # check user exists or not
    try: 
        user = db.get(User,user_id)
        if user is None:
            return None
    
        user_metadata = UserMetadata(
            user_id=user_id,
            bio=bio,
            occupation=occupation
        )
        
        db.add(user_metadata)
        db.commit()
        db.refresh(user_metadata)
        return user_metadata
    except IntegrityError:
        db.rollback()
        raise ValueError("Already exists")

    
    