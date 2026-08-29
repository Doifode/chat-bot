import uuid
from sqlalchemy import DateTime , ForeignKey, String
from sqlalchemy.orm import mapped_column,Mapped,relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime


from app.db.base import Base

class Chat(Base):
    __tablename__ = "chats"
    
    id:Mapped[uuid.UUID]= mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )
    
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )
     
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
    
    user : Mapped["User"] = relationship(
        back_populates="chats"
    )
    
    messages:Mapped[list["Message"]]= relationship(
        back_populates="chat"
    )