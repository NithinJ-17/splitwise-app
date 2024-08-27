from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    password: str
