import logging
import uuid
from fastapi import FastAPI, Header, HTTPException, Depends
from app.routers import expenses, balances, users, settlements, groups  
from app.database.connection import db
from app.utils import verify_password, hash_password
from app.state import TOKENS
from fastapi.middleware.cors import CORSMiddleware
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

# Example of logging an event


allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(users.router)
app.include_router(expenses.router)
app.include_router(balances.router)
app.include_router(settlements.router)
app.include_router(groups.router)

async def generate_readable_name(index):
    # Generate a readable username like "User1", "User2", etc.
    return f"User{index}"

async def generate_password():
    # Generate a simple password or use a more complex generator
    return str(uuid.uuid4())[:8]  # Shortened UUID as a simple password example

async def seed_users():
    users = []
    for i in range(1, 6):  # Creating 5 users
        user_id = str(uuid.uuid4())  # Generate a unique user_id
        name = await generate_readable_name(i)
        password = hash_password(await generate_password())  # Hash the generated password
        users.append({"user_id": user_id, "name": name, "password": password})
    
    existing_users = await db.users.count_documents({})
    if existing_users < 5:
        await db.users.insert_many(users)
        logging.info("Initial users seeded into the database with generated user IDs, names, and hashed passwords.")

@app.on_event("startup")
async def startup_event():
    logging.info("Application startup initiated.")
    await seed_users()
    logging.info("Application startup completed.")

@app.get("/db_health")
async def health_check():
    try:
        # Attempt to list collections as a simple check
        collections = await db.list_collection_names()
        return {"status": "ok", "collections": collections}
    except Exception as e:
        logging.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")
