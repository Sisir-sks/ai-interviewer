# app/api/routes/auth.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.db import crud
from app.core.security import create_access_token

router = APIRouter(tags=["Auth"])   # ← Added tags here too (helps visibility)

class UserAuth(BaseModel):
    username: str
    password: str


@router.post("/register", summary="Register new user")
def register(data: UserAuth, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    crud.create_user(db, data.username, data.password)
    
    return {"message": "User registered successfully"}


@router.post("/login", summary="Login user")
def login(data: UserAuth, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, data.username, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }