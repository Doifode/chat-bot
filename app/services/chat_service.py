import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.message import Message
from app.models.chat import Chat
from app.services.llm import generate_reply
from app.models.user import User


def create_chat(db:Session ,user_id:uuid.UUID,title:str)->Chat:
    # check user exits or not
    
    if db.get(User,user_id) is None:
        raise ValueError("User not found")
    
    chat = Chat(user_id=user_id,title=title or "New Chat")
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def get_chat_messages(db:Session,chat_id:uuid.UUID)->list[Message]:
    if db.get(Chat,chat_id) is None:
        raise ValueError("Chat not found")
    stmt = select(Message).where(Message.chat_id==chat_id).order_by(Message.created_at)
    return db.scalars(stmt).all()

def post_message(db:Session,chat_id:uuid.UUID,content:str)->Message:
    if db.get(Chat,chat_id) is None:
        raise ValueError("Chat not found") 
    
    user_msg = Message(chat_id=chat_id,role="user",content=content)
    db.add(user_msg)
    db.flush()
    stmt = select(Message).where(Message.chat_id==chat_id).order_by(Message.created_at)
    history = db.scalars(stmt).all()
    # convert to role content format
    
    history_dicts = [{"role": m.role, "content": m.content} for m in history]
    reply_text = generate_reply(history_dicts)
    
    assistant_message = Message(chat_id=chat_id,role="assistant",content= reply_text)
    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)
    return assistant_message
    