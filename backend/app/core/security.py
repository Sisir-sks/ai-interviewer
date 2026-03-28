# app/core/security.py

from datetime import datetime, timedelta
from typing import Any

from jose import jwt, JWTError
from passlib.context import CryptContext

# ==================== CONFIGURATION ====================
SECRET_KEY = "your-super-secret-key-change-this-in-production"  # ← MUST change!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60          # 1 hour
REFRESH_TOKEN_EXPIRE_DAYS = 7             # 7 days (optional but recommended)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ==================== PASSWORD UTILITIES ====================
def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed one."""
    return pwd_context.verify(plain_password, hashed_password)


# ==================== JWT TOKEN UTILITIES ====================
def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    """
    Create JWT access token.
    `subject` is usually the user id or email.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": str(subject),      # subject (user identifier)
        "exp": expire,
        "type": "access",         # helps distinguish token types
    }
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(subject: str | Any) -> str:
    """Create a longer-lived refresh token (optional but recommended)."""
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "sub": str(subject),
        "exp": expire,
        "type": "refresh",
    }
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Decode and validate JWT token. Returns payload or None if invalid/expired."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user_id(token: str) -> int | None:
    """Extract user id from token (commonly used in dependencies)."""
    payload = decode_access_token(token)
    if payload and payload.get("sub"):
        try:
            return int(payload.get("sub"))
        except (TypeError, ValueError):
            return None
    return None