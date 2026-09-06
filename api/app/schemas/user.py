from datetime import datetime
import uuid
from pydantic import BaseModel, ConfigDict, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
class UserRead(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    created_at: datetime    
    model_config= ConfigDict(from_attributes=True)