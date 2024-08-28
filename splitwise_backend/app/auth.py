import jwt
from datetime import datetime, timedelta
from fastapi import Header, HTTPException
from jwt import PyJWTError
from app.config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_DELTA
from app.database.connection import db  # Import your database connection
from app.models.session import UserSession  # Import the session model
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

        # Check if the token is part of the user's active sessions
        session = await db.sessions.find_one({"user_id": user_id, "session.token": x_token})
        if not session:
            logging.warning(f"Invalid or expired token for user {user_id}")
            raise HTTPException(status_code=401, detail="Invalid token")

        # Optionally, check for session expiration
        if session["session"]["expires_at"] < datetime.utcnow():
            logging.warning(f"Expired token for user {user_id}")
            raise HTTPException(status_code=401, detail="Token expired")

        return user_id
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except PyJWTError as e:
        logging.error(f"JWT verification failed: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")

async def logout_user(x_token: str = Header(...)):
    try:
        payload = jwt.decode(x_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Remove the session from the database
        await db.sessions.delete_one({"user_id": user_id, "session.token": x_token})
        logging.info(f"User {user_id} logged out successfully.")
        return {"message": "Logged out successfully"}
    except PyJWTError as e:
        logging.error(f"JWT verification failed: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
