import uuid
from sqlalchemy import DateTime , ForeignKey, String,Text
from sqlalchemy.orm import mapped_column,Mapped,relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime


from app.db.base import Base

class Message(Base):
    
    __tablename__="messages"
    
    id:Mapped[uuid.UUID]= mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    chat_id:Mapped[uuid.UUID]=mapped_column(
     UUID(as_uuid=True),
     ForeignKey("chats.id"),
     nullable=False
    )
    role:Mapped[str]=mapped_column(
        String(20),
        nullable=False,
    )
    content:Mapped[str]=mapped_column(
        Text,
        nullable=False
    )
    created_at:Mapped[datetime] =mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )
    
    chat:Mapped["Chat"] = relationship(back_populates="messages")