import logging
from fastapi import APIRouter, HTTPException, Depends, Header
from app.models.expense import Expense
from app.database.connection import db
from app.auth import authorize_user
from app.utils import convert_currency, expense_to_json

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

@router.get("/expenses/{user_id}")
async def get_user_expenses(user_id: str, x_token: str = Header(...), auth_user_id: str = Depends(authorize_user)):
    try:
        # Authorize the user with the provided token
        if user_id != auth_user_id:
            logging.warning(f"Unauthorized access attempt for user ID: {user_id} by user {auth_user_id}.")
            raise HTTPException(status_code=403, detail="Forbidden: Unauthorized access")

        # Fetch all expenses where the user is involved
        expenses = await db.expenses.find({"$or": [
            {"paid_by." + user_id: {"$exists": True}},
            {"split_between." + user_id: {"$exists": True}}
        ]}).to_list(length=100)

        # Convert ObjectId fields to strings and replace user_ids with emails
        for expense in expenses:
            # Replace 'paid_by' user IDs with emails
            for payer_id in list(expense['paid_by'].keys()):
                user = await db.users.find_one({"user_id": payer_id})
                if user:
                    email = user['email']
                    expense['paid_by'][email] = expense['paid_by'].pop(payer_id)

            # Replace 'split_between' user IDs with emails
            for person_id in list(expense['split_between'].keys()):
                user = await db.users.find_one({"user_id": person_id})
                if user:
                    email = user['email']
                    expense['split_between'][email] = expense['split_between'].pop(person_id)

            # Replace 'group_id' with the group name
            if 'group_id' in expense:
                group = await db.groups.find_one({"group_id": expense['group_id']})
                if group:
                    expense['group_id'] = group['name']

            # Convert ObjectId fields to strings
            expense = expense_to_json(expense)

        if not expenses:
            logging.info(f"No expenses found for user ID: {user_id}.")
            return {"message": "No expenses found for this user"}

        logging.info(f"Expenses retrieved successfully for user ID: {user_id}.")
        return {"expenses": expenses}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error retrieving expenses for user ID {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

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

        # Store initial currency and amount before conversion
        initial_currency = expense.currency
        initial_amount = expense.amount

        # Convert the main amount to USD if necessary
        if expense.currency != "USD":
            converted_amount = await convert_currency(expense.amount, expense.currency, "USD")
            expense.amount = converted_amount

        # Convert the 'paid_by' amounts to USD
        converted_paid_by = {}
        for payer, amount in expense.paid_by.items():
            converted_amount = await convert_currency(amount, expense.currency, "USD")
            converted_paid_by[payer] = converted_amount
        expense.paid_by = converted_paid_by

        # Convert the 'split_between' amounts to USD
        converted_split_between = {}
        for person, amount in expense.split_between.items():
            converted_amount = await convert_currency(amount, expense.currency, "USD")
            converted_split_between[person] = converted_amount
        expense.split_between = converted_split_between
        expense.currency = "USD"  # Set currency to USD after conversion

        # Add initial currency and amount to the expense dictionary
        expense_dict = expense.dict()
        expense_dict["initial_currency"] = initial_currency
        expense_dict["initial_amount"] = initial_amount

        # Log the final packet before inserting it into the database
        logging.info(f"Final expense packet before insertion: {expense_dict}")

        # Store the expense in the database
        await db.expenses.insert_one(expense_dict)
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
