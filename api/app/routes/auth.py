from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import LoginRequest,TokenResponse
from app.models.user import User
from app.core.security import verify_password, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
    )

@router.post("/login",response_model=TokenResponse)
def login_route(data:LoginRequest,db:Session=Depends(get_db)):
    user_by_email = db.query(User).filter(User.email == data.email).first()
    
    if not user_by_email:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(data.password, user_by_email.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(user_by_email.id)
    return TokenResponse(access_token=access_token, token_type="bearer")
