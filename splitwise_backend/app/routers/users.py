import uuid  # Import UUID for generating unique user IDs
from datetime import datetime
import logging
from fastapi import APIRouter, HTTPException, Depends, Header
from jwt import PyJWTError
import jwt
from app.models.user_signup import UserSignup
from app.database.connection import db
from app.utils import hash_password, verify_password
from app.state import TOKENS
from app.models.user_login import UserLogin
from app.auth import create_access_token
from app.config import JWT_ALGORITHM, JWT_EXPIRATION_DELTA, JWT_SECRET
from app.models.session import UserSession

router = APIRouter()

@router.post("/signup")
async def signup(user: UserSignup):
    try:
        # Check for duplicate email
        existing_email = await db.users.find_one({"email": user.email})
        if existing_email:
            logging.warning(f"Signup attempt with existing email: {user.email}")
            raise HTTPException(status_code=400, detail="Email already in use")
        
        # Generate a unique user ID
        user_id = str(uuid.uuid4())
        
        hashed_password = hash_password(user.password)
        new_user = {
            "user_id": user_id,  # Assign the generated user ID
            "name": user.name,
            "email": user.email,
            "password": hashed_password
        }
        await db.users.insert_one(new_user)
        logging.info(f"New user {user_id} created successfully with email {user.email}.")
        return {"message": "User created successfully"}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error during signup for user with email {user.email}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/login")
async def login(login_data: UserLogin):
    try:
        # Retrieve user by email from the database
        user = await db.users.find_one({"email": login_data.email})
        if not user or not verify_password(login_data.password, user["password"]):
            logging.warning(f"Failed login attempt for email: {login_data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Generate a new JWT token
        token = create_access_token(user_id=user["user_id"])
        name = user['name']

        # Calculate expiration time (e.g., 1 hour from now)
        expiration_time = datetime.utcnow() + JWT_EXPIRATION_DELTA

        # Store the session in the database
        session = UserSession(token=token, created_at=datetime.utcnow(), expires_at=expiration_time)
        await db.sessions.insert_one({"user_id": user["user_id"], "session": session.dict()})

        logging.info(f"User {user['user_id']} logged in successfully.")
        return {"user":name , "token": token}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error during login for email {login_data.email}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.post("/logout")
async def logout(x_token: str = Header(...)):
    try:
        # Decode the JWT token
        payload = jwt.decode(x_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            logging.warning("Logout attempt with invalid credentials.")
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Remove the session from the database
        delete_result = await db.sessions.delete_one({"user_id": user_id, "session.token": x_token})
        if delete_result.deleted_count == 0:
            logging.warning(f"Logout attempt with invalid token for user_id: {user_id}")
            raise HTTPException(status_code=401, detail="Invalid token")

        logging.info(f"User {user_id} logged out successfully.")
        return {"message": "Logged out successfully"}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except PyJWTError as e:
        logging.error(f"JWT verification failed during logout: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    except Exception as e:
        logging.error(f"Error during logout: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/user_id")
async def get_user_id(x_token: str = Header(...)):
    try:
        # Decode the JWT token
        payload = jwt.decode(x_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            logging.warning("Attempt to retrieve user_id with invalid credentials.")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Optionally, you can also verify if the session is active by checking the database
        session = await db.sessions.find_one({"user_id": user_id, "session.token": x_token})
        if not session:
            logging.warning(f"Invalid or expired token for user {user_id}")
            raise HTTPException(status_code=401, detail="Invalid token or session expired")
        
        logging.info(f"User ID {user_id} retrieved successfully.")
        return {"user_id": user_id}
    except PyJWTError as e:
        logging.error(f"JWT verification failed: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    except Exception as e:
        logging.error(f"Error retrieving user_id: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/user_id_by_email")
async def get_user_id_by_email(email: str):
    try:
        # Fetch the user by email from the database
        user = await db.users.find_one({"email": email})
        if not user:
            logging.warning(f"User with email {email} not found.")
            raise HTTPException(status_code=404, detail="User not found")

        logging.info(f"User ID {user['user_id']} retrieved successfully for email {email}.")
        return {"user_id": user["user_id"]}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error retrieving user ID for email {email}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")