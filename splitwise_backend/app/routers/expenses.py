import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.expense import Expense
from app.database.connection import db
from app.auth import authorize_user
from app.utils import convert_currency , expense_to_json # <-- Import the conversion function

router = APIRouter()

@router.post("/create_expenses")
async def create_expense(expense: Expense, user_id: str = Depends(authorize_user)):
    try:
        # If the expense is associated with a group, check that the user is a member
        if expense.group_id:
            group = await db.groups.find_one({"group_id": expense.group_id})
            if not group:
                logging.warning(f"Group {expense.group_id} not found for expense creation by user {user_id}.")
                raise HTTPException(status_code=404, detail="Group not found")
            
            if user_id not in group["members"]:
                logging.warning(f"Unauthorized expense creation attempt in group {expense.group_id} by user {user_id}.")
                raise HTTPException(status_code=403, detail="User not authorized to add expenses to this group")
        
        # Validate that all users in the split exist
        existing_users = await db.users.find({"user_id": {"$in": list(expense.split_between.keys())}}).to_list(length=100)
        if len(existing_users) != len(expense.split_between):
            logging.warning(f"Invalid expense creation attempt by {user_id}: some users do not exist.")
            raise HTTPException(status_code=400, detail="Some users do not exist")

        # Convert the amount to the base currency (USD) if necessary
        if expense.currency != "USD":  # Assuming USD is the base currency
            expense.amount = await convert_currency(expense.amount, expense.currency, "USD")
            expense.currency = "USD"
        
        # Insert the expense into the database
        await db.expenses.insert_one(expense.dict())
        logging.info(f"Expense created successfully by user {user_id} in group {expense.group_id}.")
        return {"message": "Expense created successfully"}
    except Exception as e:
        logging.error(f"Error creating expense by user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/expenses/{user_id}")
async def get_expenses(user_id: str, auth_user_id: str = Depends(authorize_user)):
    try:
        if user_id != auth_user_id:
            logging.warning(f"Unauthorized attempt to access expenses for {user_id} by {auth_user_id}.")
            raise HTTPException(status_code=403, detail="Forbidden")
        
        expenses = await db.expenses.find({"split_between." + user_id: {"$exists": True}}).to_list(length=100)
        expenses = [expense_to_json(expense) for expense in expenses]
        logging.info(f"Expenses retrieved for user {user_id}.")
        return expenses
    
    except Exception as e:
        logging.error(f"Error retrieving expenses for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
