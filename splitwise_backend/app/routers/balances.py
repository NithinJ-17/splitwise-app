import logging
from fastapi import APIRouter, HTTPException, Depends
from app.database.connection import db
from app.auth import authorize_user

router = APIRouter()

@router.get("/balance/{user_id}")
async def get_balance(user_id: str, auth_user_id: str = Depends(authorize_user)):
    try:
        if user_id != auth_user_id:
            logging.warning(f"Unauthorized access attempt to balance for {user_id} by {auth_user_id}.")
            raise HTTPException(status_code=403, detail="Forbidden")

        # Retrieve the user's balance directly from the balances table
        user_balance = await db.balances.find_one({"user_id": user_id})
        if not user_balance:
            logging.warning(f"Balance record not found for user {user_id}.")
            raise HTTPException(status_code=404, detail="Balance not found")
        
        balance = user_balance["balance"]
        logging.info(f"Balance retrieved for user {user_id}: {balance}")
        return {"user_id": user_id, "balance": balance}
    
    except Exception as e:
        logging.error(f"Error retrieving balance for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
