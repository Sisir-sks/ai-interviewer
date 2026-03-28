from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.security import create_access_token

router = APIRouter()


# Dummy user (for now)
fake_user = {
    "username": "admin",
    "password": "admin123"
}


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest):
    if data.username != fake_user["username"] or data.password != fake_user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": data.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }