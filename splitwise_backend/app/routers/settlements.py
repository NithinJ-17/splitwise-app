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
        if settlement.payer_id != user_id:
            logging.warning(f"Unauthorized settlement creation attempt by {user_id} for payer {settlement.payer_id}.")
            raise HTTPException(status_code=403, detail="Unauthorized settlement attempt")
        
        # Convert the amount to the base currency (USD) if necessary
        if settlement.currency != "USD":  # Assuming USD is the base currency
            settlement.amount = await convert_currency(settlement.amount, settlement.currency, "USD")
            settlement.currency = "USD"
        
        settlement.timestamp = settlement.timestamp or datetime.utcnow()
        await db.settlements.insert_one(settlement.dict())
        logging.info(f"Settlement created between {settlement.payer_id} and {settlement.payee_id}.")
        return {"message": "Settlement recorded successfully"}
    except Exception as e:
        logging.error(f"Error creating settlement: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
