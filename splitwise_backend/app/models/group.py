from pydantic import BaseModel
from typing import List

class Group(BaseModel):
    group_id: str
    name: str
    members: List[str]  # List of user_ids
