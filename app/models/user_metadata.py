import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column,relationship

from app.db.base import Base   


class UserMetadata(Base):
    __tablename__ = "user_metadata"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True
    )
    bio: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )
    
    occupation: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )
    
    user: Mapped["User"] = relationship(
        back_populates="user_metadata"
    )