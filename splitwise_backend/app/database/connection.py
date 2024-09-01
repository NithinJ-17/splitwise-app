from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    mongo_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")

settings = Settings()

client = AsyncIOMotorClient(settings.mongo_url)
db = client.splitwise
