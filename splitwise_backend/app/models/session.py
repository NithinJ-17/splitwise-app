from pydantic import BaseModel
from datetime import datetime

class UserSession(BaseModel):
    token: str
    created_at: datetime
    expires_at: datetime