import uuid
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.chat import ChatCreate,ChatRead
from app.schemas.message import MessageCreate,MessageRead
from app.services.chat_service import create_chat,post_message,get_chat_messages



router = APIRouter(prefix="/chats",tags=["Chats"])


@router.post("/",response_model=ChatRead,status_code=201)
def create_chat_route(chat:ChatCreate,db:Session= Depends(get_db)):
    try:
        return create_chat(db, chat.user_id, chat.title)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


        
@router.get("/{chat_id}/messages",response_model=list[MessageRead] ,status_code=200)
def get_chat_messages_route(chat_id:uuid.UUID,db:Session=Depends(get_db)):
    try:
        return get_chat_messages(db=db,chat_id=chat_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{chat_id}/messages",response_model=MessageRead,status_code=201)
def create_chat_message_route(chat_id:uuid.UUID, message:MessageCreate,db:Session=Depends(get_db)):
    try:
        return post_message(db,chat_id=chat_id,content=message.content)
    except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
