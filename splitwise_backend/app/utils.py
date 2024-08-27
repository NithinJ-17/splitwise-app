from passlib.context import CryptContext
from typing import Dict
from bson import ObjectId

def expense_to_json(expense):
    if "_id" in expense:
        expense["_id"] = str(expense["_id"])
    return expense

def group_to_json(group):
    if "_id" in group:
        group["_id"] = str(group["_id"])
    return group

# Example conversion rates (these would be dynamic in a real-world application)
conversion_rates: Dict[str, float] = {
    "USD": 1.0,    # Base currency
    "EUR": 0.85,
    "GBP": 0.75,
    "JPY": 110.0,
    "INR": 73.0,
    "BTC": 0.000023,  # Example rates for demonstration
    "ETH": 0.00033,
    "SOL": 0.024,
}

async def convert_currency(amount: float, from_currency: str, to_currency: str) -> float:
    if from_currency not in conversion_rates or to_currency not in conversion_rates:
        raise ValueError("Unsupported currency")
    
    # Convert from the base currency (USD) to the target currency
    amount_in_usd = amount / conversion_rates[from_currency]  # Convert to USD first
    converted_amount = amount_in_usd * conversion_rates[to_currency]  # Convert to the target currency
    return converted_amount

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
