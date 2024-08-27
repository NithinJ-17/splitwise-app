import logging
from fastapi import FastAPI, Header, HTTPException, Depends
from app.routers import expenses, balances, users, settlements, groups  
from app.database.connection import db
from app.utils import verify_password, hash_password  # Import hash_password
from app.state import TOKENS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

app = FastAPI()

# Include routers
app.include_router(users.router)
app.include_router(expenses.router)
app.include_router(balances.router)
app.include_router(settlements.router)
app.include_router(groups.router)

async def seed_users():
    users = [
        {"user_id": "user1", "name": "Alice", "password": "password1"},
        {"user_id": "user2", "name": "Bob", "password": "password2"},
        {"user_id": "user3", "name": "Charlie", "password": "password3"},
        {"user_id": "user4", "name": "David", "password": "password4"},
        {"user_id": "user5", "name": "Eve", "password": "password5"},
    ]
    existing_users = await db.users.count_documents({})
    if existing_users == 0:
        # Hash passwords before inserting
        for user in users:
            user["password"] = hash_password(user["password"])
        await db.users.insert_many(users)
        logging.info("Initial users seeded into the database with hashed passwords.")

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
