from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# Properties to receive via API on user creation
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6)

# Properties to receive via API on user update (allow optional fields)
# For now, let's assume username/email aren't updatable after creation
# Password update would likely be a separate endpoint/schema
class UserUpdate(BaseModel):
    pass # Add fields here if needed, e.g., is_active: Optional[bool] = None

# Base properties shared by models stored in DB
class UserInDBBase(BaseModel):
    id: int
    username: str = Field(..., min_length=3, max_length=80)
    email: EmailStr

    class Config:
        from_attributes = True # Renamed from orm_mode in Pydantic v2

# Properties to return to client (doesn't include password_hash)
class UserPublic(UserInDBBase):
    pass

# Additional properties stored in DB but not returned
# We don't really need this separation if UserPublic has all we need
class UserInDB(UserInDBBase):
    # password_hash: str # We don't usually send this back
    pass 