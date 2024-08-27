from pydantic import BaseModel, Field
from typing import Dict, Optional

class Expense(BaseModel):
    expense_id: str
    description: str
    amount: float
    currency: str = Field(..., description="Currency code (e.g., USD, EUR, GBP, INR, BTC, ETH, SOL)")
    paid_by: Dict[str, float]  # Who paid and how much
    split_between: Dict[str, float]  # How the expense is split between users
    group_id: Optional[str] = None  # Optional group ID if the expense is within a group
