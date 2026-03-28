from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.security import create_access_token, hash_password, verify_password
from app.db.database import SessionLocal
from app.models.user import User

router = APIRouter()


# 📦 SCHEMA
class UserAuth(BaseModel):
    username: str
    password: str


# 🔌 DB DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 📝 REGISTER
@router.post("/register")
def register(data: UserAuth, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=data.username,
        password=hash_password(data.password)
    )

    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}


# 🔐 LOGIN
@router.post("/login")
def login(data: UserAuth, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }