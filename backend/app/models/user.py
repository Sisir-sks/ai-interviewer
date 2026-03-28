# app/models/user.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index
from sqlalchemy.sql import func
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Better to use email as the main unique identifier for auth
    email = Column(String(255), unique=True, nullable=False, index=True)
    
    # Keep username if you want users to have a display name
    username = Column(String(100), unique=True, nullable=True, index=True)
    
    # NEVER store plain password! Always store hashed version
    hashed_password = Column(String(255), nullable=False)
    
    # Useful fields for a real application
    full_name = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)   # for email verification
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Optional: Add composite index for better query performance
    __table_args__ = (
        Index("ix_users_email_active", "email", "is_active"),
    )

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"