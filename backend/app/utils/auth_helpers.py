import bcrypt
import jwt
from datetime import datetime, timedelta
from app.config import settings

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str, email: str) -> str:
    return jwt.encode(
        {"sub": user_id, "email": email,
         "iat": datetime.utcnow(),
         "exp": datetime.utcnow() + timedelta(days=30)},
        settings.jwt_secret, algorithm=settings.jwt_algorithm,
    )

def get_user_id(token: str) -> str:
    if token.startswith("Bearer "):
        token = token[7:]
    payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    return payload["sub"]
