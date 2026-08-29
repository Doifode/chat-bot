from datetime import datetime
import uuid
from pydantic import BaseModel,ConfigDict

class MessageCreate(BaseModel):
    content:str
    
    
class MessageRead(BaseModel):
    id:uuid.UUID
    role:str 
    content:str
    created_at:datetime
    model_config=ConfigDict(from_attributes=True)
    