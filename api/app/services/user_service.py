from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from  app.models.user import User

def create_user( 
    db:Session,
    name:str,
    email:str 
):
    user= User(
        name=name,
        email=email
    )
    
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise ValueError("Email already registered")
    