import os 
from datetime import datetime,timedelta,timezone
import bcrypt
import jwt
import dotenv
dotenv.load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24  # 1 day



def verify_password (plain_password:str,hashed_password:str)->bool:
    return bcrypt.checkpw(plain_password.encode(),hashed_password.encode())

def create_access_token(user_id)->str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)