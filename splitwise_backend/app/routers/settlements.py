import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.settlement import Settlement
from app.database.connection import db
from app.auth import authorize_user
from app.utils import convert_currency
from datetime import datetime

router = APIRouter()

@router.post("/settlements")
async def create_settlement(settlement: Settlement, user_id: str = Depends(authorize_user)):
    try:
        # Ensure the payer is the one initiating the settlement
        existing_settlement = await db.settlements.find_one({"settlement_id": settlement.settlement_id})
        if existing_settlement:
            logging.warning(f"Duplicate transaction attempt: Settlement ID {settlement.settlement_id} already exists.")
            raise HTTPException(status_code=400, detail="Settlement with this ID already exists.")
        if settlement.payer_id != user_id:
            logging.warning(f"Unauthorized settlement creation attempt by {user_id} for payer {settlement.payer_id}.")
            raise HTTPException(status_code=403, detail="Unauthorized settlement attempt")
        
        # Convert the amount to the base currency (USD) if necessary
        if settlement.currency != "USD":  # Assuming USD is the base currency
            settlement.amount = await convert_currency(settlement.amount, settlement.currency, "USD")
            settlement.currency = "USD"
        
        # Record the settlement in the database
        settlement.timestamp = settlement.timestamp or datetime.utcnow()
        await db.settlements.insert_one(settlement.dict())

        # Update the balances of the payer and payee
        await db.balances.update_one(
            {"user_id": settlement.payer_id},
            {"$inc": {"balance": -settlement.amount}},
            upsert=True
        )
        await db.balances.update_one(
            {"user_id": settlement.payee_id},
            {"$inc": {"balance": settlement.amount}},
            upsert=True
        )

        logging.info(f"Settlement created between {settlement.payer_id} and {settlement.payee_id}.")
        return {"message": "Settlement recorded successfully"}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error creating settlement: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
