import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.expense import Expense
from app.database.connection import db
from app.auth import authorize_user
from app.utils import convert_currency , expense_to_json # <-- Import the conversion function

router = APIRouter()


async def update_balances(expense: Expense):
    try:
        for user_id, amount in expense.split_between.items():
            # Calculate how much the user owes
            balance_update = amount - expense.paid_by.get(user_id, 0)
            
            # Update the user's balance
            await db.balances.update_one(
                {"user_id": user_id},
                {"$inc": {"balance": balance_update}},
                upsert=True
            )
        logging.info(f"Balances updated for expense {expense.expense_id}.")
    except Exception as e:
        logging.error(f"Error updating balances: {e}")

@router.post("/create_expenses")
async def create_expense(expense: Expense, user_id: str = Depends(authorize_user)):
    try:
        # Ensure all members exist in the database
        existing_expense = await db.expenses.find_one({"expense_id": expense.expense_id})
        if existing_expense:
            logging.warning(f"Duplicate transaction attempt: Expense ID {expense.expense_id} already exists.")
            raise HTTPException(status_code=400, detail="Transaction with this Expense ID already exists.")
        
        existing_users = await db.users.find({"user_id": {"$in": list(expense.split_between.keys())}}).to_list(length=100)
        if len(existing_users) != len(expense.split_between):
            logging.warning(f"Invalid expense creation attempt by {user_id}: some users do not exist.")
            raise HTTPException(status_code=400, detail="Some users do not exist")

        # Convert the main amount to USD if necessary
        if expense.currency != "USD":
            converted_amount = await convert_currency(expense.amount, expense.currency, "USD")
            expense.amount = converted_amount
            

        # Convert the 'paid_by' amounts to USD
            converted_paid_by = {}
            for payer, amount in expense.paid_by.items():
                logging.info("payer :" + str(payer) + "amount :"+str(amount))
                converted_amount = await convert_currency(amount, expense.currency, "USD")
                logging.info("converted_amount : "+str(converted_amount))

                converted_paid_by[payer] = converted_amount
            expense.paid_by = converted_paid_by

            # Convert the 'split_between' amounts to USD
            converted_split_between = {}
            for person, amount in expense.split_between.items():
                converted_amount = await convert_currency(amount, expense.currency, "USD")
                converted_split_between[person] = converted_amount
            expense.split_between = converted_split_between
            expense.currency = "USD"

        # Log the final packet before inserting it into the database
        logging.info(f"Final expense packet before insertion: {expense.dict()}")

        # Store the expense in the database
        await db.expenses.insert_one(expense.dict())
        logging.info(f"Expense '{expense.description}' created successfully by user {user_id}.")

        # Update balances for all involved users
        await update_balances(expense)
        logging.info(f"Balances updated successfully for expense '{expense.expense_id}'.")

        return {"message": "Expense created successfully", "expense_id": expense.expense_id}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error creating expense by user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
