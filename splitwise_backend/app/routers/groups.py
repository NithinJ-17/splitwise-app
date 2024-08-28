import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.group import Group, GroupExpense
from app.database.connection import db
from app.auth import authorize_user
from app.utils import convert_currency, group_to_json 

router = APIRouter()

async def update_group_balances(expense: GroupExpense):
    try:
        for user_id, amount in expense.split_between.items():
            # Calculate how much the user owes
            balance_update = amount - expense.paid_by.get(user_id, 0)
            logging.info("balance : user : "+ str(user_id) + " balance :" +str(balance_update))
            # Update the user's balance
            await db.balances.update_one(
                {"user_id": user_id},
                {"$inc": {"balance": balance_update}},
                upsert=True
            )
        logging.info(f"Balances updated for group expense {expense.expense_id}.")
    except Exception as e:
        logging.error(f"Error updating group balances: {e}")

@router.post("/groups")
async def create_group(group: Group, user_id: str = Depends(authorize_user)):
    try:
        # Ensure all members exist in the database
        existing_users = await db.users.find({"user_id": {"$in": group.members}}).to_list(length=100)
        if len(existing_users) != len(group.members):
            logging.warning(f"Group creation attempt by {user_id}: some members do not exist.")
            raise HTTPException(status_code=400, detail="Some members do not exist")
        
        await db.groups.insert_one(group.dict())
        logging.info(f"Group '{group.name}' created by user {user_id}.")
        return {"message": "Group created successfully"}
    except Exception as e:
        logging.error(f"Error creating group: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/groups/{group_id}")
async def get_group(group_id: str, user_id: str = Depends(authorize_user)):
    try:
        group = await db.groups.find_one({"group_id": group_id})
        if not group:
            logging.warning(f"Group {group_id} not found.")
            raise HTTPException(status_code=404, detail="Group not found")
        
        # Convert the group to JSON format, ensuring _id is converted to a string
        group = group_to_json(group)
        
        # Ensure the user is a member of the group
        if user_id not in group["members"]:
            logging.warning(f"Unauthorized access attempt to group {group_id} by {user_id}.")
            raise HTTPException(status_code=403, detail="Forbidden")
        
        logging.info(f"Group {group_id} details retrieved for user {user_id}.")
        return group
    except Exception as e:
        logging.error(f"Error retrieving group {group_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.post("/groups/{group_id}/add_expense")
async def add_group_expense(group_id: str, expense: GroupExpense, user_id: str = Depends(authorize_user)):
    try:
        # Find the group
        existing_expense = await db.expenses.find_one({"expense_id": expense.expense_id})
        if existing_expense:
            logging.warning(f"Duplicate transaction attempt: Expense ID {expense.expense_id} already exists.")
            raise HTTPException(status_code=400, detail="Transaction with this Expense ID already exists.")
        group = await db.groups.find_one({"group_id": group_id})
        if not group:
            logging.warning(f"Group {group_id} not found.")
            raise HTTPException(status_code=404, detail="Group not found")
        
        # Ensure the user is a member of the group
        if user_id not in group["members"]:
            logging.warning(f"Unauthorized expense addition attempt to group {group_id} by {user_id}.")
            raise HTTPException(status_code=403, detail="Forbidden")

        # Ensure all members in the expense exist in the group
        if not set(expense.split_between.keys()).issubset(set(group["members"])):
            logging.warning(f"Expense addition attempt by {user_id}: some members are not in the group.")
            raise HTTPException(status_code=400, detail="Some members are not in the group")

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
            expense.currency = "USD"

        # Add the expense to the group's expense list
        group["expenses"].append(expense.dict())

        # Update the group's expenses in the database
        await db.groups.update_one({"group_id": group_id}, {"$set": {"expenses": group["expenses"]}})

        # Create an individual expense record in the expenses table
        individual_expense = {
            "expense_id": expense.expense_id,
            "description": expense.description,
            "amount": expense.amount,
            "currency": expense.currency,
            "paid_by": expense.paid_by,
            "split_between": expense.split_between,
            "group_id": group_id
        }

        await db.expenses.insert_one(individual_expense)

        # Update balances for each group member
        await update_group_balances(expense)

        logging.info(f"Expense '{expense.description}' added to group '{group['name']}' by user {user_id}.")
        return {"message": "Expense added successfully to the group", "group_id": group_id, "expense_id": expense.expense_id}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error adding expense to group {group_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

