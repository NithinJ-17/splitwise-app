import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.user_signup import UserSignup
from app.database.connection import db
from app.utils import hash_password, verify_password
from app.state import TOKENS
from app.models.user_login import UserLogin
from app.auth import create_access_token

router = APIRouter()

@router.post("/signup")
async def signup(user: UserSignup):
    try:
        existing_user = await db.users.find_one({"user_id": user.user_id})
        if existing_user:
            logging.warning(f"Signup attempt with existing user_id: {user.user_id}")
            raise HTTPException(status_code=400, detail="User ID already exists")
        
        hashed_password = hash_password(user.password)
        new_user = {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "password": hashed_password
        }
        await db.users.insert_one(new_user)
        logging.info(f"New user {user.user_id} created successfully.")
        return {"message": "User created successfully"}
    except Exception as e:
        logging.error(f"Error during signup for user {user.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/login")
@router.post("/login")
async def login(login_data: UserLogin):
    try:
        user = await db.users.find_one({"user_id": login_data.user_id})
        if not user or not verify_password(login_data.password, user["password"]):
            logging.warning(f"Failed login attempt for user_id: {login_data.user_id}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token = create_access_token(user_id=login_data.user_id)
        logging.info(f"User {login_data.user_id} logged in successfully.")
        return {"token": token}
    except Exception as e:
        logging.error(f"Error during login for user {login_data.user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")