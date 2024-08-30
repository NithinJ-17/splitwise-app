from pydantic import BaseModel
from typing import List, Dict

class GroupExpense(BaseModel):
    expense_id: str
    description: str
    amount: float
    currency: str
    paid_by: Dict[str, float]  # { "user_id": amount_paid }
    split_between: Dict[str, float]  # { "user_id": amount_owed }

class Group(BaseModel):
    name: str
    members: List[str]  # List of user_ids
    expenses: List[GroupExpense] = []  # List of group expenses

