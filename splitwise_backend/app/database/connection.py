from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

# Load environment variables from the .env file
load_dotenv()

class Settings(BaseModel):
    mongo_url: str = os.getenv("MONGO_URL", "default_fallback_value")

settings = Settings()

client = AsyncIOMotorClient(settings.mongo_url)
db = client.splitwise
