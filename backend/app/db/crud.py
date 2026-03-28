from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password


# =========================
# 🧑 USER CRUD OPERATIONS
# =========================

# 🔍 Get user by username
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


# 📝 Create new user
def create_user(db: Session, username: str, password: str):
    hashed_password = hash_password(password)

    new_user = User(
        username=username,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# 🔐 Authenticate user
def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user


# 🗑️ Delete user
def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return False

    db.delete(user)
    db.commit()
    return True


# 📋 Get all users (admin purpose)
def get_all_users(db: Session):
    return db.query(User).all()