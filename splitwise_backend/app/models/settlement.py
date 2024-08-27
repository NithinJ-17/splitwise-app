from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Settlement(BaseModel):
    settlement_id: str
    payer_id: str
    payee_id: str
    amount: float
    currency: str = Field(..., description="Currency code (e.g., USD, EUR, GBP, INR, BTC, ETH, SOL)")
    timestamp: Optional[datetime] = None
