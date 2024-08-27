import jwt
from datetime import datetime, timedelta
from fastapi import Header, HTTPException, Security
from jwt import PyJWTError
from app.config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_DELTA
from app.state import TOKENS  # Optional: to keep track of tokens
import logging

def create_access_token(*, user_id: str):
    expire = datetime.utcnow() + JWT_EXPIRATION_DELTA
    to_encode = {"exp": expire, "sub": user_id}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def authorize_user(x_token: str = Header(...)):
    try:
        payload = jwt.decode(x_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return user_id
    except PyJWTError as e:
        logging.error(f"JWT verification failed: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
