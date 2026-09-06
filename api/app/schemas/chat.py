import uuid
from pydantic import BaseModel,ConfigDict 
from datetime import datetime



class ChatCreate (BaseModel):
    title:str |None = None
    
    
class ChatRead (BaseModel):
    id:uuid.UUID
    title:str|None
    created_at:datetime
    model_config = ConfigDict(from_attributes=True)
    