from passlib.context import CryptContext
from typing import Dict
from bson import ObjectId
import requests
import logging
from dotenv import load_dotenv
import os
from app.database.connection import db  # Assuming MongoDB for caching
# Load environment variables from .env file


load_dotenv()

FIAT_API_URL = os.getenv("FIAT_EXCHANGE_RATE_API_URL")  # e.g., https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD
FIAT_API_KEY = os.getenv("FIAT_EXCHANGE_RATE_API_KEY")

CRYPTO_API_URL = os.getenv("CRYPTO_EXCHANGE_RATE_API_URL")

def expense_to_json(expense):
    if "_id" in expense and isinstance(expense["_id"], ObjectId):
        expense["_id"] = str(expense["_id"])
    if "paid_by" in expense:
        expense["paid_by"] = {k: v for k, v in expense["paid_by"].items()}
    if "split_between" in expense:
        expense["split_between"] = {k: v for k, v in expense["split_between"].items()}
    return expense

def group_to_json(group):
    if "_id" in group and isinstance(group["_id"], ObjectId):
        group["_id"] = str(group["_id"])
    if "expenses" in group:
        group["expenses"] = [expense_to_json(expense) for expense in group["expenses"]]
    return group

# Example conversion rates (these would be dynamic in a real-world application)


# Example API key and endpoint (replace with your actual API key and endpoint)
# Modify this function to fetch real-time exchange rates
async def get_fiat_exchange_rates():
    try:
        response = requests.get(f"{FIAT_API_URL}")
        response.raise_for_status()
        rates = response.json().get("conversion_rates", {})
        return rates
    except Exception as e:
        logging.error(f"Failed to fetch fiat exchange rates: {e}")
        raise

async def get_crypto_exchange_rates():
    try:
        response = requests.get(f"{CRYPTO_API_URL}")
        response.raise_for_status()
        rates = response.json().get("rates", {})
        return rates
    except Exception as e:
        logging.error(f"Failed to fetch crypto exchange rates: {e}")
        raise

async def convert_currency(amount: float, from_currency: str, to_currency: str) -> float:
    # Check if rates are already cached in the database

    cached_rates = await db.exchange_rates.find_one({"currency_pair": f"{from_currency}_{to_currency}"})
    if cached_rates:
        return amount * cached_rates["rate"]

    # Attempt to fetch fiat rates first
    try:
        rates = await get_fiat_exchange_rates()
        logging.info("FIAT CURRENCY RATES :"+ str(rates))
        if from_currency == "USD" and to_currency in rates:
            # Store the rate in the database for caching
            rate = rates[to_currency]
            await db.exchange_rates.insert_one({"currency_pair": f"{from_currency}_{to_currency}", "rate": rate})
            return amount * rate
        elif to_currency == "USD" and from_currency in rates:
            logging.info("Rates {from_currency} :"+str(rates[from_currency]))
            rate = 1 / rates[from_currency]
            logging.info("Rates {from_currency} :"+str(rate))
            await db.exchange_rates.insert_one({"currency_pair": f"{from_currency}_{to_currency}", "rate": rate})
            return amount * rate
    except Exception as e:
        logging.warning(f"Fiat currency conversion failed: {e}")

    # Fallback to crypto rates if fiat rates are not available
    try:
        rates = await get_crypto_exchange_rates()
        logging.info("CRYPTO CURRENCY RATES :"+ str(rates))
        if from_currency == "USD" and to_currency in rates:
            # Store the rate in the database for caching
            rate = rates[to_currency]
            await db.exchange_rates.insert_one({"currency_pair": f"{from_currency}_{to_currency}", "rate": rate})
            return amount * rate
        elif to_currency == "USD" and from_currency in rates:
            logging.info("Rates {from_currency} :"+str(rates[from_currency]))
            rate = rates[from_currency]
            logging.info("Rates {from_currency} :"+str(rate))
            await db.exchange_rates.insert_one({"currency_pair": f"{from_currency}_{to_currency}", "rate": rate})
            return amount * rate
        else:
            raise ValueError(f"Unsupported currency pair: {from_currency} to {to_currency}")
    except Exception as e:
        logging.error(f"Crypto currency conversion failed: {e}")
        raise ValueError(f"Failed to convert {from_currency} to {to_currency}")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
