import logging
import uuid
from fastapi import APIRouter, HTTPException, Depends, Header
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
        # Generate a unique group ID
        group_id = str(uuid.uuid4())
        
        # Convert emails to user IDs
        member_user_ids = []
        for email in group.members:
            user = await db.users.find_one({"email": email})
            if not user:
                logging.warning(f"Group creation attempt by {user_id}: member with email {email} does not exist.")
                raise HTTPException(status_code=400, detail=f"User with email {email} does not exist")
            member_user_ids.append(user["user_id"])

        # Create the group object with the generated group ID and user IDs
        new_group = {
            "group_id": group_id,
            "name": group.name,
            "members": member_user_ids,
            "expenses": []
        }
        
        # Insert the group into the database
        await db.groups.insert_one(new_group)
        logging.info(f"Group '{group.name}' created by user {user_id}.")
        return {"message": "Group created successfully", "group_id": group_id}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
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
        
        # Ensure the user is a member of the group
        if user_id not in group["members"]:
            logging.warning(f"Unauthorized access attempt to group {group_id} by {user_id}.")
            raise HTTPException(status_code=403, detail="Forbidden")

        # Replace user IDs with emails in the group's expenses
        for expense in group.get("expenses", []):
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

        # Convert the group to JSON format, ensuring _id is converted to a string
        group = group_to_json(group)
        
        logging.info(f"Group {group_id} details retrieved for user {user_id}.")
        return group
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error retrieving group {group_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/user/groups")
async def get_user_groups(email: str, x_token: str = Header(...), auth_user_id: str = Depends(authorize_user)):
    try:
        # Ensure the email corresponds to the authenticated user
        user = await db.users.find_one({"email": email})
        if not user:
            logging.warning(f"No user found with email: {email}")
            raise HTTPException(status_code=404, detail="User not found")
        
        if user["user_id"] != auth_user_id:
            logging.warning(f"Unauthorized access attempt for user email: {email} by user {auth_user_id}.")
            raise HTTPException(status_code=403, detail="Forbidden: Unauthorized access")

        # Fetch all groups where the user is a member
        groups = await db.groups.find({"members": user["user_id"]}).to_list(length=100)

        if not groups:
            logging.info(f"No groups found for user email: {email}.")
            return {"message": "No groups found for this user"}

        # Replace user_id with corresponding emails in members list and convert ObjectId to strings
        for group in groups:
            member_emails = []
            for member_id in group["members"]:
                member = await db.users.find_one({"user_id": member_id})
                if member:
                    member_emails.append(member["email"])
            group["members"] = member_emails

            # Replace user_id with email in expenses
            for expense in group.get("expenses", []):
                # Replace 'paid_by' user IDs with emails
                for payer_id in list(expense['paid_by'].keys()):
                    payer = await db.users.find_one({"user_id": payer_id})
                    if payer:
                        email = payer['email']
                        expense['paid_by'][email] = expense['paid_by'].pop(payer_id)

                # Replace 'split_between' user IDs with emails
                for person_id in list(expense['split_between'].keys()):
                    person = await db.users.find_one({"user_id": person_id})
                    if person:
                        email = person['email']
                        expense['split_between'][email] = expense['split_between'].pop(person_id)

            # Convert ObjectId fields to strings
            group = group_to_json(group)

        logging.info(f"Groups retrieved successfully for user email: {email}.")
        return {"groups": groups}
    except HTTPException as http_exc:
        # Re-raise the HTTPException to be handled by FastAPI's exception handler
        raise http_exc
    except Exception as e:
        logging.error(f"Error retrieving groups for user email {email}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

       
@router.post("/groups/{group_id}/add_expense")
async def add_group_expense(group_id: str, expense: GroupExpense, user_id: str = Depends(authorize_user)):
    try:
        # Map emails to user_ids in 'paid_by' and 'split_between'
        async def map_emails_to_user_ids(email_dict):
            user_ids_dict = {}
            for email, amount in email_dict.items():
                user = await db.users.find_one({"email": email})
                if not user:
                    logging.warning(f"User with email {email} not found.")
                    raise HTTPException(status_code=400, detail=f"User with email {email} not found")
                user_ids_dict[user["user_id"]] = amount
            return user_ids_dict

        # Map emails to user_ids
        expense.paid_by = await map_emails_to_user_ids(expense.paid_by)
        expense.split_between = await map_emails_to_user_ids(expense.split_between)

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

        # Ensure all members in the 'split_between' and 'paid_by' exist in the group
        if not set(expense.split_between.keys()).issubset(set(group["members"])):
            logging.warning(f"Expense addition attempt by {user_id}: some members in 'split_between' are not in the group.")
            raise HTTPException(status_code=400, detail="Some members in 'split_between' are not in the group")
        
        if not set(expense.paid_by.keys()).issubset(set(group["members"])):
            logging.warning(f"Expense addition attempt by {user_id}: some members in 'paid_by' are not in the group.")
            raise HTTPException(status_code=400, detail="Some members in 'paid_by' are not in the group")

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
            expense.currency = "USD"

        # Add initial currency and amount to the expense dictionary
        expense_dict = expense.dict()
        expense_dict["initial_currency"] = initial_currency
        expense_dict["initial_amount"] = initial_amount

        # Add the expense to the group's expense list
        group["expenses"].append(expense_dict)

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
            "group_id": group_id,
            "initial_currency": initial_currency,  # Store initial currency
            "initial_amount": initial_amount        # Store initial amount
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
