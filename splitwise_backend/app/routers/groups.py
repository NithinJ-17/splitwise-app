import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models.group import Group
from app.database.connection import db
from app.auth import authorize_user
from app.utils import group_to_json 

router = APIRouter()

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
