import logging
from fastapi import APIRouter, HTTPException, Depends
from app.database.connection import db
from app.auth import authorize_user

router = APIRouter()

@router.get("/balance/{user_id}")
async def get_balance(user_id: str, auth_user_id: str = Depends(authorize_user)):
    try:
        # Ensure the user requesting the balance is the same as the user_id
        if user_id != auth_user_id:
            logging.warning(f"Unauthorized access attempt to balance for {user_id} by {auth_user_id}.")
            raise HTTPException(status_code=403, detail="Forbidden")

        # Find all expenses where the user is involved
        expenses = await db.expenses.find({"split_between." + user_id: {"$exists": True}}).to_list(length=100)
        
        # Calculate the outstanding balance
        balance = sum([expense["split_between"][user_id] - expense["paid_by"].get(user_id, 0) for expense in expenses])

        # Include any settlements in the calculation
        settlements_as_payer = await db.settlements.find({"payer_id": user_id}).to_list(length=100)
        settlements_as_payee = await db.settlements.find({"payee_id": user_id}).to_list(length=100)

        for settlement in settlements_as_payer:
            balance -= settlement["amount"]

        for settlement in settlements_as_payee:
            balance += settlement["amount"]

        logging.info(f"Balance retrieved for user {user_id}.")
        return {"user_id": user_id, "balance": balance}
    except Exception as e:
        logging.error(f"Error retrieving balance for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
