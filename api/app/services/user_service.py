from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from  app.models.user import User
import bcrypt

def create_user( 
    db:Session,
    name:str,
    email:str,
    password:str
):
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user= User(
        name=name,
        email=email,
        hashed_password=hashed
    )
    
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise ValueError("Email already registered")
