from pydantic import BaseModel, EmailStr

class UserMetadataCreate(BaseModel):
    occupation: str | None = None
    bio: str | None = None