from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    pass

class UserInDBBase(BaseModel):
    id: int
    username: str = Field(..., min_length=3, max_length=80)
    email: EmailStr

    class Config:
        from_attributes = True 
